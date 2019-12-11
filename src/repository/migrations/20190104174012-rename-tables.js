'use strict';

module.exports = {
  up: queryInterface => {
    return Promise.all([
      queryInterface.dropTable('oauth_authorization_codes'),
      queryInterface.dropTable('oauth_scopes'),
      queryInterface.dropTable('roles'),
      queryInterface.dropTable('role_groups'),
      queryInterface.dropTable('regions')
    ]);
  }
};
