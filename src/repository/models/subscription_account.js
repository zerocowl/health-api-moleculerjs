module.exports = (sequelize, DataTypes) => {
  const SubscriptionAccount = sequelize.define(
    'SubscriptionAccount',
    {
      as: {
        defaultValue: 'holder',
        type: DataTypes.ENUM('holder', 'dependent')
      },
      account_id: {
        primaryKey: true,
        references: {
          model: 'accounts',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      subscription_id: {
        primaryKey: true,
        references: {
          model: 'subscriptions',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      uid_url: DataTypes.STRING
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'subscription_account',
      underscored: true
    }
  );

  SubscriptionAccount.associate = models => {
    models.SubscriptionAccount.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'account_id'
    });

    models.SubscriptionAccount.belongsTo(models.Subscription, {
      as: 'subscription',
      foreignKey: 'subscription_id'
    });
  };

  return SubscriptionAccount;
};
