'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plan_items');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plan_items', {
      item_id: {
        primaryKey: true,
        references: {
          model: 'items',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      plan_item: {
        primaryKey: true,
        references: {
          model: 'plans',
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
  }
};
