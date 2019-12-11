const Joi = require('joi');

module.exports = {
  name: 'backoffice.professional',

  actions: {
    findOrCreate: {
      params: Joi.object().keys({
        council_id: Joi.number(),
        council_state: Joi.string(),
        registration_number: Joi.string().required(),
        account: Joi.object().keys({
          email: Joi.string(),
          msisdn: Joi.string(),
          first_name: Joi.string(),
          last_name: Joi.string()
        })
      }),
      async handler(ctx) {
        const db = this.db;
        let { council_id, council_state, registration_number, account } = ctx.params;
        let { user, created } = await this.findOrCreateUser(account);
        if (created) {
          let professional = await this.findByUser(user.id);
          if (professional) return professional;
        }
        return db.Professional.create({
          council_id,
          council_state,
          registration_number,
          account: { ...account, user_id: user.id }
        });
      }
    }
  },

  methods: {
    findByUser(user_id) {
      const db = this.db;
      return db.Professional.findOne({
        include: ['account'],
        subQuery: false,
        where: { '$account.user_id$': user_id }
      });
    },

    async findOrCreateUser({ msisdn, email, cpf }) {
      const db = this.db;
      const { Op } = db.sequelize;
      const scope = 'professional';
      let [user, created] = await db.User.findOrCreate({
        where: {
          [Op.or]: [{ msisdn }, { cpf }, { email }]
        },
        defaults: {
          msisdn,
          cpf,
          scope,
          email
        }
      });
      return { user, created };
    }
  },

  started() {
    this.db = require('../repository');
  }
};
