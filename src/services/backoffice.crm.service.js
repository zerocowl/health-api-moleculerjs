const Joi = require('joi');

module.exports = {
  name: 'backoffice.crm',

  actions: {
    createRequest: {
      params: Joi.object().keys({
        category_id: [Joi.string().required(), Joi.number().required()],
        contact: Joi.object().keys({
          full_name: Joi.string().required(),
          msisdn: Joi.string().required(),
        }).unknown(true)
      }).unknown(true),

      async handler(ctx) {
        const db = this.db;
        const {contact, ...params} = ctx.params;
        let [data, created] = await db.CrmContact.findOrCreate({
          where: {
            msisdn: contact.msisdn
          },
          defaults: contact
        })
        let result = await data.createRequest(params);

        return result;
      }

    },

    findByUser: {
      params: Joi.object().keys({
        msisdn: Joi.string().required()
      }),
      async handler (ctx) {
        const db = this.db;
        const { Op } = db.sequelize;
        let { msisdn } = ctx.params;
        msisdn = msisdn.replace(/[^A-Z0-9]/gi, '');
        let result = await db.Account.findOne({
          where: {
            msisdn: {
              [Op.like]: `%${msisdn}%`
            }
          }
        })
        if (!result) {
          ctx.meta.$statusCode = 404;
          return false;
        }
        return result;
      }
    }
  },
  
  
  started() {
    this.db = require('../repository');
  }
}