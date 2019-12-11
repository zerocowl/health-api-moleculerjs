const { replace } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const AccountContact = sequelize.define(
    'AccountContact',
    {
      account_id: {
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      category: DataTypes.ENUM('landline', 'mobile'),
      number: {
        allowNull: false,
        get() {
          const value = this.getDataValue('number');
          if (!value) return null;
          return this.getDataValue('category') === 'mobile'
            ? `(${value.substr(2, 2)}) ${value.substr(4, 5)}-${value.substr(9, 4)}`
            : `(${value.substr(2, 2)}) ${value.substr(4, 4)}-${value.substr(8, 4)}`;
        },
        set(val) {
          let value = replace(val, /[^A-Z0-9]/gi, '');
          if (value && value.length < 13) value = ['55', value].join('');
          this.setDataValue('number', value || null);
        },
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'account_contacts',
      underscored: true
    }
  );

  return AccountContact;
};
