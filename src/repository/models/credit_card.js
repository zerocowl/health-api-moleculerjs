module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define(
    'CreditCard',
    {
      brand: DataTypes.STRING,
      display_number: DataTypes.STRING,
      expiration_month: DataTypes.INTEGER,
      expiration_year: DataTypes.INTEGER,
      holder_name: DataTypes.STRING,
      payment_provider_name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      payment_provider_id: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      subscription_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'subscriptions',
          key: 'id'
        }
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'credit_cards',
      underscored: true
    }
  );

  CreditCard.associate = models => {};

  return CreditCard;
};
