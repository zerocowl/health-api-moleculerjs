'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('items', 'action_name', Sequelize.STRING),
      queryInterface.addColumn('items', 'action_url', Sequelize.STRING)
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('items', 'action_name'),
      queryInterface.removeColumn('items', 'action_url')
    ];
  }
};
