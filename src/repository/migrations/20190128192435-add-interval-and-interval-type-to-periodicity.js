'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('periodicities', 'interval', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('periodicities', 'interval_type', {
        type: Sequelize.ENUM('day', 'month', 'year')
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('periodicities', 'interval'),
      queryInterface.removeColumn('periodicities', 'interval_type')
    ]);
  }
};
