module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    'Channel',
    {
      carrier: DataTypes.STRING,
      group: DataTypes.ENUM('messaging', 'social', 'ura', 'web'),
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      provider: DataTypes.STRING
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'channels',
      underscored: true
    }
  );

  Channel.associate = models => {};

  return Channel;
};
