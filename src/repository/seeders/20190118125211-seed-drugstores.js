'use strict';
const { capitalize, replace, toLower } = require('lodash');
const data = require('../../assets/json/drugstores.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'drugstores',
      data.map(item => {
        return {
          cnpj: replace(item['CNPJ'], /[^A-Z0-9]/gi, ''),
          name: item['NOME FANTASIA']
            .split(' ')
            .map(capitalize)
            .join(' '),
          legal_name: item['legal_name'],
          street: item.street
            .split(' ')
            .map(capitalize)
            .join(' '),
          number: item.number,
          neighborhood: item['BAIRRO']
            .split(' ')
            .map(capitalize)
            .join(' '),
          city: item['CIDADE']
            .split(' ')
            .map(capitalize)
            .join(' '),
          state: toLower(item['UF']),
          zip_code: replace(item['CEP'], /[^A-Z0-9]/gi, ''),
          created_at: new Date(),
          updated_at: new Date()
        };
      })
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('drugstores', null, {});
  }
};
