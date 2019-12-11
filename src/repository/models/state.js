module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define(
    'State',
    {
      code: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      region: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      uf: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'states',
      underscored: true
    }
  );

  State.associate = models => {
    models.State.hasMany(models.LocationAddress, {
      constraints: false,
      foreignKey: 'state',
      sourceKey: 'uf'
    });
  };

  return State;
};
