'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offer_items', {
      item_id: {
        primaryKey: true,
        references: {
          model: 'items',
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('offer_items');
  }
};
