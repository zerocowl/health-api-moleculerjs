const { replace, toUpper } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const Drugstore = sequelize.define(
    'Drugstore',
    {
      cnpj: DataTypes.STRING,
      city: DataTypes.STRING,
      full_address: {
        get() {
          return this.street
            .concat(' ')
            .concat(this.number)
            .concat(', ')
            .concat(this.neighborhood)
            .concat(', ')
            .concat(this.city)
            .concat(' - ')
            .concat(toUpper(this.state));
        },
        type: DataTypes.VIRTUAL
      },
      legal_name: DataTypes.STRING,
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      neighborhood: DataTypes.STRING,
      number: DataTypes.STRING,
      phone: {
        get() {
          const value = this.getDataValue('phone');
          if (!value) return null;
          return value.length === 13
            ? `(${value.substr(2, 2)}) ${value.substr(4, 5)}-${value.substr(9, 4)}`
            : `(${value.substr(2, 2)}) ${value.substr(4, 4)}-${value.substr(8, 4)}`;
        },
        set(val) {
          let value = replace(val, /[^A-Z0-9]/gi, '');
          if (value && value.length < 13) value = ['55', value].join('');
          this.setDataValue('phone', value || null);
        },
        type: DataTypes.STRING
      },
      state: {
        set(val) {
          this.state = toUpper(val);
        },
        type: DataTypes.STRING
      },
      street: DataTypes.STRING,
      zip_code: DataTypes.STRING
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'drugstores',
      underscored: true
    }
  );

  Drugstore.associate = models => {};

  return Drugstore;
};
