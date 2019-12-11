const axios = require('axios');
const IuguMixin = require('../mixins/iugu.mixin');
const Joi = require('joi');

module.exports = {
  name: 'iugu.customer',

  mixins: [IuguMixin],

  actions: {
    addCreditCard: {
      params: Joi.object().keys({
        customer_id: Joi.string().required(),
        token: Joi.string().empty()
      }),
      async handler(ctx) {
        const { customer_id: customerId, token } = ctx.params;
        try {
          this.logger.info(this.requestOptions);
          const response = await axios.post(
            `${this.baseURL}/v1/customers/${customerId}/payment_methods`,
            {
              description: 'assinatura cartão doutor já',
              token: token,
              set_as_default: true
            },
            this.requestOptions
          );
          const { id, data } = response.data;
          return {
            brand: data.brand,
            display_number: data.display_number,
            expiration_month: data.month,
            expiration_year: data.year,
            payment_provider_name: 'iugu',
            payment_provider_id: id
          };
        } catch (err) {
          throw new Error(JSON.stringify(err.response.data));
        }
      }
    },

    async create(ctx) {
      const { params: payload } = ctx;
      try {
        const response = await axios.post(
          `${this.baseURL}/v1/customers`,
          this.parse(payload),
          this.requestOptions
        );
        return response.data;
      } catch (err) {
        this.logger.error(err);
        throw new Error(JSON.stringify(err.response.data));
      }
    }
  },

  methods: {
    parse(payload) {
      if (!payload.account || !payload.address) {
        throw new Error('Conta ou endereço não informado');
      }
      return {
        cpf_cnpj: payload.account.cpf,
        email: payload.account.email,
        name: [payload.account.first_name, payload.account.last_name].join(' '),
        zip_code: payload.address.zip_code,
        street: payload.address.address,
        number: payload.address.number,
        city: payload.address.city,
        state: payload.address.state,
        district: payload.address.district,
        complement: payload.address.complement
      };
    }
  }
};
