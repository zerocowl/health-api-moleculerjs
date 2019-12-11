const axios = require('axios');
const IuguMixin = require('../mixins/iugu.mixin');
const Joi = require('joi');

module.exports = {
  name: 'iugu.subscription',

  mixins: [IuguMixin],

  actions: {
    activate: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const { id } = ctx.params;
        try {
          const response = await axios.post(
            `${this.baseURL}/v1/subscriptions/${id}/activate`,
            {},
            this.requestOptions
          );
          return response.data;
        } catch (err) {
          throw new Error(JSON.stringify(err.response.data));
        }
      }
    },

    async create(ctx) {
      const { params: payload } = ctx;
      try {
        this.logger.info(this.requestOptions);
        const response = await axios.post(
          `${this.baseURL}/v1/subscriptions`,
          payload,
          this.requestOptions
        );
        return response.data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    },

    async fetch(ctx) {
      const { id } = ctx.params;
      try {
        this.logger.info(this.requestOptions);
        const response = await axios.get(
          `${this.baseURL}/v1/subscriptions/${id}`,
          this.requestOptions
        );
        return response.data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    },

    suspend: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      async handler(ctx) {
        const { id } = ctx.params;
        try {
          const response = await axios.post(
            `${this.baseURL}/v1/subscriptions/${id}/suspend`,
            {},
            this.requestOptions
          );
          return response.data;
        } catch (err) {
          throw new Error(JSON.stringify(err.response.data));
        }
      }
    },

    async update(ctx) {
      const { id, ...payload } = ctx.params;
      try {
        const response = await axios.put(
          `${this.baseURL}/v1/subscriptions/${id}`,
          payload,
          this.requestOptions
        );
        return response.data;
      } catch (err) {
        throw new Error(JSON.stringify(err.response.data));
      }
    }
  }
};
