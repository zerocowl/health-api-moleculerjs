const { replace, sampleSize, toLower } = require('lodash');

module.exports = {
  name: 'user',

  actions: {
    create(ctx) {
      const db = this.db;
      return db.User.create(ctx.params);
    },

    findById(ctx) {
      const db = this.db;
      return db.User.findByPk(ctx.params.id);
    },

    list() {
      const db = this.db;
      return db.User.findAndCountAll();
    },

    async recoveryPassword(ctx) {
      const db = this.db;
      const { param: username } = ctx.params;
      let query = {};
      const isEmail = username.includes('@');
      if (isEmail) {
        query = { email: toLower(username) };
      } else {
        query = { msisdn: replace(username, /[^\w\s]/gi, '') };
      }

      const user = await db.User.findOne({
        where: query,
        subQuery: false,
        include: [
          {
            as: 'accounts',
            model: db.Account,
            include: ['subscription']
          }
        ]
      });
      if (!user) throw new Error(`Usuário não encontrado, ${username}`);
      let new_password = sampleSize('bcdfghjlmnpqrstvxz', 6).join('');
      user.password = new_password;
      await user.save();
      if (isEmail) {
        ctx.call('mailer.send', {
          to: username,
          subject: 'Redefinição de senha',
          text: `Sua nova senha é: ${new_password}`
        });
      } else {
        /**
         * To Fix
         *  */
        if (!user.accounts[0] || !user.accounts[0].subscription) return;
        let payment_provider_name = user.accounts[0].subscription.payment_provider_name;
        ctx.call('sms.send', {
          msisdn: username,
          payment_provider_name,
          text: `Sua nova senha eh: ${new_password}`
        });
      }
      return { message: 'success' };
    },

    async exists(ctx) {
      const db = this.db;
      let { msisdn, cpf, email } = ctx.params;
      let query = {};
      if (msisdn) {
        msisdn = replace(msisdn, /[^A-Z0-9]/gi, '');
        if (msisdn.length < 13) msisdn = '55'.concat(msisdn);
        query = { msisdn: msisdn };
      }
      if (cpf) query = { cpf: replace(cpf, /[^A-Z0-9]/gi, '') };
      if (email) query = { email: toLower(email) };

      const count = await db.User.count({ where: query });
      const result = count > 0;
      ctx.meta.$statusCode = result ? 409 : 200;
      return result;
    }
  },

  started() {
    this.db = require('../repository');
  }
};
