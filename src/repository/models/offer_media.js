module.exports = (sequelize, DataTypes) => {
  const OfferMedia = sequelize.define(
    'OfferMedia',
    {
      media_id: {
        primaryKey: true,
        references: {
          model: 'media',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      offer_id: {
        primaryKey: true,
        references: {
          model: 'offers',
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
      tableName: 'offers_media',
      underscored: true
    }
  );

  OfferMedia.associate = models => {};

  return OfferMedia;
};
