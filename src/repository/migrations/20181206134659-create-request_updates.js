'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('request_updates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      current_data: {
        allowNull: false,
        type: Sequelize.JSON
      },
      previous_data: {
        allowNull: false,
        type: Sequelize.JSON
      },
      request_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_agent: Sequelize.JSON,
      user_id: {
        references: {
          model: 'users',
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
    return queryInterface.dropTable('request_updates');
  }
};
