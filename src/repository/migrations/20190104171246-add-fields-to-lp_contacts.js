'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('landing_page_contact', 'company_healthcare', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('landing_page_contact', 'company_url', {
        type: Sequelize.STRING
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('landing_page_contact', 'company_healthcare'),
      queryInterface.removeColumn('landing_page_contact', 'company_url')
    ]);
  }
};
