const { toLower } = require('lodash');
const ddd = require('../libs/ddd');

module.exports = {
  name: 'mobile.notification',

  actions: {
    async update(ctx) {
      const db = this.db;
      const {
        msisdn,
        payment_provider_id,
        channel_id = 4,
        status,
        cancellation_reason,
        next_renewal_date,
        charged_value
      } = ctx.params;
      const MOBILE_OFFER_ID = 1;
      const payment_provider_name = 'claro';
      const payment_method_id = 3;
      let subscription = await ctx.call('core.subscription.findByMSISDN', { msisdn });
      if (!subscription) {
        let transaction = await db.sequelize.transaction();
        try {
          subscription = await db.Subscription.create(
            {
              account: {
                msisdn,
                user: {
                  msisdn
                }
              },
              campaign_id: 1,
              channel_id,
              invoices: [
                {
                  charged_value,
                  due_date: new Date(),
                  payment_date: toLower(status) === 'active' ? new Date() : null
                }
              ],
              media_id: 1,
              next_renewal_date,
              offer_id: MOBILE_OFFER_ID,
              payment_method_id,
              payment_provider_id,
              payment_provider_name,
              renewal_date: new Date(),
              status: toLower(status),
              uid: Math.floor(1 * Math.pow(10, 15) + Math.random() * (9 * Math.pow(10, 15)))
            },
            {
              include: [
                {
                  as: 'account',
                  model: db.Account,
                  include: ['user']
                },
                'address',
                'invoices'
              ],
              transaction
            }
          );
          await transaction.commit();
        } catch (err) {
          await transaction.rollback();
          throw err;
        }
        await ctx.call('core.benefit.enableAll', {
          subscription_id: subscription.id,
          offer_id: MOBILE_OFFER_ID,
          status: subscription.status
        });
        await db.SubscriptionAccount.create({
          subscription_id: subscription.id,
          account_id: subscription.account_id,
          as: 'holder'
        });
      } else {
        let cancellation_date;
        if (/cancel*led/gi.test(status)) {
          cancellation_date = new Date();
        }
        subscription = await subscription.update({
          status: toLower(status),
          next_renewal_date: next_renewal_date,
          cancellation_reason,
          cancellation_date
        });
      }

      let { city, state } = ddd(msisdn);
      let { id: subscription_id } = subscription;
      let pbm_params = {
        birthday: subscription.account.birthday,
        city,
        cpf: subscription.account.cpf,
        first_name: subscription.account.first_name,
        gender: subscription.account.gender,
        last_name: subscription.account.last_name,
        msisdn,
        periodicity: { interval: 7, interval_type: 'day' },
        state,
        subscription_id
      };
      if (subscription.status === 'active') {
        if (!subscription.account.pending_for_pbm) {
          ctx.call('pbm.vidalink.enable', pbm_params);
        }
      } else if (subscription.status === 'trial') {
        if (!subscription.account.pending_for_pbm) {
          ctx.call('pbm.vidalink.disable', pbm_params);
        }
      } else if (
        subscription.status === 'canceled' ||
        subscription.status === 'pending' ||
        subscription.status === 'suspended'
      ) {
        if (!subscription.account.pending_for_pbm) {
          ctx.call('pbm.vidalink.disable', pbm_params);
        }
        ctx.call('core.benefit.updateAll', { subscription_id, status });
      } else {
        this.revokeAccess(subscription.account.user_id);
      }

      return subscription;
    }
  },

  methods: {
    async revokeAccess(user_id) {
      const db = this.db;
      let accessTokens = await db.OAuthAccessToken.findAll({
        include: ['user'],
        subQuery: false,
        where: { '$user.id$': user_id }
      });
      await Promise.all(accessTokens.map(token => token.destroy()));
      let refreshTokens = await db.OAuthRefreshToken.findAll({
        include: ['user'],
        subQuery: false,
        where: { '$user.id$': user_id }
      });
      await Promise.all(refreshTokens.map(token => token.destroy()));
    }
  },

  started() {
    this.db = require('../repository');
  }
};
