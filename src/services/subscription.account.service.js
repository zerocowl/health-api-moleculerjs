const Joi = require('joi');

module.exports = {
  name: 'subscription.account',

  actions: {
    create: {
      params: Joi.object()
        .keys({
          id: [Joi.string().required(), Joi.number().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { id: subscriptionId, ...payload } = ctx.params;
        const subscription = await db.Subscription.findByPk(subscriptionId, {
          include: [
            'account',
            {
              as: 'accounts',
              model: db.Account
            }
          ]
        });
        if (!subscription) throw new Error(`Assinatura não encontrada com id ${subscriptionId}`);
        if (subscription.accounts && subscription.accounts.length >= 4) {
          throw new Error(`Assinatura pode conter no máximo 3 dependentes`);
        }
        if (!payload.msisdn) {
          payload.msisdn = subscription.account.msisdn;
        }
        return db.SubscriptionAccount.create(
          {
            as: 'dependent',
            subscription_id: subscriptionId,
            account: { ...payload, user_id: subscription.account.user_id }
          },
          {
            include: [
              {
                as: 'account',
                model: db.Account,
                include: ['contacts']
              }
            ]
          }
        );
      }
    },

    findById: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { id: subscriptionId, account_id: accountId } = ctx.params;
        const subscriptionAccount = await db.SubscriptionAccount.findOne({
          where: {
            account_id: accountId,
            subscription_id: subscriptionId
          },
          include: [
            {
              as: 'account',
              model: db.Account,
              include: ['contacts']
            }
          ]
        });
        if (!subscriptionAccount) {
          throw new Error(`Conta não encontrada, assinatura ${subscriptionId}, id ${accountId}`);
        }
        return subscriptionAccount.account;
      }
    },

    update: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()],
          account_id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { id: subscriptionId, account_id: accountId, ...payload } = ctx.params;
        const subscriptionAccount = await db.SubscriptionAccount.findOne({
          where: {
            subscription_id: subscriptionId,
            account_id: accountId
          },
          include: ['account']
        });
        if (!subscriptionAccount) {
          throw new Error(`Conta não encontrada, assinatura ${subscriptionId}, id ${accountId}`);
        }
        return subscriptionAccount.account.update(payload);
      }
    },

    list: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        const { count, rows: accounts } = await db.Account.findAndCountAll({
          include: [
            {
              as: 'subscriptions',
              attributes: [],
              model: db.Subscription,
              through: {
                where: { as: 'dependent' }
              },
              where: { id: id }
            },
            'contacts'
          ]
        });
        return { count, accounts };
      }
    },

    remove: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()],
          account_id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { id: subscriptionId, account_id: accountId } = ctx.params;
        const subscriptionAccount = await db.SubscriptionAccount.findOne({
          where: {
            subscription_id: subscriptionId,
            account_id: accountId
          },
          include: ['account']
        });
        let transaction = null;
        transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          await subscriptionAccount.account.destroy(opts);
          const result = await subscriptionAccount.destroy(opts);
          await transaction.commit();
          ctx.meta.$statusCode = 204;
          return result;
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
