const Joi = require('joi');

module.exports = {
  name: 'backoffice.request',

  actions: {
    create(ctx) {
      return ctx.call('request.create', ctx.params);
    },

    findById({ params }) {
      const db = this.db;
      return db.Request.findByPk(params.id, {
        include: [
          {
            as: 'account',
            model: db.Account,
            required: false
          },
          {
            as: 'subscription',
            model: db.Subscription,
            include: ['offer', 'address'],
            required: false
          },
          {
            as: 'locationProcedure',
            model: db.LocationProcedure,
            include: [
              {
                as: 'location',
                model: db.Location,
                include: ['address', 'contacts', 'payment_methods']
              },
              {
                as: 'professional',
                model: db.Professional,
                include: ['account']
              },
              'specialty'
            ],
            required: false
          },
          'request_updates'
        ]
      });
    },

    list: {
      params: Joi.object()
        .keys({
          account_id: [Joi.number(), Joi.string()],
          category: [Joi.number(), Joi.string()],
          limit: [Joi.number(), Joi.string()],
          page: [Joi.number(), Joi.string()],
          status: [Joi.string(), Joi.number()]
        })
        .unknown(true),
      async handler({ params }) {
        const db = this.db;
        let query = {};
        if (params.account_id) query.account_id = params.account_id;
        if (params.status && params.status !== 'all') {
          query = { status: params.status };
        }
        let { count, rows: requests } = await db.Request.findAndCountAll({
          distinct: true,
          where: query,
          subQuery: false,
          include: [
            {
              as: 'account',
              model: db.Account,
              required: false
            },
            {
              as: 'subscription',
              model: db.Subscription,
              required: false
            },
            {
              as: 'locationProcedure',
              model: db.LocationProcedure,
              include: [
                'location',
                {
                  as: 'professional',
                  model: db.Professional,
                  include: ['account']
                },
                'specialty'
              ],
              required: false
            }
          ],
          limit: +params.limit || 25,
          offset: (+params.page - 1) * (+params.limit || 25) || 0
        });
        requests = requests.map(request => {
          request = request.get({ plain: true });
          this.logger.info(request.category);
          switch (request.category) {
            case 'consultation': {
              let { locationProcedure: lp } = request;
              request.description = `${lp.specialty.name} em ${lp.location.name}`;
              break;
            }
            case 'examination': {
              request.description = request.details;
              break;
            }
            default: {
              request.description = request.details;
              break;
            }
          }
          return request;
        });
        return { count, requests };
      }
    },

    update(ctx) {
      return ctx.call('request.update', ctx.params);
    }
  },

  started() {
    this.db = require('../repository');
  }
};
