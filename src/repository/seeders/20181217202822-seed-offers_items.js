'use strict';

module.exports = {
  up: queryInterface => {
    const pairs = [
      [1, [2, 4, 5, 6, 7, 8, 9, 10]],
      [2, [2, 4, 5, 6, 7, 8, 9, 10]],
      [3, [2, 4, 5, 6, 7, 8, 9, 10]],
      [8, [2, 4, 5, 6, 7, 8, 9, 10]],
      [9, [2, 4, 5, 6, 7, 8, 9, 10]],
      [10, [2, 4, 5, 6, 7, 8, 9, 10]],
      [11, [2, 4, 5, 6, 7, 8, 9, 10]],
      [12, [2, 4, 5, 6, 7, 8, 9, 10]],
      [13, [2, 4, 5, 6, 7, 8, 9, 10]],
      [14, [2, 4, 5, 6, 7, 8, 9, 10]],
      [15, [2, 4, 5, 6, 7, 8, 9, 10]],
      [16, [2, 4, 5, 6, 10]],
      [17, [2, 4, 5, 6, 7, 8, 9, 10]],
      [18, [1, 2, 3, 10]],
      [19, [2, 4, 3, 6, 7, 8, 9, 10]]
    ];
    const rows = [];
    pairs.forEach(pair => {
      pair[1].forEach(item => {
        rows.push({
          offer_id: pair[0],
          item_id: item,
          created_at: new Date(),
          updated_at: new Date()
        });
      });
    });
    return queryInterface.bulkInsert('offer_items', rows, {
      updateOnDuplicate: ['offer_id', 'item_id']
    });
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('offer_items', null, {});
  }
};
