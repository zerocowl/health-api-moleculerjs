module.exports = (sequelize, DataTypes) => {
  const OfferChannel = sequelize.define(
    'OfferChannel',
    {
      channel_id: {
        primaryKey: true,
        references: {
          model: 'channels',
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
      tableName: 'offers_channels',
      underscored: true
    }
  );

  return OfferChannel;
};
