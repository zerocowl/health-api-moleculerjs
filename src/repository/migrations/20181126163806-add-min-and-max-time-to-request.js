'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('requests', 'max_time', Sequelize.STRING),
      queryInterface.addColumn('requests', 'min_time', Sequelize.STRING)
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('requests', 'max_time'),
      queryInterface.removeColumn('requests', 'min_time')
    ];
  }
};
