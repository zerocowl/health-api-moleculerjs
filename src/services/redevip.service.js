module.exports = {
  name: 'redevip',

  actions: {
    create({ params }) {
      const db = this.db;
      return db.LandingPageContact.create(params);
    },

    findById({ params }) {
      const db = this.db;
      return db.LandingPageContact.findByPk(params.id);
    },

    list() {
      const db = this.db;
      return db.LandingPageContact.findAndCountAll();
    }
  },

  started() {
    this.db = require('../repository');
  }
};
