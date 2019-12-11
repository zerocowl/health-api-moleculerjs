const Joi = require('joi');

module.exports = {
  name: 'claro.subscription',

  actions: {
    create: {
      params: Joi.object().keys({
        account: Joi.object()
          .keys({
            msisdn: Joi.string()
              .empty()
              .length(13)
              .required()
          })
          .unknown(true)
          .required(),
        campaign_id: [Joi.number(), Joi.string()],
        channel_id: [Joi.number(), Joi.string()],
        media_id: [Joi.number(), Joi.string()],
        next_renewal_date: [Joi.string(), Joi.date()],
        offer_id: [Joi.string().required(), Joi.number().required()],
        payment_provider_id: Joi.string().required(),
        renewal_date: [Joi.string(), Joi.date()],
        status: Joi.string().empty()
      }),
      async handler(ctx) {
        const db = this.db;
        const { account, ...payload } = ctx.params;
        let subscription = await this.findByMSISDN(account.msisdn);
        if (subscription && subscription.status === 'canceled') {
          let account = await subscription.getAccount();
          await account.update(account);
          subscription = await subscription.update(payload);
          subscription = await subscription.reload();
          return subscription;
        }
        const exists = await ctx.call('user.exists', account);
        if (exists) throw new Error(`Uma assinatura com o MSISDN ${account.msisdn} já existe`);
        const transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          account.user = account;
          account.patient = {};
          payload.account = account;
          payload.payment_method_id = 3;
          payload.payment_provider_name = 'claro';
          payload.uid = Math.floor(1 * Math.pow(10, 15) + Math.random() * (9 * Math.pow(10, 15)));
          subscription = await db.Subscription.create(payload, {
            include: [
              {
                as: 'account',
                model: db.Account,
                include: ['user', 'patient']
              },
              'invoices'
            ],
            ...opts
          });
          await subscription.addAccounts(subscription.account.id, {
            through: {
              as: 'holder'
            },
            ...opts
          });
          await transaction.commit();
          subscription = subscription.get({ plain: true });
          return subscription;
        } catch (err) {
          await transaction.rollback();
          this.logger.error(err);
          throw err;
        }
      }
    },

    find: {
      params: Joi.object().keys({
        msisdn: Joi.string()
          .length(13)
          .required()
      }),
      async handler(ctx) {
        const { params } = ctx;
        let subscription = this.findByMSISDN(params.msisdn);
        if (!subscription) {
          ctx.meta.$statusCode = 404;
          throw new Error(`Nenhuma assinatura encontrada com o MSISDN ${params.msisdn}`);
        }
        return subscription;
      }
    },

    update: {
      params: Joi.object().keys({
        payment_provider_id: Joi.string().required()
      }),
      async handler(ctx) {
        const db = this.db;
        ctx.meta.$statusCode = 204;
        const { params, meta } = ctx;
        const { account: accountUpdates, payment_provider_id: id, ...payload } = params;
        const transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          let subscription = await db.Subscription.findOne({
            where: { payment_provider_id: id }
          });
          if (accountUpdates) {
            const account = await subscription.getAccount(opts);
            await account.update(accountUpdates, opts);
            const user = await account.getUser(opts);
            await user.update(accountUpdates, opts);
          }
          if (payload.invoice) {
            await subscription.createInvoice(
              {
                payment_provider_id: subscription.payment_provider_id,
                status: 'paid',
                ...payload.invoice
              },
              opts
            );
          }
          if (payload.status && payload.status === 'canceled') {
            payload.cancellation_date = new Date();
          }
          await subscription.update(payload, {
            context: {
              user_agent: meta.userAgent
            },
            ...opts
          });
          await transaction.commit();
          return true;
        } catch (err) {
          await transaction.rollback();
          throw err;
        }
      }
    }
  },

  methods: {
    findByMSISDN(msisdn) {
      const db = this.db;
      return db.Subscription.findOne({
        include: [
          {
            as: 'account',
            attributes: ['cpf', 'email', 'id', 'msisdn'],
            model: db.Account,
            include: ['user'],
            required: true
          },
          'invoices',
          {
            as: 'offer',
            model: db.Offer,
            include: ['plan', 'periodicity']
          }
        ],
        subQuery: false,
        where: {
          '$account.user.msisdn$': msisdn
        }
      });
    }
  },

  started() {
    this.db = require('../repository');
  }
};
