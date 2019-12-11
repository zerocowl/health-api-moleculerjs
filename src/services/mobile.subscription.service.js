const { MoleculerError } = require('moleculer').Errors;
const { replace, sampleSize } = require('lodash');
const ddd = require('../libs/ddd');
const Joi = require('joi');

module.exports = {
  name: 'mobile.subscription',

  actions: {
    async find(ctx) {
      let msisdn = ctx.params.msisdn;
      msisdn = replace(msisdn, /[^A-Z0-9]/gi, '');
      let subscription = await ctx.call('core.subscription.findByMSISDN', { msisdn });
      if (!subscription) {
        throw new MoleculerError('Assinatura não encontrada na base DoutorJá', 400);
      }
      if (subscription.payment_provider_name !== 'claro') {
        throw new MoleculerError('Número ão é da Claro', 400);
      }
      if (subscription.account.pending_for_pbm || subscription.account.password) {
        this.generatePassword(msisdn);
      }
      return subscription;
    },

    updateCPF: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),

      async handler(ctx) {
        const db = this.db;
        const { id, ...payload } = ctx.params;
        const subscription = await db.Subscription.findByPk(id, {
          include: ['account', 'address']
        });
        if (!subscription) throw new Error(`Assinatura não encontrada com id ${id}`);
        let account = subscription.account;
        account = await account.update(payload.account);
        const user = await account.getUser();
        await user.update(payload.account);
        let msisdn = account.getDataValue('msisdn');
        let { city, state } = subscription.address ? subscription.address : ddd(msisdn);
        let pbm_params = {
          birthday: subscription.account.birthday,
          city,
          cpf: subscription.account.cpf,
          first_name: subscription.account.first_name,
          gender: subscription.account.gender,
          last_name: subscription.account.last_name,
          msisdn,
          periodicity: { interval: 7, interval_type: 'day' },
          state,
          subscription_id: subscription.id
        };
        if (subscription.status === 'active') {
          ctx.call('pbm.vidalink.enable', pbm_params);
        }
        ctx.meta.$statucCode = 204;
        return true;
      }
    }
  },

  methods: {
    async generatePassword(msisdn) {
      msisdn = replace(msisdn, /[^A-Z0-9]/gi, '');
      if (msisdn.length < 13) msisdn = '55'.concat(msisdn);
      let password = sampleSize('bcdfghjlmnpqrstvxz', 6).join('');
      let subscription = await this.broker.call('core.subscription.findByMSISDN', {
        msisdn: msisdn
      });
      let user = await subscription.account.getUser();
      if (!user.getDataValue('password')) {
        await user.update({ password: password });
        this.broker.call('sms.send', {
          msisdn,
          payment_provider_name: 'claro',
          text: `Bem vindo! Utilize a senha ${password} no seu proximo acesso a claro.doutorja.com.br/cadastro`
        });
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
