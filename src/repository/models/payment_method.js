module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define(
    'PaymentMethod',
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
      tableName: 'payment_methods',
      underscored: true
    }
  );

  PaymentMethod.associate = models => {};

  return PaymentMethod;
};
