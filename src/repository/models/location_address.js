const { capitalize, toLower, startCase, upperCase } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const LocationAddress = sequelize.define(
    'LocationAddress',
    {
      complement: DataTypes.STRING,
      city: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('city', toLower(val));
        }
      },
      full_address: {
        get() {
          return [
            [
              startCase(this.getDataValue('street')),
              this.getDataValue('number'),
              startCase(this.getDataValue('complement')) || null,
              capitalize(this.getDataValue('neighborhood')),
              startCase(this.getDataValue('city'))
            ]
              .filter(Boolean)
              .join(', '),
            upperCase(this.getDataValue('state'))
          ].join(' - ');
        },
        type: DataTypes.VIRTUAL
      },
      location_id: {
        references: {
          model: 'locations',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      neighborhood: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('neighborhood', toLower(val));
        }
      },
      number: {
        allowNull: false,
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('state', toLower(val));
        }
      },
      street: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('street', toLower(val));
        }
      },
      zip_code: {
        allowNull: false,
        get() {
          const zipCode = this.getDataValue('zip_code');
          return `${zipCode.substr(0, 5)}-${zipCode.substr(5, 3)}`;
        },
        set(val) {
          this.setDataValue('zip_code', val.replace(/[^\w\s]/gi, ''));
        },
        type: DataTypes.STRING
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'location_addresses',
      underscored: true
    }
  );

  return LocationAddress;
};
