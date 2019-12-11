const Joi = require('joi');

module.exports = {
  name: 'account',

  actions: {
    find: {
      params: Joi.object()
        .keys({
          search: Joi.string()
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { Op } = db.sequelize;
        let { search } = ctx.params;
        search = search.replace(/[^A-Z0-9]/gi, '');
        let result = await db.Subscription.findOne({
          subQuery: false,
          where: {
            [Op.or]: [
              {
                uid: search
              },
              {
                '$accounts.cpf$': { [Op.like]: `%${search}%` }
              },
              {
                '$accounts.msisdn$': { [Op.like]: `%${search}%` }
              }
            ]
          },
          include: [
            {
              as: 'accounts',
              model: db.Account,
              required: true
            },
            'address',
            {
              as: 'offer',
              model: db.Offer,
              include: ['plan', 'periodicity']
            }
          ]
        });
        if (!result || !result.accounts) {
          ctx.meta.$statusCode = 404;
          return [];
        }
        let { accounts, ...subscription } = result.get({ plain: true });
        accounts = accounts.map(account => {
          account.subscription = subscription;
          account.address = subscription.address;
          account.as = account.SubscriptionAccount.as;
          delete account.SubscriptionAccount;
          return account;
        });
        return accounts;
      }
    },

    async findById(ctx) {
      const db = this.db;
      let result = await db.Subscription.findOne({
        where: { account_id: ctx.params.id },
        include: [
          {
            as: 'account',
            model: db.Account
          },
          'address',
          {
            as: 'offer',
            model: db.Offer,
            include: ['plan', 'periodicity']
          }
        ]
      });
      if (!result || !result.account) {
        ctx.meta.$statusCode = 404;
        throw new Error(`Nenhuma conta encontrada com o id ${ctx.params.id}`);
      }
      let { account, ...subscription } = result.get({ plain: true });
      account.subscription = subscription;
      account.address = subscription.address;
      return account;
    },

    async findByUser(ctx) {
      const db = this.db;
      const { meta, params } = ctx;
      let user = await db.User.findByPk(meta.user.id);
      if (!user) {
        meta.$statusCode = 404;
        throw new Error(`Usuário não encontrado com id ${user.id}`);
      }
      if (user.scope.some(i => i === 'clinic')) {
        let account = await db.Account.findOne({
          where: { user_id: meta.user.id },
          include: [
            {
              as: 'user',
              attributes: ['active', 'cpf', 'email', 'id', 'msisdn', 'scope'],
              model: db.User
            }
          ]
        });
        if (!account) throw new Error(`Usuário não encontrado com id ${meta.user.id}`);
        let location = await account.user.getLocations({
          include: [
            {
              as: 'location_procedures',
              model: db.LocationProcedure,
              include: [
                'specialty',
                {
                  as: 'professional',
                  model: db.Professional,
                  include: ['account']
                }
              ]
            }
          ]
        });
        account = account.get({ plain: true });
        return { ...account, location: location };
      } else if (user.scope.some(i => i === 'patient') && params.scope !== 'manager') {
        let account = await db.Account.findOne({
          where: { user_id: meta.user.id },
          include: [
            {
              as: 'subscription',
              attributes: [],
              model: db.Subscription,
              required: true
            }
          ]
        });
        let subscription = await account.getSubscription({
          attributes: [
            'account_id',
            'id',
            'next_renewal_date',
            'offer_id',
            'payment_method_id',
            'payment_provider_name',
            'status',
            'uid'
          ],
          include: [
            {
              as: 'account',
              model: db.Account,
              include: ['user', 'contacts', 'patient', 'professional'],
              required: true
            },
            {
              as: 'accounts',
              model: db.Account,
              through: {
                attributes: ['as'],
                where: { as: 'dependent' }
              }
            },
            'address',
            {
              as: 'offer',
              attributes: ['id', 'active', 'description', 'plan_id', 'regular_price'],
              model: db.Offer,
              include: ['plan']
            },
            'credit_card',
            'payment_method',
            'invoices'
          ]
        });
        subscription = subscription.get({ plain: true });
        subscription.items = await ctx.call('subscription.item.list', {
          id: subscription.id
        });
        return subscription;
      } else {
        return db.Account.findOne({
          where: { user_id: meta.user.id },
          include: [
            {
              as: 'user',
              attributes: ['active', 'cpf', 'email', 'id', 'msisdn', 'scope'],
              model: db.User
            }
          ]
        });
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
