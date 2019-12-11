'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('requests', 'available_schedule_date', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('requests', 'status_update_reason', {
        type: Sequelize.TEXT
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('requests', 'available_schedule_date'),
      queryInterface.removeColumn('requests', 'status_update_reason')
    ];
  }
};
