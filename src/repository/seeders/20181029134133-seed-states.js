'use strict';
const { data } = require('../data/estados.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const states = data.map(i => {
      return {
        code: i['CodigoUf'],
        name: i['Nome'].toLowerCase(),
        uf: i['Uf'].toLowerCase(),
        region: i['Regiao'],
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    return queryInterface.bulkInsert('states', states);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('states', null, {});
  }
};
