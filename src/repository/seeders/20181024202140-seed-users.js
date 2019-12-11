'use strict';
const { hashSync } = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@doutorja.com.br',
        cpf: '12354343116',
        msisdn: '5511900000000',
        password: hashSync('$@dmin$', 10),
        scope: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cpf: '42566294836',
        email: 'patient@teste.com',
        msisdn: '5511961161212',
        password: hashSync('senha123', 10),
        scope: 'patient',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cpf: '69829297012',
        email: 'luciano@dj.com',
        msisdn: null,
        password: hashSync('senha123', 10),
        scope: 'patient',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cpf: '45777839088',
        email: null,
        msisdn: '5511961935372',
        password: hashSync('padilha123', 10),
        scope: 'profissional',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
