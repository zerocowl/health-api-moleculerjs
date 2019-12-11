const Joi = require('joi');

module.exports = {
  name: 'specialty',

  actions: {
    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        return db.Specialty.findByPk(id, {
          attributes: {
            include: [[db.sequelize.col('council.acronym'), 'council_acronym']]
          },
          include: [
            {
              as: 'council',
              attributes: [],
              model: db.Council
            }
          ]
        });
      }
    },

    list() {
      const db = this.db;
      return db.Specialty.findAndCountAll({
        attributes: {
          include: [[db.sequelize.col('council.acronym'), 'council_acronym']]
        },
        include: [
          {
            as: 'council',
            attributes: [],
            model: db.Council
          }
        ],
        order: [['name', 'ASC']]
      });
    },

    update: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler({ meta, params }) {
        const db = this.db;
        meta.$statusCode = 204;
        const { id, ...payload } = params;
        const specialty = await db.Specialty.findByPk(id);
        if (!specialty) throw new Error(`Especialidade não encontrada com id ${id}`);
        return specialty.update(payload);
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
