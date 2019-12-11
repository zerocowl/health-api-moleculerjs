const cron = require('node-cron');
const Joi = require('joi');
const moment = require('moment-timezone');
moment.locale('pt-br');

module.exports = {
  name: 'transactional.notification',

  actions: {
    notify: {
      params: Joi.object().keys({
        request: Joi.object()
          .unknown()
          .required(),
        templateId: Joi.string().required()
      }),
      async handler(ctx) {
        const { request, templateId } = ctx.params;
        let msisdn = request.account.getDataValue('msisdn');
        if (msisdn) {
          switch (request.status) {
            case 'requested': {
              ctx.call('sms.send', {
                msisdn,
                payment_provider_name: request.subscription.payment_provider_name,
                text: `Ola ${request.account.name}! Vc solicitou uma consulta no dia: ${moment(
                  request.schedule_date
                ).format('DD/MM')} Entre ${request.min_time}h e ${
                  request.max_time
                }h. Aguarde contato com a confirmacao ou nao do agendamento.`
              });
              break;
            }
            case 'confirmed': {
              ctx.call('sms.send', {
                msisdn,
                payment_provider_name: request.subscription.payment_provider_name,
                text: `Ola ${request.account.first_name}! A consulta em ${
                  request.locationProcedure.location.name
                } dia ${moment(request.schedule_date).format('DD/MM')} as ${moment(
                  request.schedule_date
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm')} foi confirmada.`
              });
              break;
            }
            case 'refused': {
              ctx.call('sms.send', {
                msisdn,
                payment_provider_name: request.subscription.payment_provider_name,
                text: `Ola ${request.account.first_name}! A sua consulta em ${
                  request.locationProcedure.location.name
                } dia ${moment(request.schedule_date).format(
                  'DD/MM'
                )} precisou ser reagendada. Já entraremos com contato oferecendo novos dias e horários disponíveis.`
              });
              break;
            }
            case 'rescheduled': {
              ctx.call('sms.send', {
                msisdn: msisdn,
                payment_provider_name: request.subscription.payment_provider_name,
                text: `Ola ${request.account.first_name}! A sua consulta em ${
                  request.locationProcedure.location.name
                } dia ${moment(request.schedule_date).format(
                  'DD/MM'
                )} precisou ser reagendada. Já entraremos com contato oferecendo novos dias e horários disponíveis.`
              });
              break;
            }
            case 'canceled': {
              ctx.call('sms.send', {
                msisdn,
                payment_provider_name: request.subscription.payment_provider_name,
                text: `Ola ${request.account.first_name}! Sua consulta para o dia ${moment(
                  request.schedule_date
                ).format(
                  'DD/MM'
                )} foi cancelada! Para fazer outros agendamentos, acesse https://bit.ly/2QOOV7m`
              });
              break;
            }
          }
        }
        return ctx.call('mailer.sendWithTemplate', {
          to: request.account.email,
          templateId: templateId,
          dynamic_template_data: this.buildTemplate(request)
        });
      }
    }
  },

  methods: {
    buildTemplate(request) {
      return {
        appointment_date: moment(request.schedule_date).format('DD/MM/YYYY'),
        appointment_time:
          request.status === 'requested'
            ? `Entre ${request.min_time}h e ${request.max_time}h`
            : moment(request.schedule_date)
                .tz('America/Sao_Paulo')
                .format('HH:mm'),
        crm: request.locationProcedure.professional
          ? request.locationProcedure.professional.registration_number
          : null,
        discount_value: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(request.locationProcedure.final_value),
        location: request.locationProcedure.location.name,
        location_address: request.locationProcedure.location.address.full_address,
        location_image: request.locationProcedure.location.image,
        location_link: `${process.env.SITE_URL}/perfil-clinica/${
          request.locationProcedure.location.id
        }`,
        location_maps: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURI(
          request.locationProcedure.location.address.full_address
        )}&zoom=15&maptype=roadmap&size=300x150&key=${process.env.GOOGLE_APIS_KEY}`,
        location_point: `https://www.google.com/maps/search/?api=1&query=${encodeURI(
          request.locationProcedure.location.address.full_address
        )}`,
        patient_name: request.account.name,
        professional: request.locationProcedure.professional
          ? request.locationProcedure.professional.account.name
          : null,
        regular_value: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(request.locationProcedure.base_value),
        site_url: process.env.SITE_URL,
        specialty: request.locationProcedure.specialty.name
      };
    }
  },

  started() {
    this.db = require('../repository');
    const db = this.db;
    const { and, col, fn, literal, where } = db.sequelize;
    const cronTab = process.env.CRONTAB;
    cron
      .schedule(cronTab, async () => {
        const { count, rows: requests } = await this.db.Request.findAndCountAll({
          distinct: true,
          where: and(
            where(
              fn('abs', fn('timestampdiff', literal('hour'), fn('now'), col('schedule_date'))),
              '<=',
              24
            ),
            { status: 'confirmed' },
            { reminder_sent: false }
          ),
          include: [
            'account',
            'subscription',
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
                  include: ['account']
                }
              ]
            }
          ],
          subQuery: false
        });
        this.logger.info(`Executando ${count} lembretes de consulta`);
        await Promise.all(
          requests.map(request => {
            this.broker.call('sms.send', {
              msisdn: request.account.getDataValue('msisdn'),
              payment_provider_name: request.subscription.payment_provider_name,
              text: `Ola ${request.account.name}! Sua consulta em ${
                request.locationProcedure.location.name
              } sera amanha as ${moment(request.schedule_date).format(
                'HH:mm'
              )}. Nao esqueca de apresentar o seu cartao virtual`
            });
            this.broker.call('mailer.sendWithTemplate', {
              to: request.account.email,
              templateId: 'd-652d5797b2fa4777a291dc1ddfb7262b',
              dynamic_template_data: this.buildTemplate(request)
            });
            return request.update(
              { reminder_sent: true },
              {
                hooks: false
              }
            );
          })
        );
      })
      .start();
  }
};
