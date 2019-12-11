'use strict';
// const CSV_FILE = './Base_Claro_Saude.csv';
// const csv = require('csvtojson/v2');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const data = await csv({ delimiter: '\t' }).fromFile(CSV_FILE);
    // let rows = data.map(({ SUBSCRIPTIONID: subscription_id, MSISDN: msisdn, STATUS: status }) => {
    //   return { subscription_id: +subscription_id, msisdn, status: status.toLowerCase() };
    // });
    // return queryInterface.bulkInsert('scomm_data', rows, {
    //   updateOnDuplicate: ['status']
    // });
    return Promise.resolve(true);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('scomm_data', null, {});
  }
};
