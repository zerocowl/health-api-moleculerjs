'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('items', 'name'),
      queryInterface.addColumn('items', 'action_name_alt', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('items', 'description_canceled', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('items', 'description_pending', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('items', 'description_pending_minha_claro', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('items', 'description_trial', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('items', 'title', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('items', 'title_alt', {
        type: Sequelize.STRING
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('items', 'action_name_alt'),
      queryInterface.removeColumn('items', 'description_canceled'),
      queryInterface.removeColumn('items', 'description_pending'),
      queryInterface.removeColumn('items', 'description_pending_minha_claro'),
      queryInterface.removeColumn('items', 'description_trial'),
      queryInterface.removeColumn('items', 'title'),
      queryInterface.removeColumn('items', 'title_alt')
    ]);
  }
};
