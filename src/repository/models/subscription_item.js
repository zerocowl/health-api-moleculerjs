module.exports = (sequelize, DataTypes) => {
  const SubscriptionItem = sequelize.define(
    'SubscriptionItem',
    {
      active: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      item_id: {
        primaryKey: true,
        references: {
          model: 'items',
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
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'subscription_items',
      underscored: true
    }
  );

  SubscriptionItem.associate = models => {
    models.SubscriptionItem.belongsTo(models.Subscription, {
      as: 'subscription',
      foreignKey: 'subscription_id'
    });

    models.SubscriptionItem.belongsTo(models.Item, {
      as: 'item',
      foreignKey: 'item_id'
    });
  };

  return SubscriptionItem;
};
