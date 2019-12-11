'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'campaigns',
      [
        {
          id: 1,
          name: 'Claro',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'Sistema',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          name: 'Redevip_ClientesPF',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 4,
          name: 'Redevip_ClientesPJ',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 5,
          name: 'ASSERJ_ClientesPF',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 6,
          name: 'Superrede_ClientePJ',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 7,
          name: 'Botafogo',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 8,
          name: 'Cabify',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 9,
          name: 'Dia dos Namorados',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 10,
          name: 'DoutorJá',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {
        updateOnDuplicate: ['id']
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('campaigns', null, {});
  }
};
