module.exports = (sequelize, DataTypes) => {
  const LocationContact = sequelize.define(
    'LocationContact',
    {
      category: DataTypes.ENUM('landline', 'mobile'),
      location_id: {
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      main: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
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
          let value = val.replace(/[^A-Z0-9]/gi, '');
          if (value.length < 13) value = ['55', value].join('');
          this.setDataValue('number', value);
        },
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'location_contacts',
      underscored: true
    }
  );

  return LocationContact;
};
