'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offers_campaigns', {
      campaign_id: {
        primaryKey: true,
        references: {
          model: 'campaigns',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      offer_id: {
        primaryKey: true,
        references: {
          model: 'offers',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('offers_campaigns');
  }
};
