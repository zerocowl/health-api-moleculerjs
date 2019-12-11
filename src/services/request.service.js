const Joi = require('joi');
const moment = require('moment');

module.exports = {
  name: 'request',

  actions: {
    async create(ctx) {
      const db = this.db;
      const { city, state, neighborhood, ...payload } = ctx.params;
      if (payload.prescription_image && payload.prescription_image.length > 500) {
        const filePath = await ctx.call('s3.storage.upload', {
          identifier: `requisicao_exame_${new Date().getTime()}`,
          base64String: payload.prescription_image
        });
        if (!filePath) throw new Error('Não foi possível salvar a imagem da requisição');
        payload.prescription_image = filePath;
      }
      payload.locality = [city, state, neighborhood].join(', ');
      let conflictingRequest = await this.checkIfRequestExists(
        payload.account_id,
        payload.location_procedure_id,
        payload.schedule_date
      );
      if (conflictingRequest)
        throw new Error(`Já existe uma solicitação para este mesmo dia ${payload.schedule_date}`);

      if (payload.location_procedure_id) {
        // Para exames não verificar lp id
        let subscription = await ctx.call('subscription.findById', { id: payload.subscription_id });
        let location_procedure = await ctx.call('location.procedure.findOne', {
          id: payload.location_procedure_id
        });
        if (subscription.status === 'active') {
          payload.budget = location_procedure.final_value * 100;
        } else {
          payload.budget = location_procedure.getDataValue('base_value');
        }
      }

      let request = await db.Request.create(payload);
      request = await request.reload({
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
              {
                as: 'location',
                model: db.Location,
                include: ['contacts', 'address']
              },
              'specialty',
              {
                as: 'professional',
                model: db.Professional,
                include: ['account'],
                required: false
              }
            ],
            required: false
          }
        ]
      });
      if (request.category === 'consultation') {
        ctx.call('transactional.notification.notify', {
          request: request,
          templateId: 'd-aeac6dbd90254a1e9cd6c7dbb5acccf6'
        });
      }
      return request;
    },

    list: {
      params: Joi.object()
        .keys({
          limit: [Joi.number(), Joi.string()],
          offset: [Joi.number(), Joi.string()],
          status: Joi.string().empty()
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { params, meta } = ctx;
        let query = null;
        if (params.status && params.status !== 'all') {
          query = { status: params.status };
        }
        let { count, rows: requests } = await db.Request.findAndCountAll({
          include: [
            {
              as: 'account',
              model: db.Account,
              include: ['patient'],
              where: { user_id: meta.user.id }
            },
            {
              as: 'locationProcedure',
              model: db.LocationProcedure,
              include: [
                {
                  as: 'location',
                  model: db.Location,
                  include: ['address']
                },
                'specialty',
                {
                  as: 'professional',
                  model: db.Professional,
                  include: ['account']
                }
              ],
              where: { procedure_id: 1 }
            }
          ],
          where: query,
          order: [['schedule_date', 'ASC']],
          limit: +params.limit || 25,
          offset: +params.offset || 0
        });
        return { count, requests };
      }
    },

    fetchByLocation: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.number().required()],
          status: Joi.string()
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { meta, params } = ctx;
        let query = null;
        if (params.status && params.status !== 'all') {
          query = { status: params.status };
        }
        let user = await db.User.findByPk(meta.user.id);
        if (!user) {
          throw new Error(`Usuário não encontrado com id ${meta.user.id}`);
        }
        let location = await db.Location.findOne({
          include: [
            {
              as: 'professional',
              attributes: [],
              model: db.Professional,
              include: [
                {
                  as: 'account',
                  attributes: [],
                  model: db.Account,
                  where: { user_id: meta.user.id }
                }
              ],
              required: true
            }
          ]
        });
        if (!location) {
          location = await db.Location.findOne({
            include: [
              {
                as: 'employees',
                model: db.User,
                where: { id: meta.user.id },
                required: true
              }
            ]
          });
        }
        if (!location) {
          throw new Error(
            `Usuário ${meta.user.id} não possui acesso a nenhum local de atendimento da rede`
          );
        }
        let { count, rows: requests } = await db.Request.findAndCountAll({
          include: [
            {
              as: 'account',
              model: db.Account,
              include: ['patient']
            },
            {
              as: 'locationProcedure',
              model: db.LocationProcedure,
              include: [
                {
                  as: 'location',
                  model: db.Location,
                  where: { id: location.id },
                  include: ['address']
                },
                'specialty',
                {
                  as: 'professional',
                  model: db.Professional,
                  include: ['account']
                }
              ],
              where: { procedure_id: 1 }
            }
          ],
          where: query,
          order: [['schedule_date', 'ASC']],
          limit: +params.limit || 25,
          offset: +params.offset || 0
        });
        return { count, requests };
      }
    },

    async update(ctx) {
      const db = this.db;
      const { meta, params } = ctx;
      let request = await db.Request.findByPk(params.id);
      if (!request) throw new Error(`Solicitação não encontrada com id ${params.id}`);
      if (params.prescription_image && params.prescription_image.length > 500) {
        const filePath = await ctx.call('s3.storage.upload', {
          identifier: `requisicao_exame_${new Date().getTime()}`,
          base64String: params.prescription_image
        });
        if (!filePath) throw new Error('Não foi possível salvar a imagem da requisição');
        params.prescription_image = filePath;
      }
      await request.update(params, {
        context: { user_id: meta.user.id }
      });
      request = await request.reload({
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
              {
                as: 'location',
                model: db.Location,
                include: ['contacts', 'address']
              },
              'specialty',
              {
                as: 'professional',
                model: db.Professional,
                include: ['account'],
                required: false
              }
            ],
            required: false
          }
        ]
      });

      if (params.status === 'confirmed' && request.status === 'confirmed') {
        ctx.call('transactional.notification.notify', {
          request: request,
          templateId: 'd-abc64144fe4247fa99f3a256b889cc7f'
        });
      } else if (
        (params.status === 'refused' && request.status === 'refused') ||
        (params.status === 'rescheduled' && request.status === 'rescheduled')
      ) {
        ctx.call('transactional.notification.notify', {
          request: request,
          templateId: 'd-4ead89cbc87e4474a90bc8469bcbe0a6'
        });
      } else if (params.status === 'canceled' && request.status === 'canceled') {
        ctx.call('transactional.notification.notify', {
          request: request,
          templateId: 'd-764a9c830fed481fb8067257658f32f8'
        });
      }
    }
  },

  methods: {
    async checkIfRequestExists(accountId, locationProcedureId, scheduleDate) {
      const db = this.db;
      const { and, col, fn, where } = db.sequelize;
      let day = moment(scheduleDate).get('day');
      let month = moment(scheduleDate).get('month');
      let request = await db.Request.findOne({
        where: and(
          { account_id: accountId },
          { location_procedure_id: locationProcedureId },
          where(fn('dayofmonth', col('schedule_date')), '=', day),
          where(fn('month', col('schedule_date')), '=', month)
        )
      });
      return request;
    }
  },

  started() {
    this.db = require('../repository');
  }
};
