const Joi = require('joi');
const { deburr, snakeCase, sampleSize } = require('lodash');
const moment = require('moment');

module.exports = {
  name: 'backoffice.subscription',

  actions: {
    create: {
      params: Joi.object().keys({
        account: Joi.object()
          .keys({
            first_name: Joi.string()
              .empty()
              .required(),
            last_name: Joi.string()
              .empty()
              .required(),
            msisdn: Joi.string()
              .empty()
              .required()
          })
          .unknown(true)
          .required(),
        address: Joi.object()
          .keys({
            street: Joi.string().empty(),
            number: Joi.string().empty(),
            neighborhood: Joi.string().empty(),
            state: Joi.string().length(2),
            city: Joi.string().empty(),
            zip_code: Joi.string().empty()
          })
          .unknown(true)
          .required(),
        offer_id: [Joi.string(), Joi.number()],
        campaign_id: [Joi.string(), Joi.number()],
        channel_id: [Joi.string(), Joi.number()],
        media_id: [Joi.string(), Joi.number()],
        payment_method_id: [Joi.string(), Joi.number()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { account, ...payload } = ctx.params;
        this.logger.info(ctx.meta.user);
        account.user = account;
        let password = sampleSize('bcdfghjlmnpqrstvxz', 6).join('');
        account.user.password = password;
        account.patient = {};
        if (account.msisdn) {
          account.contacts = [{ category: 'mobile', number: account.msisdn }];
        }
        payload.status = 'active';
        payload.account = account;
        const offer = await db.Offer.findByPk(payload.offer_id, {
          include: ['plan']
        });
        if (!offer || !offer.plan) {
          throw new Error('Plano não identificado');
        }
        if (payload.payment_method_id !== 4) {
          const customer = await ctx.call('iugu.customer.create', payload);
          let response = await ctx.call('iugu.subscription.create', {
            customer_id: customer.id,
            plan_identifier: snakeCase(deburr(offer.description)),
            expires_at: moment()
              .endOf('day')
              .add(3, 'day')
              .toDate()
          });
          if (!response) throw new Error('Erro ao criar assinatura no gateway de pagamento');
          if (payload.payment_method_id === 3 && response.recent_invoices.length <= 0) {
            this.logger.info(`Fatura não gerada imediatamente`);
            await setTimeout(async () => {
              response = await ctx.call('iugu.subscription.fetch', { id: response.id });
            }, 15000);
          }
          payload.payment_provider_id = response.id;
          if (response.recent_invoices.length > 0) {
            let invoice = {
              due_date: response.recent_invoices[0].due_date,
              base_value: response.price_cents,
              status: response.recent_invoices[0].status,
              payment_provider_id: response.recent_invoices[0].id,
              url: `${response.recent_invoices[0].secure_url}.pdf`
            };
            payload.invoices = [invoice];
          }
        }
        payload.status = payload.payment_method_id === 2 ? 'pending' : 'active';
        const items = await offer.getItems();
        const transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          payload.uid = Math.floor(1 * Math.pow(10, 15) + Math.random() * (9 * Math.pow(10, 15)));
          let subscription = await db.Subscription.create(payload, {
            include: [
              {
                as: 'account',
                model: db.Account,
                include: ['user', 'patient', 'contacts']
              },
              'address'
            ],
            ...opts
          });
          await subscription.addAccounts(subscription.account.id, {
            through: {
              as: 'holder'
            },
            ...opts
          });
          await Promise.all(
            items.map(item => {
              return db.SubscriptionItem.create(
                {
                  subscription_id: subscription.id,
                  item_id: item.id,
                  active: item.default
                },
                opts
              );
            })
          );
          await transaction.commit();
          if (subscription.account.email) {
            ctx.call('mailer.sendWithTemplate', {
              to: subscription.account.email,
              templateId: 'd-c50a736092a249788b127d5cd69a9d4d',
              dynamic_template_data: {
                patient_name: subscription.account.first_name,
                site_url: process.env.SITE_URL
              }
            });
          }
          ctx.call('sms.send', {
            msisdn: subscription.account.getDataValue('msisdn'),
            payment_provider_name: subscription.payment_provider_name,
            text: `Bem Vindo! Utilize a senha ${password} para acessar doutorja.com.br`
          });
          return subscription;
        } catch (err) {
          transaction.rollback();
          throw err;
        }
      }
    },

    update: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { meta, params } = ctx;
        this.logger.info(meta.user); // Operador que atualizou a assinatura
        const { id, ...payload } = params;
        this.logger.info(meta);
        let subscription = await ctx.call('subscription.findById', { id: id });
        if (!subscription) {
          throw new Error(`Assinatura não encontrada com o id ${id}`);
        }
        let transaction;
        transaction = await db.sequelize.transaction();
        try {
          const opts = { transaction: transaction };
          if (payload.account) {
            if (payload.account.avatar && payload.account.avatar.length > 500) {
              const filePath = await ctx.call('s3.storage.upload', {
                identifier: subscription.account.id,
                base64String: payload.account.avatar
              });
              if (!filePath) throw new Error('Não foi possível salvar a imagem do avatar');
              payload.account.avatar = filePath;
            }
            await subscription.account.update(payload.account, opts);
          }
          if (payload.address) {
            await subscription.address.update(payload.address, opts);
          }
          if (payload.contacts) {
            await subscription.setContacts(payload.contacts, opts);
          }
          if (payload.offer_id) {
            const offer = await db.Offer.findByPk(payload.offer_id, {
              include: ['plan']
            });
            if (!offer || !offer.plan) {
              throw new Error('Plano não identificado');
            }
            await db.SubscriptionItem.destroy(
              {
                where: { subscription_id: subscription.id }
              },
              opts
            );
            const items = await offer.getItems();
            await Promise.all(
              items.map(item => {
                return db.SubscriptionItem.create(
                  {
                    subscription_id: subscription.id,
                    item_id: item.id,
                    active: item.default
                  },
                  opts
                );
              })
            );
          }
          await subscription.update(payload, opts);
          await transaction.commit();
          return subscription.reload();
        } catch (err) {
          this.logger.error(err);
          transaction.rollback();
          throw err;
        }
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
