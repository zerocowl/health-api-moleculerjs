'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('drugstores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cnpj: Sequelize.STRING,
      city: Sequelize.STRING,
      legal_name: Sequelize.STRING,
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      neighborhood: Sequelize.STRING,
      number: Sequelize.STRING,
      phone: Sequelize.STRING,
      state: Sequelize.STRING,
      street: Sequelize.STRING,
      zip_code: Sequelize.STRING,
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
    return queryInterface.dropTable('drugstores');
  }
};
