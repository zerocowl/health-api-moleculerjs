module.exports = (sequelize, DataTypes) => {
  const OfferItem = sequelize.define(
    'OfferItem',
    {
      item_id: {
        primaryKey: true,
        references: {
          model: 'items',
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
      tableName: 'offer_items',
      underscored: true
    }
  );

  return OfferItem;
};
