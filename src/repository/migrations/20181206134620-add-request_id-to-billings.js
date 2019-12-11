'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('billings', 'request_id', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.removeColumn('billings', 'appointment_id')
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('billings', 'appointment_id', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.removeColumn('billings', 'request_id')
    ];
  }
};
