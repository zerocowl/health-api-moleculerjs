module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    'Plan',
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
      tableName: 'plans',
      underscored: true
    }
  );

  Plan.associate = models => {
    models.Plan.hasMany(models.Offer, {
      as: 'offers',
      foreignKey: 'plan_id'
    });
  };

  return Plan;
};
