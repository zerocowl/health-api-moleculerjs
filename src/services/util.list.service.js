module.exports = {
  name: 'util.list',

  actions: {
    async councils() {
      const db = this.db;
      const { count, rows: councils } = await db.Council.findAndCountAll();
      return { count, councils };
    },

    async paymentMethods() {
      const db = this.db;
      const { count, rows: payment_methods } = await db.PaymentMethod.findAndCountAll();
      return { count, payment_methods };
    }
  },

  started() {
    this.db = require('../repository');
  }
};
