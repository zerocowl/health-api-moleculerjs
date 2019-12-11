'use strict';

module.exports = {
  up: queryInterface => {
    const pairs = [
      [1, 1],
      [2, 3],
      [3, 3],
      [8, 9],
      [9, 9],
      [10, 10],
      [11, 11],
      [12, 12],
      [13, 12],
      [14, 12],
      [15, 3],
      [16, 3],
      [17, 3],
      [18, 3],
      [19, 9]
    ];
    const rows = [];
    pairs.forEach(pair => {
      rows.push({
        offer_id: pair[0],
        channel_id: pair[1],
        created_at: new Date(),
        updated_at: new Date()
      });
    });
    return queryInterface.bulkInsert('offers_channels', rows, {
      updateOnDuplicate: ['offer_id', 'channel_id']
    });
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('offers_channels', null, {});
  }
};
