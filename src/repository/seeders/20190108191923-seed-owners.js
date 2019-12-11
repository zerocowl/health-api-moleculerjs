'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('owners', [
      {
        id: 1,
        name: 'DoutorJá',
        short_name: 'doutorja',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Claro',
        short_name: 'claro',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Rede VIP',
        short_name: 'redevip',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'ASSERJ',
        short_name: 'asserj',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Super Rede',
        short_name: 'superrede',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'Cabify',
        short_name: 'cabify',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'Botafogo',
        short_name: 'botafogo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('owners', null, {});
  }
};
