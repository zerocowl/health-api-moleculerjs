module.exports = (sequelize, DataTypes) => {
  const SubscriptionUpdate = sequelize.define(
    'SubscriptionUpdate',
    {
      current_data: DataTypes.JSON,
      previous_data: DataTypes.JSON,
      subscription_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_id: DataTypes.INTEGER,
      user_agent: DataTypes.JSON
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'subscription_updates',
      underscored: true
    }
  );

  return SubscriptionUpdate;
};
