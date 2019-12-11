'use strict';
const { data } = require('../data/municipios.json');
const geocodes = require('../data/geocode.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const cities = data.map(i => {
      let lat, lng;
      let geocode = geocodes.find(j => i['Codigo'] === j['GEOCODIGO_MUNICIPIO']);
      if (geocode) {
        lat = geocode['LATITUDE'];
        lng = geocode['LONGITUDE'];
      }
      return {
        code: i['Codigo'],
        name: i['Nome'].toLowerCase(),
        uf: i['Uf'].toLowerCase(),
        coords: geocode
          ? queryInterface.sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`)
          : null,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    return queryInterface.bulkInsert('cities', cities);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cities', null, {});
  }
};
