'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('subscriptions', 'cancellation_date', {
        type: Sequelize.DATE
      }),
      queryInterface.removeColumn('subscriptions', 'trial')
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('subscriptions', 'cancellation_date');
  }
};
