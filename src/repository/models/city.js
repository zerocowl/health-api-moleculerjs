module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    'City',
    {
      code: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      coords: {
        get() {
          return [
            this.getDataValue('coords').coordinates[1],
            this.getDataValue('coords').coordinates[0]
          ];
        },
        type: DataTypes.GEOMETRY('POINT')
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      uf: {
        allowNull: false,
        references: {
          key: 'uf',
          model: 'states'
        },
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'cities',
      underscored: true
    }
  );

  City.associate = models => {
    models.City.hasMany(models.LocationAddress, {
      constraints: false,
      foreignKey: 'city',
      sourceKey: 'name'
    });
  };

  return City;
};
