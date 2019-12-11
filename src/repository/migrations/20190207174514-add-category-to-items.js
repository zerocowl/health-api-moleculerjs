'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('items', 'category', {
        type: Sequelize.ENUM('exclusive', 'partial', 'open')
      }),
      queryInterface.removeColumn('items', 'basic')
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('items', 'category');
  }
};
