module.exports = (sequelize, DataTypes) => {
  const LocationEmployee = sequelize.define(
    'LocationEmployee',
    {
      as: {
        defaultValue: 'employee',
        type: DataTypes.ENUM('administrator', 'employee', 'professional')
      },
      location_id: {
        primaryKey: true,
        references: {
          model: 'locations',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      user_id: {
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'location_users',
      underscored: true
    }
  );

  return LocationEmployee;
};
