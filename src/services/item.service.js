module.exports = {
  name: 'item',

  actions: {
    list() {
      const db = this.db;
      const { Op } = db.Sequelize;
      return db.Item.findAndCountAll({
        where: { id: { [Op.notIn]: [1, 3] } }
      });
    }
  },

  started() {
    this.db = require('../repository');
  }
};
