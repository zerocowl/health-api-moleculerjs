const Joi = require('joi');

module.exports = {
  name: 'location.procedure',

  actions: {
    create: {
      params: Joi.object().keys({
        location_id: [Joi.number().required(), Joi.string().required()]
      }),
      handler(ctx) {
        const db = this.db;
        return db.LocationProcedure.create(ctx.params, {
          include: ['price_quotations']
        });
      }
    },

    findOne: {
      params: Joi.object().keys({
        id: Joi.any().required()
      }),
      async handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        const result = await db.LocationProcedure.findByPk(id);
        if (!result) throw new Error(`Serviço de atendimento não encontrado com id ${id}`);
        return result;
      }
    },

    findById: {
      params: Joi.object().keys({
        location_id: Joi.any().required(),
        specialty_id: Joi.any().required()
      }),
      async handler(ctx) {
        const db = this.db;
        const { location_id, specialty_id } = ctx.params;
        const result = await db.LocationProcedure.findOne({
          where: {
            location_id,
            specialty_id
          },
          include: [
            {
              as: 'location',
              model: db.Location,
              include: ['address']
            },
            'specialty'
          ]
        });
        if (!result) throw new Error(`Especialidade ${specialty_id} não encontrada`);
        return result;
      }
    },

    list: {
      params: Joi.object().keys({
        location_id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { location_id: locationId } = ctx.params;
        const { count, rows: specialties } = await db.LocationProcedure.findAndCountAll({
          where: { location_id: locationId }
        });
        return { count, specialties };
      }
    },

    update: {
      params: {
        id: 'string'
      },
      async handler({ meta, params }) {
        const db = this.db;
        meta.$statusCode = 204;
        const { id, ...payload } = params;
        const locationProcedure = await db.LocationProcedure.findByPk(id);
        if (!locationProcedure) throw new Error(`Especialidade não encontrada com id ${id}`);
        return locationProcedure.update(payload);
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
