'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'plans',
      [
        { id: 1, name: 'empresarial', created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'varejo', created_at: new Date(), updated_at: new Date() },
        { id: 3, name: 'corporativo', created_at: new Date(), updated_at: new Date() }
      ],
      {
        updateOnDuplicate: ['name']
      }
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('plans', null, {});
  }
};
