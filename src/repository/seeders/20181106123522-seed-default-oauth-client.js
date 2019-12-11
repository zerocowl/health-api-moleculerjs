'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('oauth_clients', [
      {
        client_id: '566ac1527458cf9b',
        client_secret: 'f5e95dd9382fd5ae8b669de5d78a17bb',
        name: 'web',
        redirect_uri: '0.0.0.0',
        grant_types: 'password',
        scope: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'site-hml',
        client_id: 'sitehml',
        client_secret: 'sitehmlsecret',
        redirect_uri: 'http://localhost/cb',
        grant_types: 'password',
        scope: 'site',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('oauth_clients', null, {});
  }
};
