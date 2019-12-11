'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let created_at = new Date();
    let updated_at = new Date();
    return queryInterface.bulkInsert(
      'payment_methods',
      [
        {
          id: 1,
          name: 'cartão de crédito',
          short_name: 'credit_card',
          created_at,
          updated_at
        },
        {
          id: 2,
          name: 'boleto bancário',
          short_name: 'bank_slip',
          created_at,
          updated_at
        },
        { id: 3, name: 'minha claro', short_name: 'minha_claro', created_at, updated_at },
        { id: 4, name: 'gratuito', short_name: 'free', created_at, updated_at },
        { id: 5, name: 'dinheiro', short_name: 'cash', created_at, updated_at },
        { id: 6, name: 'cartão de débito', short_name: 'debit_card', created_at, updated_at }
      ],
      {
        updateOnDuplicate: ['short_name']
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve(true);
  }
};
