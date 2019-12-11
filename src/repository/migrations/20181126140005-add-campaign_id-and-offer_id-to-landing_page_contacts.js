'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('landing_page_contact', 'campaign_id', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('landing_page_contact', 'offer_id', {
        allowNull: false,
        type: Sequelize.INTEGER
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('landing_page_contact', 'campaign_id'),
      queryInterface.removeColumn('landing_page_contact', 'offer_id')
    ];
  }
};
