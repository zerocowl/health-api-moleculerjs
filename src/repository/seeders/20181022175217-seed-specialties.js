'use strict';
const { specialities: data } = require('../data/specialties.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const specialties = data.map(i => {
      return {
        id: i.id,
        name: i.name,
        council_id: i.council_id,
        specialty_id: i.speciality_id,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    return queryInterface.bulkInsert('specialties', specialties);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('specialties', null, {});
  }
};
