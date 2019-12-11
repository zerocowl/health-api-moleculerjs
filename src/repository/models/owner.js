module.exports = (sequelize, DataTypes) => {
  const Owner = sequelize.define(
    'Owner',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      short_name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'owners',
      underscored: true
    }
  );

  Owner.associate = models => {
    models.Owner.hasMany(models.Offer, {
      as: 'offers',
      foreignKey: 'owner_id'
    });
  };

  return Owner;
};
