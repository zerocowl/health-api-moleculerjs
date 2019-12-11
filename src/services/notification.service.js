const Joi = require('joi');

module.exports = {
  name: 'notification',

  actions: {
    create({ params }) {
      const db = this.db;
      return db.Notification.create(params);
    },

    findById({ params }) {
      const db = this.db;
      return db.Notification.findByPk(params.id);
    },

    findByAccount(ctx) {
      const db = this.db;
      return db.Notification.findOne({ where: { account_id: ctx.params.account_id } });
    },

    update: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler({ meta, params }) {
        const db = this.db;
        meta.$statusCode = 204;
        const { id, ...payload } = params;
        const notification = await db.Notification.findByPk(id);
        if (!notification) throw new Error(`Notificação não encontrada com id ${id}`);
        return notification.update(payload);
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
