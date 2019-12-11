'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('accounts', 'rg', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('accounts', 'rg_issue_date', {
        type: Sequelize.DATEONLY
      }),
      queryInterface.addColumn('accounts', 'rg_issuer', {
        type: Sequelize.STRING
      })
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('accounts', 'rg'),
      queryInterface.removeColumn('accounts', 'rg_issue_date'),
      queryInterface.removeColumn('accounts', 'rg_issuer')
    ]);
  }
};
