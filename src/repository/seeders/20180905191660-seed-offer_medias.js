'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('offers_media', [
      { media_id: 1, offer_id: 1, created_at: new Date(), updated_at: new Date() },
      { media_id: 2, offer_id: 2, created_at: new Date(), updated_at: new Date() },
      { media_id: 2, offer_id: 3, created_at: new Date(), updated_at: new Date() },
      { media_id: 2, offer_id: 4, created_at: new Date(), updated_at: new Date() },
      { media_id: 2, offer_id: 5, created_at: new Date(), updated_at: new Date() },
      { media_id: 3, offer_id: 1, created_at: new Date(), updated_at: new Date() },
      { media_id: 4, offer_id: 8, created_at: new Date(), updated_at: new Date() },
      { media_id: 4, offer_id: 9, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('offers_media', null, {});
  }
};
