'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('locations', 'active', Sequelize.BOOLEAN),
      queryInterface.addColumn('locations', 'restricted_search', Sequelize.BOOLEAN)
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('locations', 'active'),
      queryInterface.removeColumn('locations', 'restricted_search')
    ];
  }
};
