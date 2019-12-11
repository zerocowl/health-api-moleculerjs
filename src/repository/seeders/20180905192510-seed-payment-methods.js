'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('payment_methods', [
      { id: 1, name: 'cartão de crédito', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'boleto bancário', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'minha claro', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'gratuito', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'dinheiro', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'cartão de débito', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('payment_methods', null, {});
  }
};
