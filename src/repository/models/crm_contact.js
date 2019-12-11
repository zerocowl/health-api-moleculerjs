const { replace } = require('lodash')

module.exports = (sequelize, DataTypes) => {
  const CrmContact = sequelize.define(
    'CrmContact',
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      msisdn: {
        get() {
          const value = this.getDataValue('msisdn');
          if (!value) return null;
          return this.getDataValue('msisdn').length == 13
            ? `(${value.substr(2, 2)}) ${value.substr(4, 5)}-${value.substr(9, 4)}`
            : `(${value.substr(2, 2)}) ${value.substr(4, 4)}-${value.substr(8, 4)}`;
        },
        set(val) {
          let value = replace(val, /[^A-Z0-9]/gi, '');
          if (value && value.length < 13) value = ['55', value].join('');
          this.setDataValue('msisdn', value || null);
        },
        allowNull: false,
        type: DataTypes.STRING
      },
      full_name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      is_whatsapp: {
        defaultValue: false,
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'crm_contacts',
      underscored: true
    }
  );

  CrmContact.associate = (models) => {
    models.CrmContact.belongsTo(models.User, {as: 'user', foreignKey: 'user_id'});
    models.CrmContact.hasMany(models.CrmRequest, {as: 'requests', foreignKey: 'contact_id'})
  }

  return CrmContact;
};