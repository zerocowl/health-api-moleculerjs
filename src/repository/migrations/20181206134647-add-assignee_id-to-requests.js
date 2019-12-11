'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('requests', 'assignee_id', {
      references: {
        key: 'id',
        model: 'accounts'
      },
      type: Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('requests', 'assignee_id');
  }
};
