module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define(
    'Offer',
    {
      active: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      beneficiary_type: {
        defaultValue: 'pf',
        type: DataTypes.ENUM('pf', 'pj')
      },
      best_seller: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      contractor_type: {
        defaultValue: 'pf',
        type: DataTypes.ENUM('pf', 'pj')
      },
      description: DataTypes.TEXT,
      discount: {
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      owner_id: {
        references: {
          key: 'id',
          model: 'owners'
        },
        type: DataTypes.INTEGER
      },
      payer_type: {
        defaultValue: 'pf',
        type: DataTypes.ENUM('pf', 'pj')
      },
      periodicity_id: {
        references: {
          model: 'periodicities',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      plan_id: {
        allowNull: false,
        references: {
          model: 'plans',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      regular_price: {
        defaultValue: 0,
        get() {
          return (parseFloat(this.getDataValue('regular_price')) / 100.0).toFixed(2).split('.');
        },
        type: DataTypes.INTEGER
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: [
            'beneficiary_type',
            'contractor_type',
            'created_at',
            'owner_id',
            'payer_type',
            'updated_at'
          ]
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'offers',
      underscored: true
    }
  );

  Offer.associate = models => {
    models.Offer.belongsTo(models.Plan, {
      as: 'plan',
      foreignKey: 'plan_id'
    });

    models.Offer.belongsToMany(models.Item, {
      as: 'items',
      through: models.OfferItem,
      foreignKey: 'offer_id'
    });

    models.Offer.belongsTo(models.Periodicity, {
      as: 'periodicity',
      foreignKey: 'periodicity_id'
    });

    models.Offer.belongsToMany(models.PaymentMethod, {
      as: 'payment_methods',
      through: models.OfferPaymentMethod,
      foreignKey: 'offer_id'
    });

    models.Offer.belongsToMany(models.Channel, {
      as: 'channels',
      through: models.OfferChannel,
      foreignKey: 'offer_id'
    });

    models.Offer.belongsToMany(models.Campaign, {
      as: 'campaigns',
      through: models.OfferCampaign,
      foreignKey: 'offer_id'
    });

    models.Offer.belongsToMany(models.Media, {
      as: 'medias',
      through: models.OfferMedia,
      foreignKey: 'offer_id'
    });

    models.Offer.hasMany(models.Subscription, {
      as: 'subscriptions',
      foreignKey: 'offer_id'
    });

    models.Offer.belongsTo(models.Owner, {
      as: 'owner',
      foreignKey: 'owner_id'
    });
  };

  return Offer;
};
