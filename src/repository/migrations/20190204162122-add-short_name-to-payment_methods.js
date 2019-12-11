'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('payment_methods', 'short_name', {
      type: Sequelize.STRING,
      unique: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('payment_methods', 'short_name');
  }
};
