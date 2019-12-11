'use strict';

module.exports = {
  up: queryInterface => {
    const pairs = [
      [1, 1],
      [2, 2],
      [3, 2],
      [8, 3],
      [9, 3],
      [10, 5],
      [11, 6],
      [12, 7],
      [13, 7],
      [14, 8],
      [15, 10],
      [16, 2],
      [17, 9],
      [18, 1],
      [19, 4]
    ];
    const rows = [];
    pairs.forEach(pair => {
      rows.push({
        offer_id: pair[0],
        campaign_id: pair[1],
        created_at: new Date(),
        updated_at: new Date()
      });
    });
    return queryInterface.bulkInsert('offers_campaigns', rows, {
      updateOnDuplicate: ['offer_id', 'campaign_id']
    });
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('offers_campaigns', null, {});
  }
};
