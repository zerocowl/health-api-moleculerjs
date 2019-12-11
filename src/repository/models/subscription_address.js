const { capitalize, startCase, upperCase } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const SubscriptionAddress = sequelize.define(
    'SubscriptionAddress',
    {
      complement: DataTypes.STRING,
      city: {
        type: DataTypes.STRING
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
      neighborhood: {
        type: DataTypes.STRING
      },
      number: {
        allowNull: false,
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      street: {
        type: DataTypes.STRING
      },
      subscription_id: {
        references: {
          model: 'subscriptions',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      zip_code: {
        allowNull: false,
        set(val) {
          this.setDataValue('zip_code', val.replace(/[^\w\s]/gi, ''));
        },
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'subscription_addresses',
      underscored: true
    }
  );

  return SubscriptionAddress;
};
