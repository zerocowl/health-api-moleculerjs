'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('offers', 'beneficiary_type', {
        defaultValue: 'pf',
        type: Sequelize.ENUM('pf', 'pj')
      }),
      queryInterface.addColumn('offers', 'contractor_type', {
        defaultValue: 'pf',
        type: Sequelize.ENUM('pf', 'pj')
      }),
      queryInterface.addColumn('offers', 'payer_type', {
        defaultValue: 'pf',
        type: Sequelize.ENUM('pf', 'pj')
      })
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('offers', 'beneficiary_type'),
      queryInterface.removeColumn('offers', 'contractor_type'),
      queryInterface.removeColumn('offers', 'payer_type')
    ]);
  }
};
