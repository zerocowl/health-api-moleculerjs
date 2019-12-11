'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('periodicities', [
      { id: 1, name: 'semanal', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'mensal', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'anual', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('periodicities', null, {});
  }
};
