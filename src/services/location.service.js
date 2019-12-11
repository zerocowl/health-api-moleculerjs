const Joi = require('joi');
const { v4 } = require('uuid');

module.exports = {
  name: 'location',

  actions: {
    create: {
      params: Joi.object()
        .keys({
          coords: Joi.array()
            .items(Joi.number())
            .min(2)
            .required()
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { coords, image, ...payload } = ctx.params;
        const transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          if (image) {
            const filePath = await ctx.call('s3.storage.upload', {
              identifier: v4(),
              base64String: image
            });
            if (!filePath) throw new Error('Não foi possível salvar a imagem do local');
            payload.image = filePath;
          }
          const [lat, lng] = coords;
          payload.company.legal_name = payload.name;
          payload.coords = db.sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`);
          const result = await db.Location.create(payload, {
            include: ['address', 'company', 'contacts'],
            ...opts
          });
          await Promise.all(
            payload.payment_methods.map(({ id: paymentMethodId }) => {
              return db.LocationPaymentMethod.create(
                {
                  location_id: result.id,
                  payment_method_id: paymentMethodId
                },
                opts
              );
            })
          );
          await transaction.commit();
          return result.reload();
        } catch (err) {
          transaction.rollback();
          throw err;
        }
      }
    },

    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        return db.Location.findByPk(id, {
          attributes: {
            include: [
              [
                db.sequelize.literal(
                  [
                    "(SELECT GROUP_CONCAT(DISTINCT(sp.name) SEPARATOR ', ')",
                    'FROM specialties sp',
                    'INNER JOIN location_procedures lp',
                    'ON lp.specialty_id = sp.id',
                    'WHERE lp.location_id = `Location`.`id`)'
                  ].join(' ')
                ),
                'specialties'
              ]
            ]
          },
          include: [
            'address',
            'contacts',
            'payment_methods',
            {
              as: 'location_procedures',
              model: db.LocationProcedure,
              include: ['procedure', 'specialty']
            },
            {
              as: 'professional',
              model: db.Professional,
              include: [
                {
                  as: 'council',
                  attributes: ['acronym'],
                  model: db.Council
                },
                'account'
              ],
              required: false
            }
          ]
        });
      }
    },

    listByUser({ meta }) {
      const db = this.db;
      const user = meta.user;
      return db.Location.findAndCountAll({
        include: [
          {
            as: 'account',
            model: db.Account,
            where: { user_id: user.id }
          }
        ]
      });
    },

    update: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler({ meta, params }) {
        meta.$statusCode = 204;
        const db = this.db;
        const { id, ...payload } = params;
        const location = await db.Location.findByPk(id);
        if (!location) throw new Error(`Local não encontrado com id ${id}`);
        return location.update(payload);
      }
    },

    search: {
      params: Joi.object()
        .keys({
          clinics: [Joi.string(), Joi.bool()],
          latitude: [Joi.string().required(), Joi.number().required()],
          limit: [Joi.number(), Joi.string()],
          longitude: [Joi.string().required(), Joi.number().required()],
          max_price: [Joi.string(), Joi.number()],
          min_price: [Joi.string(), Joi.number()],
          name: Joi.string(),
          offices: [Joi.string(), Joi.bool()],
          offset: [Joi.number(), Joi.string()],
          specialty_id: [Joi.string(), Joi.number()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { col, fn, literal, Op, where } = db.sequelize;
        let {
          category,
          clinics,
          latitude,
          limit = 15,
          longitude,
          max_price,
          name,
          offices,
          offset = 0,
          radius = 5,
          specialty_id
        } = ctx.params;
        if (clinics) category = 'clinic';
        if (offices) category = 'offices';
        if (max_price) max_price = { [Op.lte]: max_price };
        if (name) name = { [Op.like]: `${name}` };
        let attributes = Object.keys(db.Location.attributes);

        let filters = [];
        if (max_price) filters.push({ '$location_procedures.base_value$': max_price });
        if (specialty_id) filters.push({ '$location_procedures.specialty_id$': specialty_id });
        if (category) filters.push({ category });
        if (name) filters.push({ name });

        let order = null;
        if (latitude && longitude) {
          let distance = fn(
            'ST_Distance_Sphere',
            col('coords'),
            literal(`ST_GeomFromText('POINT(${+longitude} ${+latitude})')`)
          );
          attributes.push([distance, 'distance']);
          filters.push(where(distance, { [Op.lte]: +radius * 1000 }));
          order = distance;
        }
        let { count, rows: locations } = await db.Location.findAndCountAll({
          attributes,
          distinct: true,
          include: [
            'address',
            'contacts',
            'payment_methods',
            {
              as: 'location_procedures',
              include: ['specialty'],
              model: db.LocationProcedure
            }
          ],
          limit: +limit + 1,
          offset: +offset * +limit,
          order: order,
          subQuery: false,
          where: {
            [Op.and]: [
              {
                hidden: false,
                restricted_search: false
              },
              ...filters
            ]
          }
        });
        locations = locations.map(row => {
          let { location_procedures: fx } = row;
          return {
            ...row.get({ plain: true }),
            average_price: Math.min.apply(null, fx.map(i => i.base_value)),
            specialties: fx.map(({ specialty }) => specialty.name).join(', ')
          };
        });
        return { count, locations };
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
