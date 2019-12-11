module.exports = (sequelize, DataTypes) => {
  const PlanDiscount = sequelize.define(
    'PlanDiscount',
    {
      discount: {
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      location_procedure_id: {
        references: {
          key: 'id',
          model: 'location_procedures'
        },
        type: DataTypes.INTEGER
      },
      plan_id: {
        defaultValue: 1,
        references: {
          key: 'id',
          model: 'plans'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'plan_discounts',
      underscored: true
    }
  );

  PlanDiscount.associate = models => {
    models.PlanDiscount.belongsTo(models.LocationProcedure, {
      as: 'location_procedure',
      foreignKey: 'location_procedure_id'
    });

    models.PlanDiscount.belongsTo(models.Plan, {
      as: 'plan',
      foreignKey: 'plan_id'
    });
  };

  return PlanDiscount;
};
