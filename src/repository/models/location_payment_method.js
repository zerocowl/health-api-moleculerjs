module.exports = (sequelize, DataTypes) => {
  const LocationPaymentMethod = sequelize.define(
    'LocationPaymentMethod',
    {
      location_id: {
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      payment_method_id: {
        allowNull: false,
        references: {
          model: 'payment_methods',
          key: 'id'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'location_payment_methods',
      underscored: true
    }
  );

  return LocationPaymentMethod;
};
