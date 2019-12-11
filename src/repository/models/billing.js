module.exports = (sequelize, DataTypes) => {
  const Billing = sequelize.define(
    'Billing',
    {
      charged_value: {
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      request_id: {
        references: {
          model: 'requests',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      status: {
        defaultValue: 'pending',
        type: DataTypes.ENUM('paid', 'canceled', 'refunded', 'pending')
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'billings',
      underscored: true
    }
  );

  Billing.associate = models => {
    models.Billing.belongsTo(models.Request, {
      as: 'requests',
      foreignKey: 'request_id'
    });
  };

  return Billing;
};
