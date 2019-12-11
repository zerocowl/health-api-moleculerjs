const { deburr, snakeCase } = require('lodash');
const Joi = require('joi');
const moment = require('moment');

module.exports = {
  name: 'subscription',

  actions: {
    create: {
      params: Joi.object().keys({
        account: Joi.object()
          .keys({
            cpf: Joi.string().required(),
            email: Joi.string()
              .email()
              .required(),
            first_name: Joi.string()
              .empty()
              .required(),
            last_name: Joi.string()
              .empty()
              .required(),
            msisdn: Joi.string()
              .empty()
              .length(13)
              .required()
          })
          .unknown(true)
          .required(),
        address: Joi.object()
          .keys({
            city: Joi.string().empty(),
            neighborhood: Joi.string().empty(),
            number: Joi.string().empty(),
            state: Joi.string().length(2),
            street: Joi.string().empty(),
            zip_code: Joi.string().empty()
          })
          .unknown(true)
          .required(),
        campaign_id: [Joi.string(), Joi.number()],
        channel_id: [Joi.string(), Joi.number()],
        media_id: [Joi.string(), Joi.number()],
        offer_id: [Joi.string(), Joi.number()],
        payment_method_id: [Joi.string(), Joi.number()],
        token: [Joi.string(), Joi.optional()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { account, ...payload } = ctx.params;
        account.user = account;
        account.patient = {};
        account.contacts = [{ category: 'mobile', number: account.msisdn }];
        payload.status = 'pending';
        payload.payment_provider_name = 'iugu';
        payload.account = account;
        const offer = await ctx.call('core.offer.findById', { id: payload.offer_id });
        const customer = await ctx.call('iugu.customer.create', payload);
        if (payload.payment_method_id === 1) {
          let creditCard = await ctx.call('iugu.customer.addCreditCard', {
            customer_id: customer.id,
            token: payload.token
          });
          if (!creditCard)
            throw new Error('Erro ao salvar cartão de crédito no gateway de pagamento');
          payload.credit_card = creditCard;
        }
        if (payload.payment_method_id !== 4) {
          let response = await ctx.call('iugu.subscription.create', {
            customer_id: customer.id,
            plan_identifier: snakeCase(deburr(offer.description)),
            expires_at: moment()
              .endOf('day')
              .add(3, 'day')
              .toDate()
          });
          if (!response) throw new Error('Erro ao criar assinatura no gateway de pagamento');
          if (payload.payment_method_id === 2 && response.recent_invoices.length <= 0) {
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
              'address',
              'credit_card',
              'invoices'
            ],
            ...opts
          });
          this.logger.info(subscription.invoices);
          await subscription.addAccounts(subscription.account.id, {
            through: {
              as: 'holder'
            },
            ...opts
          });
          await transaction.commit();
          subscription = subscription.get({ plain: true });
          let pbm_params = {
            birthday: subscription.account.birthday,
            cpf: subscription.account.cpf,
            first_name: subscription.account.first_name,
            gender: subscription.account.gender,
            last_name: subscription.account.last_name,
            city: subscription.address.city,
            msisdn: subscription.account.msisdn,
            state: subscription.address.state,
            subscription_id: subscription.id,
            periodicity: offer.periodicity
          };
          if (payload.status === 'active') {
            ctx.call('pbm.vidalink.enable', pbm_params);
          }
          ctx.call('core.benefit.enableAll', {
            subscription_id: subscription.id,
            offer_id: offer.id,
            status: payload.status
          });
          ctx.call('mailer.sendWithTemplate', {
            to: subscription.account.email,
            templateId: 'd-c50a736092a249788b127d5cd69a9d4d',
            dynamic_template_data: {
              patient_name: subscription.account.first_name,
              site_url: process.env.SITE_URL
            }
          });
          return subscription;
        } catch (err) {
          transaction.rollback();
          throw err;
        }
      }
    },

    enableService: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()],
        item_id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { id: subscriptionId, item_id: itemId } = ctx.params;
        const result = db.SubscriptionItem.update(
          {
            active: true
          },
          {
            where: { subscription_id: subscriptionId, item_id: itemId }
          }
        );
        return result;
      }
    },

    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      handler(ctx) {
        const db = this.db;
        const { params } = ctx;
        return db.Subscription.findByPk(params.id, {
          include: [
            {
              as: 'offer',
              model: db.Offer,
              include: ['plan', 'periodicity']
            },
            'credit_card',
            'payment_method',
            'address',
            {
              as: 'account',
              model: db.Account,
              include: ['contacts']
            },
            'invoices'
          ]
        });
      }
    },

    async findByUser(ctx) {
      const db = this.db;
      const user = ctx.meta.user;
      let subscription = await db.Subscription.findOne({
        include: [
          {
            as: 'account',
            model: db.Account,
            include: [
              {
                as: 'user',
                attributes: ['id', 'msisdn', 'cpf', 'active', 'email', 'scope'],
                model: db.User,
                where: user
              },
              'contacts',
              'patient',
              'professional'
            ],
            required: true
          },
          {
            as: 'accounts',
            model: db.Account,
            through: {
              where: { as: 'dependent' }
            }
          },
          'address',
          {
            as: 'offer',
            model: db.Offer,
            include: ['plan']
          },
          'credit_card',
          'payment_method',
          'invoices'
        ]
      });
      if (!subscription) throw new Error(`Nenhuma assinatura encontrada para este usuário`);
      subscription = subscription.get({ plain: true });
      subscription.items = await ctx.call('subscription.item.list', {
        id: subscription.id
      });
      return subscription;
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
        const { id, ...payload } = params;
        this.logger.info(meta);
        let subscription = await ctx.call('subscription.findById', { id });
        if (!subscription) {
          throw new Error(`Assinatura não encontrada com o id ${id}`);
        }
        const transaction = await db.sequelize.transaction();
        const opts = { transaction };
        try {
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
            if (payload.account.cpf) {
              let user = await subscription.account.getUser();
              await user.update(
                {
                  cpf: payload.account.cpf
                },
                opts
              );
            }
          }
          if (payload.address) {
            if (!subscription.address) {
              await subscription.createAddress(payload.address, opts);
            } else {
              await subscription.address.update(payload.address, opts);
            }
          }
          if (payload.contacts) {
            await subscription.setContacts(payload.contacts, opts);
          }
          if (payload.offer_id && payload.offer_id !== subscription.offer_id) {
            const offer = await ctx.call('core.offer.findById', { id: payload.offer_id });
            const customer = await ctx.call('iugu.customer.create', {
              ...subscription.get({ plain: true }),
              ...payload
            });
            if (payload.payment_method_id === 1) {
              const cc = await this.addCreditCard(customer.id, payload.token);
              await subscription.createCredit_card(cc, opts);
            }
            if (payload.payment_method_id !== 4) {
              let response = await ctx.call('iugu.subscription.create', {
                customer_id: customer.id,
                plan_identifier: snakeCase(deburr(offer.description)),
                expires_at: moment()
                  .endOf('day')
                  .add(3, 'day')
                  .toDate()
              });
              if (!response) throw new Error('Erro ao criar assinatura no gateway de pagamento');
              if (response.recent_invoices.length <= 0) {
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
                subscription.createInvoice(invoice, opts);
              }
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

          if (
            payload.payment_method_id &&
            payload.payment_method_id !== subscription.payment_method_id
          ) {
            let { payment_provider_id } = subscription;
            if (payload.payment_method_id === 1) {
              const { customer_id } = await ctx.call('iugu.subscription.fetch', {
                id: payment_provider_id
              });
              const cc = await this.addCreditCard(customer_id, payload.token);
              await subscription.createCredit_card(cc, opts);
            } else {
              // let { recent_invoices } = await ctx.call('iugu.subscription.activate', {
              //   id: payment_provider_id
              // });
              // this.logger.info(recent_invoices);
            }
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

  methods: {
    async addCreditCard(customer_id, token) {
      let cc = await this.broker.call('iugu.customer.addCreditCard', {
        customer_id,
        token
      });
      if (!cc) throw new Error(`Erro ao salvar a forma de pagamento`);
      return cc;
    },

    async createInvoice(subscription_id, invoices) {
      if (invoices.length <= 0) {
        this.logger.info(`Fatura não gerada imediatamente`);
        await setTimeout(async () => {
          const data = await this.broker.call('iugu.subscription.fetch', { id: subscription_id });
          invoices = data.recent_invoices;
        }, 15000);
      }
      let [invoice] = invoices;
      return {
        due_date: invoice.due_date,
        base_value: invoice.price_cents,
        status: invoice.status,
        payment_provider_id: invoice.id,
        url: `${invoice.secure_url}.pdf`
      };
    }
  },

  started() {
    this.db = require('../repository');
  }
};
