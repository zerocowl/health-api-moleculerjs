const { UAParser } = require('ua-parser-js');
const APIGateway = require('moleculer-web');
const compression = require('compression');
const helmet = require('helmet');
const IO = require('socket.io');
const OAuth2Server = require('../mixins/oauth.mixin');
const parser = new UAParser();

module.exports = {
  mixins: [APIGateway, OAuth2Server],

  settings: {
    callOptions: {
      timeout: 3000
    },

    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'HEAD'],
      allowedHeaders: '*',
      exposedHeaders: '*',
      credentials: false,
      maxAge: null
    },

    port: process.env.PORT || 3000,

    rateLimit: {
      window: 10 * 1000,
      limit: 10,
      headers: true
    },

    onAfterCall(ctx, route, req, res, data) {
      res.setHeader('X-Response-Type', typeof data);
      return data;
    },

    onBeforeCall(ctx, route, req, res) {
      ctx.meta.userAgent = parser.setUA(req.headers['user-agent']).getResult();
    },

    routes: [
      {
        path: '/v1/',

        aliases: {
          'GET /': '$node.health',
          'GET items': 'item.list',
          'GET localities': 'locality.fetchAddressByZipCode',
          'GET locations': 'location.search',
          'GET locations/:id': 'location.findById',
          'GET locations/:location_id/specialties': 'location.procedure.list',
          'GET locations/:location_id/specialties/:specialty_id': 'location.procedure.findById',
          'GET offers': 'core.offer.groupByPeriodicity',
          'GET offers/:id': 'core.offer.findById',
          'GET professionals/:id': 'professional.findById',
          'GET redevip': 'redevip.list',
          'GET specialties': 'specialty.list',
          'GET specialties/:id': 'specialty.findById',
          'GET states': 'locality.listUFs',
          'GET states/:uf/cities': 'locality.getCities',
          'GET subscriptions/:msisdn': 'mobile.subscription.find',
          'HEAD users': 'user.exists',
          'POST invoices': 'invoice.postback',
          'POST professionals': 'professional.create',
          'POST recovery-password': 'user.recoveryPassword',
          'POST redevip': 'redevip.create',
          'POST sms': 'sms.sendConfirmationCode',
          'POST sms/confirm': 'sms.confirmCode',
          'POST sms/validator': 'sms.createCodeValidator',
          'POST subscriptions': 'subscription.create',
          'GET drugstores': 'drugstore.find',
          'GET councils': 'util.list.councils',
          'GET payment_methods': 'util.list.paymentMethods'
        },

        bodyParsers: {
          json: {
            limit: '50mb'
          },
          urlencoded: {
            limit: '50mb',
            extended: true
          }
        }
      },

      {
        path: '/mobile/v1/notifications',
        aliases: {
          'POST /': 'mobile.notification.update'
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true
          }
        }
      },

      {
        path: '/mobile/v1/subscriptions',
        aliases: {
          'PUT /:id': 'mobile.subscription.updateCPF'
        },
        authorization: true,
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true
          }
        }
      },

      {
        path: '/private/v1',
        authorization: true,
        aliases: {
          'DELETE locations/:location_id/procedures/:id': 'location.procedure.remove',
          'DELETE professionals/:id/medical_specialties/:id': 'professional.removeMedicalSpecialty',
          'DELETE subscriptions/:id/accounts/:account_id': 'subscription.account.remove',
          'GET accounts': 'account.find',
          'GET accounts/:id': 'account.findById',
          'GET accounts/:id/uid_url': 'subscription.card.fetchCardImage',
          'GET locations/requests': 'request.fetchByLocation',
          'GET notifications/:account_id': 'notification.findByAccount',
          'GET requests': 'request.list',
          'GET subscriptions': 'subscription.findByUser',
          'GET subscriptions/:id': 'subscription.findById',
          'GET subscriptions/:id/accounts': 'subscription.account.list',
          'GET subscriptions/:id/accounts/:account_id': 'subscription.account.findById',
          'POST locations': 'location.create',
          'POST locations/:location_id/procedures': 'location.procedure.create',
          'POST notifications': 'notification.create',
          'POST requests': 'request.create',
          'POST subscriptions/:id/accounts': 'subscription.account.create',
          'POST subscriptions/:id/suspend': 'subscription.suspend',
          'PUT locations/:id': 'location.update',
          'PUT locations/:location_id/procedures/:id': 'location.procedure.update',
          'PUT notications/:id': 'notification.update',
          'PUT professionals/:id': 'professional.update',
          'PUT professionals/:id/medical_specialties': 'professional.addMedicalSpecialty',
          'PUT subscriptions/:id': 'subscription.update',
          'PUT subscriptions/:id/accounts/:account_id': 'subscription.account.update',
          'PUT subscriptions/:id/items/:item_id': 'subscription.item.update'
        },
        bodyParsers: {
          json: {
            limit: '50mb'
          },
          urlencoded: {
            limit: '50mb',
            extended: true
          }
        }
      },

      {
        path: '/claro/v1',
        aliases: {
          'GET subscriptions': 'claro.subscription.find',
          'POST subscriptions': 'claro.subscription.create',
          'PUT subscriptions': 'claro.subscription.update'
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true
          }
        }
      },

      {
        path: '/oauth/token',
        aliases: {
          'POST /'(req, res) {
            return this.authenticate(req, res);
          }
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true
          }
        }
      },

      {
        path: '/oauth/profile',
        authorization: true,
        aliases: {
          'GET /': 'account.findByUser'
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true
          }
        }
      },

      {
        path: '/backoffice/v1',
        aliases: {
          'GET accounts': 'account.find',
          'GET accounts/:id': 'account.findById',
          'GET locations': 'location.search',
          'GET locations/:location_id/specialties': 'location.procedure.list',
          'GET locations/:location_id/specialties/:specialty_id': 'location.procedure.findById',
          'GET offers': 'core.offer.list',
          'GET requests': 'backoffice.request.list',
          'GET requests/:id': 'backoffice.request.findById',
          'GET specialties': 'specialty.list',
          'GET specialties/:id': 'specialty.findById',
          'HEAD users': 'user.exists',
          'POST requests': 'backoffice.request.create',
          'POST subscriptions': 'backoffice.subscription.create',
          'PUT requests/:id': 'backoffice.request.update',
          'PUT subscriptions': 'backoffice.subscription.update',
          'POST locations': 'backoffice.location.create',
          'PUT locations/:id': 'backoffice.location.update',
          'POST crm/create_request': 'backoffice.crm.createRequest',
          // 'GET locations/:location_id/location_procedure': 'backoffice.location_procedure.list',
          // 'POST locations/:location_id/location_procedures': 'backoffice.location_procedure.create',
          // 'GET location_procedure/:id': 'backoffice.location_procedure.findById',
          // 'PUT location_procedures/:id': 'backoffice.location_procedure.update',
          // 'DELETE location_procedure/:id': 'backoffice.location_procedure.remove',
          'GET councils': 'util.list.councils',
          'GET payment_methods': 'util.list.paymentMethods'
        },
        authorization: true,
        bodyParsers: {
          json: {
            limit: '50mb'
          },
          urlencoded: {
            limit: '50mb',
            extended: true
          }
        }
      }
    ],

    use: [compression(), helmet()]
  },

  events: {
    'node.broken'(node) {
      this.logger.warn(`The ${node.id} node is disconnected!`);
    },

    'notifications.*'(payload, sender, event) {
      this.logger.info(`Event triggered`, payload, sender, event);
      if (this.io) {
        this.io.emit('event', {
          sender,
          event,
          payload
        });
      }
    }
  },

  started() {
    this.io = IO.listen(this.server);
    this.io.on('connection', client => {
      this.logger.info(`Client connected via websocket! ${client.id}`);
      client.on('call', async ({ action, params, opts }, done) => {
        this.logger.info('Received request from client! Action:', action, ', Params:', params);
        try {
          const res = await this.broker.call(action, params, opts);
          done(res);
        } catch (err) {
          this.logger.error(err);
        }
      });

      client.on('disconnect', () => {
        this.logger.info(`Client disconnected`);
      });
    });
  }
};
