'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('scomm_data_revisions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscription_id: {
        allowNull: false,
        references: {
          model: 'scomm_data',
          key: 'subscription_id'
        },
        type: Sequelize.INTEGER
      },
      msisdn: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('scomm_data_revisions');
  }
};
