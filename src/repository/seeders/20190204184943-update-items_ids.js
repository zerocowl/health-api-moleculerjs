'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        'UPDATE offer_items SET item_id = 11 WHERE item_id = 1 OR item_id = 4',
        'UPDATE subscription_items SET item_id = 11 WHERE item_id = 1 OR item_id = 4',
        'UPDATE offer_items SET item_id = 12 WHERE item_id = 6',
        'UPDATE subscription_items SET item_id = 12 WHERE item_id = 6',
        'UPDATE offer_items SET item_id = 13 WHERE item_id = 7',
        'UPDATE subscription_items SET item_id = 13 WHERE item_id = 7',
        'UPDATE offer_items SET item_id = 14 WHERE item_id = 8',
        'UPDATE subscription_items SET item_id = 14 WHERE item_id = 8',
        'UPDATE offer_items SET item_id = 15 WHERE item_id = 9',
        'UPDATE subscription_items SET item_id = 15 WHERE item_id = 9',
        'UPDATE offer_items SET item_id = 16 WHERE item_id = 10',
        'UPDATE subscription_items SET item_id = 16 WHERE item_id = 10',
        'UPDATE offer_items SET item_id = 17 WHERE item_id = 3 OR item_id = 5',
        'UPDATE subscription_items SET item_id = 17 WHERE item_id = 3 OR item_id = 5',
        'UPDATE offer_items SET item_id = 18 WHERE item_id = 2',
        'UPDATE subscription_items SET item_id = 18 WHERE item_id = 2',
        'DELETE FROM items WHERE id <= 10'
      ].map(sql => {
        return queryInterface.sequelize.query(sql);
      })
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve(true);
  }
};
