module.exports = (sequelize, DataTypes) => {
  const OfferPaymentMethod = sequelize.define(
    'OfferPaymentMethod',
    {
      offer_id: {
        allowNull: false,
        references: {
          model: 'offers',
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
      defaultScope: {
        attributes: []
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'offer_payment_methods',
      underscored: true
    }
  );

  OfferPaymentMethod.associate = models => {};

  return OfferPaymentMethod;
};
