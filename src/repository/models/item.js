module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    'Item',
    {
      action_name: DataTypes.STRING,
      action_name_alt: DataTypes.STRING,
      action_url: DataTypes.STRING,
      basic: {
        get() {
          return this.category === 'open';
        },
        type: DataTypes.VIRTUAL
      },
      category: DataTypes.ENUM('exclusive', 'partial', 'open'),
      default: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      description: DataTypes.TEXT,
      description_canceled: DataTypes.TEXT,
      description_pending: DataTypes.TEXT,
      description_pending_minha_claro: DataTypes.TEXT,
      description_trial: DataTypes.TEXT,
      internal: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      title_alt: DataTypes.STRING,
      short_name: DataTypes.STRING
    },
    {
      defaultScope: {
        attributes: {
          include: [['title', 'name']],
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'items',
      underscored: true
    }
  );

  Item.associate = models => {
    models.Item.belongsToMany(models.Offer, {
      as: 'offers',
      through: models.OfferItem,
      foreignKey: 'item_id'
    });
  };

  return Item;
};
