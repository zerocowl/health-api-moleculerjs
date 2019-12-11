const { replace } = require('lodash');
const Joi = require('joi');

module.exports = {
  name: 'core.subscription',

  actions: {
    findByMSISDN: {
      params: Joi.object().keys({
        msisdn: Joi.string().required()
      }),
      async handler(ctx) {
        const db = this.db;
        let { msisdn } = ctx.params;
        msisdn = replace(msisdn, /[^A-Z0-9]/gi, '');
        if (msisdn.length < 13) msisdn = '55'.concat(msisdn);
        return db.Subscription.findOne({
          include: [
            {
              as: 'account',
              model: db.Account,
              include: ['user']
            },
            'offer'
          ],
          subQuery: false,
          where: { '$account.user.msisdn$': msisdn }
        });
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
