const { MoleculerError } = require('moleculer').Errors;
const Joi = require('joi');

module.exports = {
  name: 'core.location.procedure',

  actions: {
    create: {
      params: Joi.object()
        .keys({
          base_value: Joi.number().required(),
          location_id: [Joi.number().required(), Joi.string().required()],
          specialty_id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const {
          base_value,
          days_to_next_appointment,
          discount,
          location_id,
          restrictions_min_age,
          specialty_id
        } = ctx.params;
        return db.LocationProcedure.create({
          base_value,
          days_to_next_appointment,
          discount,
          location_id,
          procedure_id: 1,
          restrictions_min_age,
          specialty_id
        });
      }
    },

    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        const location_procedure = await db.LocationProcedure.findByPk(id, {
          include: ['specialty']
        });
        if (!location_procedure)
          throw new MoleculerError(`Serviço de consulta não encontrado com id ${id}`);
        return location_procedure;
      }
    },

    findBySpecialty: {
      params: Joi.object().keys({
        location_id: [Joi.number().required(), Joi.string().required()],
        specialty_id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        const location_procedure = await db.LocationProcedure.findByPk(id, {
          include: ['specialty']
        });
        if (!location_procedure)
          throw new MoleculerError(`Serviço de consulta não encontrado com id ${id}`);
        return location_procedure;
      }
    },

    list: {
      params: Joi.object().keys({
        location_id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { location_id } = ctx.params;
        const { count, rows: location_procedures } = await db.LocationProcedure.findAndCountAll({
          where: { location_id }
        });
        return { count, location_procedures };
      }
    },

    update: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {}
    }
  },

  started() {
    this.db = require('../repository');
  }
};
