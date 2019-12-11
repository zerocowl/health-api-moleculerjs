'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('procedures', [
      {
        id: 1,
        category: 'consultation',
        description: 'Consulta em consultório (no horário normal ou preestabelecido)',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('procedures', null, {});
  }
};
