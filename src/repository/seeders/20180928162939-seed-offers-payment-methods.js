'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('offer_payment_methods', [
      { offer_id: 1, payment_method_id: 3, created_at: new Date(), updated_at: new Date() },
      { offer_id: 2, payment_method_id: 1, created_at: new Date(), updated_at: new Date() },
      { offer_id: 2, payment_method_id: 2, created_at: new Date(), updated_at: new Date() },
      { offer_id: 3, payment_method_id: 1, created_at: new Date(), updated_at: new Date() },
      { offer_id: 3, payment_method_id: 2, created_at: new Date(), updated_at: new Date() },
      { offer_id: 8, payment_method_id: 1, created_at: new Date(), updated_at: new Date() },
      { offer_id: 9, payment_method_id: 2, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('offer_payment_methods', null, {});
  }
};
