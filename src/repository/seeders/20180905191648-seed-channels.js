'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'channels',
      [
        {
          id: 1,
          name: 'sms',
          group: 'messaging',
          provider: 'claro',
          carrier: 'scomm',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'satpush',
          group: 'messaging',
          provider: 'claro',
          carrier: 'scomm',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          name: 'sistema',
          group: 'web',
          provider: 'doutorja',
          carrier: 'doutorja',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 4,
          name: 'claro.com',
          group: 'web',
          provider: 'claro',
          carrier: 'claro',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 9,
          name: 'AgenteAutorizado',
          group: 'web',
          provider: 'redevip',
          carrier: 'doutorja',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 10,
          name: 'AgenteAutorizado',
          group: 'web',
          provider: 'asserj',
          carrier: 'doutorja',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 11,
          name: 'PAP',
          group: 'web',
          provider: 'superrede',
          carrier: 'carol',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 12,
          name: 'web',
          group: 'web',
          provider: 'doutorja',
          carrier: 'doutorja',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {
        updateOnDuplicate: ['carrier', 'group', 'name', 'provider']
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('channels', null, {});
  }
};
