module.exports = {
  name: 'subscription.user',

  actions: {
    async create(ctx) {
      const db = this.db;
      const { params } = ctx;
      let user = {
        accounts: [
          {
            ...params,
            patient: {}
          }
        ],
        ...params
      };
      user = await db.User.create(user, {
        include: [
          {
            as: 'accounts',
            model: db.Account,
            include: ['patient']
          }
        ]
      });
      return user.get({ plain: true });
    },

    async update(ctx) {
      const db = this.db;
      const { params: payload } = ctx;
      const transaction = await db.sequelize.transaction();
      const opts = { transaction: transaction };
      try {
        let user = await db.User.findByPk(payload.user_id, opts);
        let [account] = await user.getAccounts({ ...opts, limit: 1 });
        if (account) {
          await account.update(payload, opts);
        }
        await user.update(payload, opts);
        await transaction.commit();
        return user.get({ plain: true });
      } catch (err) {
        transaction.rollback();
        throw err;
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
