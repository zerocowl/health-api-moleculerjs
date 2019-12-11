const axios = require('axios');
const IuguMixin = require('../mixins/iugu.mixin');
const Joi = require('joi');
const moment = require('moment');

module.exports = {
  name: 'invoice',

  mixins: [IuguMixin],

  actions: {
    async postback(ctx) {
      const db = this.db;
      const { meta, params } = ctx;
      const { data, event } = params;
      const payment_provider_id = data.subscription_id;
      switch (event) {
        case 'invoice.created': {
          let subscription = await db.Subscription.findOne({
            where: { payment_provider_id }
          });
          if (!subscription)
            throw new Error(`Assinatura não encontrado com id ${payment_provider_id}`);
          await db.Invoice.findOrCreate({
            where: { payment_provider_id: data.id },
            defaults: {
              due_date: data.due_date,
              base_value: data.price_cents,
              status: data.status,
              payment_provider_id: data.id,
              subscription_id: subscription.id,
              url: `${data.secure_url}.pdf`
            }
          });
          if (subscription.payment_method_id !== 1) {
            axios.post(
              `${this.baseURL}/v1/invoices/${data.id}/send_email`,
              {},
              this.requestOptions
            );
          }
          break;
        }
        case 'invoice.status_changed': {
          let invoice = await db.Invoice.findOne({
            where: { payment_provider_id: data.id }
          });
          if (!invoice) throw new Error(`Fatura não encontrada com id ${data.id}`);
          await invoice.update({
            status: data.status,
            charged_value: invoice.base_value,
            payment_date: new Date()
          });
          if (data.status === 'paid') {
            let subscription = await invoice.getSubscription({
              include: [
                {
                  as: 'offer',
                  model: db.Offer,
                  include: ['plan', 'periodicity']
                },
                'account',
                'address'
              ]
            });
            let previous_status = subscription.status;
            let { interval, interval_type } = subscription.offer.periodicity;
            let renewal_date = moment()
              .startOf('day')
              .toDate();
            let next_renewal_date = moment()
              .add(interval, interval_type)
              .endOf('day')
              .toDate();
            await ctx.call('iugu.subscription.update', {
              id: subscription.payment_provider_id,
              expires_at: moment()
                .add(interval, interval_type)
                .format()
            });
            subscription = await subscription.update(
              {
                renewal_date,
                next_renewal_date,
                status: 'active'
              },
              {
                context: { user_agent: meta.userAgent }
              }
            );

            subscription = subscription.get({ plain: true });
            if (previous_status !== data.status) {
              const pbm_params = {
                birthday: subscription.account.birthday,
                cpf: subscription.account.cpf,
                first_name: subscription.account.first_name,
                gender: subscription.account.gender,
                last_name: subscription.account.last_name,
                city: subscription.address.city,
                msisdn: subscription.account.getDataValue('msisdn'),
                state: subscription.address.state,
                subscription_id: subscription.id,
                periodicity: { interval, interval_type }
              };
              ctx.call('pbm.vidalink.enable', pbm_params);
              ctx.call('core.benefit.updateAll', {
                subscription_id: subscription.id,
                status: subscription.status
              });
              ctx.call('sms.send', {
                msisdn: pbm_params.msisdn,
                payment_provider_name: subscription.payment_provider_name,
                text: `Obrigado ${
                  pbm_params.first_name
                }. Recebemos o pagamento do seu boleto DoutorJá`
              });
            }
            return true;
          }
          break;
        }
        case 'subscription.renewed': {
          let subscription = await db.Subscription.findOne({
            where: { payment_provider_id: data.id },
            include: [
              {
                as: 'offer',
                model: db.Offer,
                include: ['plan', 'periodicity']
              },
              'account'
            ]
          });
          await ctx.call('iugu.subscription.update', {
            id: subscription.payment_provider_id,
            expires_at: moment()
              .add(subscription.offer.periodicity_id === 3 ? 12 : 1, 'month')
              .format()
          });
          await subscription.update(
            {
              renewal_date: moment()
                .startOf('day')
                .format(),
              next_renewal_date: moment()
                .add(subscription.offer.periodicity_id === 3 ? 12 : 1, 'month')
                .endOf('day')
                .format(),
              status: 'active'
            },
            {
              context: { user_agent: meta.userAgent }
            }
          );
          ctx.emit(`notifications.payment_received`, subscription.get({ plain: true }));
          return true;
        }
        case 'subscription.suspended': {
          let subscription = await db.Subscription.findOne({
            where: { payment_provider_id: data.id }
          });
          if (!subscription) throw new Error(`Assinatura não encontrada com id ${data.id}`);
          await subscription.update({
            status: 'suspended'
          });
          return true;
        }
      }
    },

    create({ params }) {
      const db = this.db;
      return db.Invoice.create(params);
    },

    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      handler({ params }) {
        const db = this.db;
        return db.Invoice.findByPk(params.id);
      }
    },

    remove: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler({ meta, params }) {
        const db = this.db;
        meta.$statusCode = 204;
        const invoice = await db.Invoice.findByPk(params.id);
        if (!invoice) throw new Error(`Fatura não encontrada com id ${params.id}`);
        return invoice.destroy();
      }
    },

    async list() {
      const db = this.db;
      const { count, rows: invoices } = await db.Invoice.findAndCountAll;
      return { count, invoices };
    },

    update: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler({ meta, params }) {
        const db = this.db;
        meta.$statusCode = 204;
        const { id, ...payload } = params;
        const invoice = await db.Invoice.findByPk(id);
        if (!invoice) throw new Error(`Fatura não encontrada com id ${id}`);
        return invoice.update(payload);
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
