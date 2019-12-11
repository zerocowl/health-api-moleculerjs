module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      account_id: {
        references: {
          model: 'accounts',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.STRING
      },
      read: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      request_id: {
        references: {
          model: 'requests',
          key: 'id'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'notifications',
      underscored: true
    }
  );

  return Notification;
};
