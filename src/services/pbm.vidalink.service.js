const { replace, toUpper } = require('lodash');
const axios = require('axios');
const moment = require('moment');
const item_id = 13;

module.exports = {
  name: 'pbm.vidalink',

  actions: {
    enable: {
      async handler(ctx) {
        const { subscription_id, ...params } = ctx.params;
        let data = await this.getstatus(params.cpf);
        if (!data || data['Status'] !== 'ativo') {
          return this.createlife(params);
        }
        ctx.call('core.benefit.enable', {
          subscription_id,
          item_id
        });
        return data;
      }
    },

    disable: {
      async handler(ctx) {
        const { subscription_id, ...params } = ctx.params;
        let data = await this.getstatus(params.account.cpf);
        if (!data) throw new Error(`Cadastro ${params.account.cpf} não encontrado`);
        if (data['Status'] === 'ativo') {
          return this.deactivatelife(params);
        }
        ctx.call('core.benefit.disable', {
          subscription_id,
          item_id
        });
        this.logger.info(data);
        return data;
      }
    },

    async fetchStatus(ctx) {
      const { params } = ctx;
      return this.getStatus(params.cpf);
    }
  },

  methods: {
    async createlife({
      city = 'SAO PAULO',
      cpf,
      state = 'SP',
      first_name,
      last_name,
      periodicity
    }) {
      try {
        let params = {
          cidade: toUpper(city),
          cpf: replace(cpf, /[^\w\s]/gi, ''),
          data_fim: moment()
            .add(periodicity.interval, periodicity.interval_type)
            .format('YYYYMMDD'),
          data_inicio: moment().format('YYYYMMDD'),
          estado: toUpper(state),
          nome_completo: [first_name, last_name].join(' '),
          titularidade: 'titular'
        };
        this.logger.info(params);
        const { data } = await axios.post(`${this.baseURL}/api/vidalink/createlife`, params);
        this.logger.info(data);
        return data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    },

    async deactivatelife({ city, cpf, state, first_name, last_name }) {
      try {
        let params = {
          cidade: toUpper(city),
          cpf: replace(cpf, /[^\w\s]/gi, ''),
          data_fim: moment()
            .subtract(1, 'day')
            .format('YYYYMMDD'),
          data_inicio: moment()
            .subtract(1, 'day')
            .format('YYYYMMDD'),
          estado: toUpper(state),
          nome_completo: [first_name, last_name].join(' '),
          titularidade: 'titular'
        };
        const { data } = await axios.put(`${this.baseURL}/api/vidalink/deactivatelife`, params);
        this.logger.info(data);
        return data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    },

    async getstatus(cpf) {
      cpf = replace(cpf, /[^\w\s]/gi, '');
      this.logger.info(cpf);
      try {
        this.logger.info(cpf);
        const { data } = await axios.get(`${this.baseURL}/api/vidalink/getstatus/${cpf}`);
        this.logger.info(data);
        return data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    }
  },

  started() {
    this.baseURL = process.env.PBM_URL;
    this.logger.info(this.baseURL);
  }
};
