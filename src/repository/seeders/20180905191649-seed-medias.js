'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'media',
      [
        {
          id: 1,
          keyword: 'Migração SCOMM',
          name: 'sms',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'Sistema DoutorJá',
          keyword: 'doutorja',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          name: 'site claro organico',
          keyword: 'claro.com.br',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 4,
          name: 'Landing page RedeVIP',
          keyword: 'redevip',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 5,
          name: 'Landing page ASSERJ',
          keyword: 'asserj',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 6,
          name: 'PAP',
          keyword: 'pap',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 7,
          name: 'Landing page Botafogo',
          keyword: 'botafogo',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 8,
          name: 'Landing page Cabify',
          keyword: 'cabify',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 9,
          name: 'Landing page Dia dos Namorados',
          keyword: 'diadosnamorados',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {
        updateOnDuplicate: ['name', 'keyword']
      }
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('media', null, {});
  }
};
