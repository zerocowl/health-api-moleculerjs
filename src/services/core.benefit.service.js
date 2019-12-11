const Joi = require('joi');

module.exports = {
  name: 'core.benefit',

  actions: {
    enable: {
      params: Joi.object().keys({
        subscription_id: [Joi.number().required(), Joi.string().required()],
        item_id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const db = this.db;
        const { subscription_id, item_id } = ctx.params;
        const item = await this.findSubscriptionItem({ item_id, subscription_id });
        let active = true;
        let renewal_date = new Date();
        if (!item) {
          return db.SubscriptionItem.create({ active, subscription_id, item_id, renewal_date });
        }
        if (!item.active) {
          return item.update({ active });
        }
        return item;
      }
    },

    enableAll: {
      params: Joi.object().keys({
        subscription_id: [Joi.number().required(), Joi.string().required()],
        offer_id: [Joi.number().required(), Joi.string().required()],
        status: Joi.any().required()
      }),
      async handler(ctx) {
        const db = this.db;
        const { subscription_id, offer_id, status } = ctx.params;
        const { items } = await this.listBenefits(offer_id);
        const records = items.map(({ id: item_id, category }) => {
          if (status === 'active' || status === 'trial') {
            return { active: category !== 'exclusive', item_id, subscription_id };
          } else {
            return {
              active: category === 'open',
              item_id,
              subscription_id
            };
          }
        });
        return db.SubscriptionItem.bulkCreate(records);
      }
    },

    disable: {
      params: Joi.object().keys({
        subscription_id: [Joi.number().required(), Joi.string().required()],
        item_id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const { subscription_id, item_id } = ctx.params;
        const active = false;
        const item = await this.findSubscriptionItem({ item_id, subscription_id });
        if (!item) {
          return false;
        }
        if (item.active) {
          return item.update({ active });
        }
        return item;
      }
    },

    updateAll: {
      params: Joi.object().keys({
        subscription_id: [Joi.number().required(), Joi.string().required()],
        status: Joi.any().required()
      }),
      async handler(ctx) {
        const db = this.db;
        const { subscription_id, status } = ctx.params;
        const subscription_items = await db.SubscriptionItem.findAll({
          where: { subscription_id },
          include: ['item']
        });
        return Promise.all(
          subscription_items.map(i => {
            if (status === 'active' || status === 'trial') {
              return i.update({ active: i.item.category !== 'exclusive' });
            } else {
              return i.update({ active: i.item.category === 'open' });
            }
          })
        );
      }
    }
  },

  methods: {
    findSubscriptionItem({ subscription_id, item_id }) {
      const db = this.db;
      return db.SubscriptionItem.findOne({
        where: { subscription_id, item_id }
      });
    },

    async listBenefits(id) {
      let { items, periodicity } = await this.broker.call('core.offer.findById', { id });
      return { items, periodicity };
    }
  },

  started() {
    this.db = require('../repository');
  }
};
