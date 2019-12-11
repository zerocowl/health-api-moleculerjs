'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('councils', [
      {
        id: 1,
        name: 'Conselho Regional de Medicina',
        acronym: 'crm',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Conselho Regional de Odontologia',
        acronym: 'cro',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Conselho Regional de Fisioterapia e Terapia Ocupacional',
        acronym: 'crefito',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Conselho Regional de Fonoaudiologia',
        acronym: 'crefono',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Conselho Regional de Psicologia',
        acronym: 'crp',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'Conselho Regional de Nutricionistas',
        acronym: 'crn',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'Conselho Regional de Farmácia',
        acronym: 'crf',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('councils', null, {});
  }
};
