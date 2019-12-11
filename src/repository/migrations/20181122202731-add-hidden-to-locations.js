'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('locations', 'manager'),
      queryInterface.addColumn('locations', 'hidden', Sequelize.BOOLEAN)
    ];
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('locations', 'hidden');
  }
};
