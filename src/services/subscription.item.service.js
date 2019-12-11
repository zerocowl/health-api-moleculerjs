const moment = require('moment');
const Joi = require('joi');

module.exports = {
  name: 'subscription.item',

  actions: {
    update: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()],
          item_id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        let { id, item_id, ...payload } = ctx.params;
        let subscription = await db.Subscription.findByPk(id, { include: ['account'] });
        if (!subscription) throw new Error(`Assinatura não encontrada com id ${id}`);
        await subscription.account.update(payload);

        const subscription_item = await db.SubscriptionItem.findOne({
          where: { item_id, subscription_id: id }
        });
        if (!subscription_item) throw new Error('Benefício não encontrado');
        let pbm_params = { ...payload };
        pbm_params.subscription_id = id;
        let result = await ctx.call('pbm.medicar.enable', pbm_params);
        return result;
      }
    },

    list: {
      params: Joi.object().keys({
        id: Joi.any().required()
      }),
      async handler(ctx) {
        const db = this.db;
        const { col, fn } = db.sequelize;
        const { id } = ctx.params;
        const subscription = await db.Subscription.findByPk(id, {
          include: ['offer']
        });
        let items = [];
        if (subscription.offer.regular_price <= 0) {
          items = await subscription.getItems({
            attributes: [
              'action_url',
              'basic',
              'category',
              'default',
              'id',
              'internal',
              'short_name',
              ['title_alt', 'name'],
              ['action_name_alt', 'action_name'],
              'action_url'
            ]
          });
        } else {
          switch (subscription.status) {
            case 'active': {
              items = await subscription.getItems({
                attributes: [
                  'action_url',
                  'basic',
                  'category',
                  'default',
                  'description',
                  'id',
                  'internal',
                  'short_name',
                  ['title', 'name'],
                  ['action_name', 'action_name']
                ]
              });
              break;
            }
            case 'trial': {
              items = await subscription.getItems({
                attributes: [
                  'action_url',
                  'basic',
                  'category',
                  'default',
                  'id',
                  'internal',
                  'short_name',
                  ['title_alt', 'name'],
                  ['action_name_alt', 'action_name'],
                  [
                    fn(
                      'replace',
                      col('description_trial'),
                      '$RENEWAL_DATE',
                      moment(subscription.next_renewal_date).format('DD/MM')
                    ),
                    'description'
                  ]
                ]
              });
              break;
            }
            case 'pending': {
              let attributes = [
                'action_url',
                'basic',
                'category',
                'default',
                'id',
                'internal',
                'short_name',
                ['title', 'name'],
                ['action_name_alt', 'action_name']
              ];
              if (subscription.payment_provider_name === 'claro') {
                attributes.push(['description_pending_minha_claro', 'description']);
              } else {
                attributes.push(['description_pending', 'description']);
              }
              items = await subscription.getItems({
                attributes
              });
              break;
            }
            default: {
              items = await subscription.getItems({
                attributes: [
                  'action_url',
                  'basic',
                  'category',
                  'default',
                  'id',
                  'internal',
                  'short_name',
                  ['action_name_alt', 'action_name'],
                  ['description_canceled', 'description'],
                  ['title_alt', 'name']
                ]
              });
              break;
            }
          }
        }

        return items.map(item => {
          item = item.get({ plain: true });
          return { ...item.SubscriptionItem, ...item };
        });
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
