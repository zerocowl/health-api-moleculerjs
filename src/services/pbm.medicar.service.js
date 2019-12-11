const { replace, omitBy, isNil } = require('lodash');
const axios = require('axios');
// const cron = require('node-cron');
const moment = require('moment');

module.exports = {
  name: 'pbm.medicar',

  actions: {
    enable: {
      async handler(ctx) {
        const { subscription_id, ...params } = ctx.params;
        await this.createlife(params);
        ctx.call('core.benefit.enable', {
          subscription_id,
          item_id: 14
        });
        ctx.call('core.benefit.enable', {
          subscription_id,
          item_id: 15
        });
        return true;
      }
    },

    disable: {
      async handler(ctx) {
        const { subscription_id, ...params } = ctx.params;
        await this.deactivatelife(params);
        ctx.call('core.benefit.disable', {
          subscription_id,
          item_id: 14
        });
        ctx.call('core.benefit.disable', {
          subscription_id,
          item_id: 15
        });
        return true;
      }
    }
  },

  methods: {
    async createlife({
      birthday: datanascimento,
      cpf,
      first_name,
      gender: sexo,
      last_name,
      msisdn: foneresidencial
    }) {
      cpf = replace(cpf, /[^\w\s]/gi, '');
      if (datanascimento) {
        datanascimento = moment(datanascimento, 'DD/MM/YYYY').format('YYYYMMDD');
      }
      sexo = sexo ? (sexo === 'female' ? 'FEMININO' : 'MASCULINO') : null;
      let database = moment().format('YYYYMMDD');
      let params = {
        codigotit: cpf,
        cpf: replace(cpf, /(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4'),
        database,
        datanascimento,
        foneresidencial,
        nome: [first_name, last_name].join(' '),
        sexo,
        titularidade: 'titular'
      };
      params = omitBy(params, isNil);
      this.logger.info(params);
      try {
        const { data } = await axios.post(`${this.baseURL}/api/medicar/createlife`, params);
        return data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    },

    async deactivatelife({
      birthday: datanascimento,
      cpf,
      first_name,
      gender: sexo,
      last_name,
      msisdn: foneresidencial
    }) {
      cpf = replace(cpf, /[^\w\s]/gi, '');
      if (datanascimento) {
        datanascimento = moment(datanascimento, 'DD/MM/YYYY').format('YYYYMMDD');
      }
      sexo = sexo ? (sexo === 'female' ? 'FEMININO' : 'MASCULINO') : null;
      let database = moment().format('YYYYMMDD');
      let params = {
        codigotit: cpf,
        cpf: replace(cpf, /(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4'),
        database,
        datanascimento,
        foneresidencial,
        nome: [first_name, last_name].join(' '),
        sexo,
        titularidade: 'titular'
      };
      params = omitBy(params, isNil);
      this.logger.info(params);
      try {
        const { data } = await axios.put(`${this.baseURL}/api/medicar/deactivatelife`, params);
        return data;
      } catch (err) {
        this.logger.error(err);
        throw new Error(JSON.stringify(err.response.data));
      }
    },

    async fetchEnabled() {
      const db = this.db;
      const { and, col, fn, literal, Op, where } = db.sequelize;
      let subscription_items = await db.SubscriptionItem.findAll({
        include: [
          {
            as: 'subscription',
            model: db.Subscription,
            include: ['account']
          }
        ],
        subQuery: false,
        where: and(
          where(
            fn(
              'abs',
              fn('timestampdiff', literal('day'), fn('now'), col('subscription.next_renewal_date'))
            ),
            '=',
            7
          ),
          {
            item_id: {
              [Op.or]: [14, 15]
            }
          },
          { active: true }
        )
      });
      this.logger.info(subscription_items.length, 'deverão ser desativados da Medicar');
      Promise.all(
        subscription_items.map(item => {
          const subscription = item.subscription;
          this.deactivatelife(subscription.account);
          return subscription.update({ active: false });
        })
      );
    }
  },

  started() {
    this.db = require('../repository');
    this.baseURL = process.env.PBM_URL;
    // const cronTab = process.env.CRONTAB;
    // const cronTab = '*/1 * * * *';
    // cron.schedule(cronTab, this.fetchEnabled).start();
  }
};
