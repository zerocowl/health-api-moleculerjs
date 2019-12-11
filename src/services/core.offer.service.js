const { MoleculerError } = require('moleculer').Errors;
const Joi = require('joi');

module.exports = {
  name: 'core.offer',

  actions: {
    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        let offer = await db.Offer.findByPk(id, {
          include: [
            'payment_methods',
            'plan',
            'periodicity',
            {
              as: 'items',
              attributes: ['id', 'category', ['title', 'name']],
              model: db.Item
            }
          ]
        });
        if (!offer) throw new MoleculerError(`Oferta não encontrada com id ${id}`, 404);
        return offer.get({ plain: true });
      }
    },

    groupByPeriodicity: {
      params: Joi.object().keys({
        channel_id: [Joi.string(), Joi.number()],
        media_id: [Joi.string(), Joi.number()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { media_id } = ctx.params;
        let { count, rows: periodicities } = await db.Periodicity.findAndCountAll({
          distinct: true,
          subQuery: false,
          include: [
            {
              as: 'offers',
              model: db.Offer,
              include: [
                'plan',
                {
                  as: 'items',
                  model: db.Item,
                  attributes: [['title', 'name']]
                },
                'payment_methods',
                'medias'
              ]
            }
          ],
          where: {
            '$offers.medias.id$': media_id,
            '$offers.active$': true,
            '$offers.contractor_type$': 'pf'
          }
        });
        return { count, periodicities };
      }
    },

    async list() {
      const db = this.db;
      const { count, rows: offers } = await db.Offer.findAndCountAll({
        distinct: true,
        subQuery: false,
        include: ['plan', 'periodicity', 'payment_methods'],
        where: { active: true, contractor_type: 'pf' }
      });
      return { count, offers };
    }
  },

  started() {
    this.db = require('../repository');
  }
};
