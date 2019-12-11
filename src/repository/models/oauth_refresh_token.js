module.exports = (sequelize, DataTypes) => {
  const OAuthRefreshToken = sequelize.define(
    'OAuthRefreshToken',
    {
      refresh_token: DataTypes.STRING(256),
      expires: DataTypes.DATE,
      scope: DataTypes.STRING
    },
    {
      tableName: 'oauth_refresh_tokens',
      underscored: true,
      paranoid: process.env.NODE_ENV === 'production'
    }
  );

  OAuthRefreshToken.associate = models => {
    models.OAuthRefreshToken.belongsTo(models.OAuthClient, {
      as: 'client',
      foreignKey: 'client_id'
    });

    models.OAuthRefreshToken.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id'
    });
  };

  return OAuthRefreshToken;
};
