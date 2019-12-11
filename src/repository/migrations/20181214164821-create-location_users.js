'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('location_users', {
      as: {
        allowNull: false,
        defaultValue: 'employee',
        type: Sequelize.ENUM('administrator', 'employee', 'professional')
      },
      location_id: {
        primaryKey: true,
        references: {
          model: 'locations',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      user_id: {
        primaryKey: true,
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
    return queryInterface.dropTable('location_users');
  }
};
