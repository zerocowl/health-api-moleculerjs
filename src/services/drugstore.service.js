const { deburr } = require('lodash');

module.exports = {
  name: 'drugstore',

  actions: {
    find: {
      async handler(ctx) {
        const db = this.db;
        const { Op, and, col, fn, where } = db.sequelize;
        const { name: city, vicinity: neighborhood, limit = 15, offset = 0 } = ctx.params;
        let query = neighborhood
          ? and(
              where(fn('lower', col('neighborhood')), { [Op.like]: `%${deburr(neighborhood)}%` }),
              where(fn('lower', col('city')), { [Op.like]: `%${deburr(city)}%` })
            )
          : where(fn('lower', col('city')), { [Op.like]: `%${city}%` });
        let { count, rows: drugstores } = await db.Drugstore.findAndCountAll({
          where: query,
          offset: +offset * +limit,
          limit: +limit + 1
        });
        return { count, drugstores };
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
