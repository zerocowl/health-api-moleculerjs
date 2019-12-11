'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'periodicities',
      [
        {
          id: 1,
          name: 'semanal',
          interval: 7,
          interval_type: 'day',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'mensal',
          interval: 1,
          interval_type: 'month',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          name: 'anual',
          interval: 12,
          interval_type: 'month',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {
        updateOnDuplicate: ['interval', 'interval_type']
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve(true);
  }
};
