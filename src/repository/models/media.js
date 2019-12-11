module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define(
    'Media',
    {
      keyword: DataTypes.STRING,
      name: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'media',
      underscored: true
    }
  );

  Media.associate = models => {
    models.Media.belongsToMany(models.Offer, {
      as: 'offers',
      through: models.OfferMedia,
      foreignKey: 'media_id'
    });
  };

  return Media;
};
