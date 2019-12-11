module.exports = (sequelize, DataTypes) => {
  const OfferCampaign = sequelize.define(
    'OfferCampaign',
    {
      campaign_id: {
        primaryKey: true,
        references: {
          model: 'campaigns',
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
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'offers_campaigns',
      underscored: true
    }
  );

  return OfferCampaign;
};
