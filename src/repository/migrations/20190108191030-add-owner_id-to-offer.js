'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.addColumn('offers', 'owner_id', {
    //   references: {
    //     key: 'id',
    //     model: 'owners'
    //   },
    //   type: Sequelize.INTEGER
    // });
    return Promise.resolve(true);
  },

  down: queryInterface => {
    return queryInterface.removeColumn('offers', 'owner_id');
  }
};
