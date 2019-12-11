const axios = require('axios');
const Joi = require('joi');

module.exports = {
  name: 'locality',

  actions: {
    listUFs() {
      const db = this.db;
      return db.State.findAll({
        attributes: ['name', 'uf'],
        include: [
          {
            model: db.LocationAddress,
            attributes: [],
            required: true
          }
        ],
        order: [['name']]
      });
    },

    getCities({ params }) {
      const db = this.db;
      return db.City.findAll({
        attributes: ['name', 'uf', 'coords'],
        include: [
          {
            model: db.LocationAddress,
            attributes: [],
            required: true
          }
        ],
        where: { uf: params.uf },
        order: [['name']]
      });
    },

    fetchAddressByZipCode: {
      params: Joi.object().keys({
        zip_code: Joi.string().required()
      }),
      async handler(ctx) {
        let { zip_code: zipCode } = ctx.params;
        zipCode = zipCode.replace(/[^\w\s]/gi, '');
        const { data } = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
        return {
          street: data.logradouro,
          complement: data.complement,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        };
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
