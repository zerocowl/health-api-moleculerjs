'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('requests', 'status', {
      allowNull: false,
      defaultValue: 'requested',
      type: Sequelize.ENUM(
        'absent',
        'attended',
        'canceled',
        'confirmed',
        'in_progress',
        'pending',
        'refused',
        'requested',
        'rescheduled',
        'scheduled'
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('requests', 'status', {
      allowNull: false,
      defaultValue: 'requested',
      type: Sequelize.ENUM(
        'attended',
        'canceled',
        'confirmed',
        'in_progress',
        'pending',
        'refused',
        'requested',
        'rescheduled',
        'scheduled'
      )
    });
  }
};
