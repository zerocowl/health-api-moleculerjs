const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      account_id: {
        references: {
          model: 'accounts',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      campaign_id: {
        references: {
          model: 'campaigns',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      cancellation_date: DataTypes.DATE,
      cancellation_reason: DataTypes.STRING,
      channel_id: {
        references: {
          model: 'channels',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      media_id: {
        references: {
          model: 'media',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      next_renewal_date: DataTypes.DATE,
      offer_id: {
        references: {
          model: 'offers',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      payment_method_id: {
        references: {
          model: 'payment_methods',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      payment_provider_name: DataTypes.STRING,
      payment_provider_id: {
        type: DataTypes.STRING,
        unique: {
          msg: 'Uma assinatura para este payment_provider_id já existe'
        }
      },
      renewal_date: DataTypes.DATE,
      status: {
        allowNull: false,
        defaultValue: 'new',
        type: DataTypes.ENUM(
          'active',
          'canceled',
          'new',
          'pending',
          'requested',
          'suspended',
          'trial'
        )
      },
      status_pt_br: {
        get() {
          switch (this.getDataValue('status')) {
            case 'active':
              return 'ativa';
            case 'trial':
              return 'experimentação 7 dias';
            case 'canceled':
              return 'cancelado';
            case 'new':
              return 'nova';
            case 'pending':
              return 'pendente';
            case 'requested':
              return 'requisitada';
            case 'suspended':
              return 'suspensa';
          }
        },
        type: DataTypes.VIRTUAL
      },
      substatus: {
        get() {
          let next_renewal_date = moment(this.next_renewal_date).format('DD/MM');
          let cancellation_date = moment(this.cancellation_date).format('DD/MM');
          switch (this.status) {
            case 'trial': {
              return `Seu período de teste acaba ${next_renewal_date}. Para utilizar todos os serviços, renove sua assinatura no dia ${next_renewal_date}`;
            }
            case 'active': {
              return `Sua assinatura vence no dia ${next_renewal_date}.`;
            }
            case 'pending': {
              if (this.payment_provider_name === 'claro') {
                return `Sua assinatura venceu no dia ${next_renewal_date}. Para renovar faça uma recarga.`;
              }
              return `Estamos aguardando a confirmação de pagamento da sua assinatura. A anterior venceu no dia ${next_renewal_date}.`;
            }
            case 'canceled': {
              return `Sua assinatura foi cancelada no dia ${cancellation_date}. Para utilizar os serviços, reative sua assinatura`;
            }
          }
        },
        type: DataTypes.VIRTUAL
      },
      uid: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      hooks: {
        beforeUpdate: (instance, options) => {
          sequelize.models.SubscriptionUpdate.create({
            previous_data: instance._previousDataValues,
            current_data: instance.dataValues,
            subscription_id: instance.dataValues.id,
            user_agent: options.context ? options.context.user_agent : null
          });
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'subscriptions',
      underscored: true,
      validate: {
        cancellationReasonOnStatusChange() {
          if (this.status === 'canceled' && !this.cancellation_reason) {
            throw new Error('Para cancelar uma assinatura é preciso especificar um motivo');
          }
        }
      }
    }
  );

  Subscription.associate = models => {
    models.Subscription.belongsToMany(models.Account, {
      as: 'accounts',
      through: models.SubscriptionAccount,
      foreignKey: 'subscription_id'
    });

    models.Subscription.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'account_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Subscription.hasOne(models.SubscriptionAddress, {
      as: 'address',
      foreignKey: 'subscription_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Subscription.hasOne(models.CreditCard, {
      as: 'credit_card',
      foreignKey: 'subscription_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Subscription.belongsTo(models.Offer, {
      as: 'offer',
      foreignKey: 'offer_id'
    });

    models.Subscription.belongsTo(models.PaymentMethod, {
      as: 'payment_method',
      foreignKey: 'payment_method_id'
    });

    models.Subscription.belongsToMany(models.Item, {
      as: 'items',
      through: models.SubscriptionItem,
      foreignKey: 'subscription_id'
    });

    models.Subscription.hasMany(models.Invoice, {
      as: 'invoices',
      foreignKey: 'subscription_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Subscription;
};
