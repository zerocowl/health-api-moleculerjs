module.exports = (sequelize, DataTypes) => {
  const Periodicity = sequelize.define(
    'Periodicity',
    {
      name: {
        allowNull: false,
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
      tableName: 'periodicities',
      underscored: true
    }
  );

  Periodicity.associate = models => {
    models.Periodicity.hasMany(models.Offer, {
      as: 'offers',
      foreignKey: 'periodicity_id'
    });
  };

  return Periodicity;
};
