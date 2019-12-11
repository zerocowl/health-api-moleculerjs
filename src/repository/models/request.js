const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      allowed_status_changes: {
        get() {
          switch (this.getDataValue('status')) {
            case 'scheduled':
              return ['confirmed', 'canceled'];
            case 'canceled':
              return null;
            case 'attended':
              return null;
            case 'confirmed':
              return ['absent', 'attended', 'canceled', 'rescheduled'];
            case 'in_progress':
              return ['pending'];
            case 'pending':
              return ['scheduled', 'canceled'];
            case 'refused':
              return ['pending', 'canceled'];
            case 'requested':
              return ['scheduled', 'refused'];
            case 'rescheduled':
              return null;
          }
        },
        type: DataTypes.VIRTUAL
      },
      assignee_id: {
        references: {
          key: 'id',
          model: 'accounts'
        },
        type: DataTypes.INTEGER
      },
      account_id: {
        allowNull: false,
        references: {
          key: 'id',
          model: 'accounts'
        },
        type: DataTypes.INTEGER
      },
      available_schedule_date: DataTypes.TEXT,
      budget: {
        get() {
          return parseFloat(this.getDataValue('budget')) / 100;
        },
        type: DataTypes.INTEGER
      },
      category: {
        allowNull: false,
        defaultValue: 'consultation',
        type: DataTypes.ENUM('consultation', 'examination', 'general')
      },
      details: DataTypes.TEXT,
      locality: DataTypes.STRING,
      location_procedure_id: {
        references: {
          key: 'id',
          model: 'location_procedures'
        },
        type: DataTypes.INTEGER
      },
      max_time: DataTypes.STRING,
      min_time: DataTypes.STRING,
      payment_method_id: {
        references: {
          key: 'id',
          model: 'payment_methods'
        },
        type: DataTypes.INTEGER
      },
      payment_method: {
        get() {
          switch (this.getDataValue('payment_method_id')) {
            case 1:
              return 'Cartão de Crédito';
            case 2:
              return 'Boleto Bancário';
            case 3:
              return 'Minha Claro';
            case 4:
              return 'Direto na Clínica/Consultório';
            default:
              return 'Não especificado';
          }
        },
        type: DataTypes.VIRTUAL
      },
      prescription_image: DataTypes.STRING,
      reminder_sent: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      schedule_date: {
        defaultValue: new Date(),
        type: DataTypes.DATE
      },
      schedule_date_formatted: {
        get() {
          const scheduleDate = this.getDataValue('schedule_date');
          moment.locale('pt-br');
          return moment(scheduleDate)
            .format('ddd DD MMM HH:mm')
            .split(' ');
        },
        type: DataTypes.VIRTUAL
      },
      status: {
        allowNull: false,
        defaultValue: 'requested',
        type: DataTypes.ENUM(
          'absent',
          'attended',
          'canceled',
          'confirmed',
          'in_progress',
          'pending',
          'refused',
          'requested',
          'rescheduled',
          'scheduled'
        )
      },
      status_pt_br: {
        get() {
          switch (this.getDataValue('status')) {
            case 'scheduled':
              return 'agendado';
            case 'canceled':
              return 'cancelado';
            case 'absent':
              return 'não compareceu';
            case 'attended':
              return 'compareceu';
            case 'confirmed':
              return 'confirmado';
            case 'in_progress':
              return 'em análise';
            case 'pending':
              return 'pendente';
            case 'requested':
              return 'requisitado';
            case 'refused':
              return 'recusado';
            case 'rescheduled':
              return 'reagendado';
          }
        },
        type: DataTypes.VIRTUAL
      },
      status_update_reason: DataTypes.TEXT,
      subscription_id: {
        allowNull: false,
        references: {
          key: 'id',
          model: 'subscriptions'
        },
        type: DataTypes.INTEGER
      },
      user_id: {
        references: {
          key: 'id',
          model: 'users'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'requests',
      underscored: true,
      hooks: {
        beforeUpdate: (instance, options) => {
          sequelize.models.RequestUpdate.create({
            previous_data: instance._previousDataValues,
            current_data: instance.dataValues,
            request_id: instance.dataValues.id,
            user_agent: options.context ? options.context.user_agent : null,
            user_id: options.context ? options.context.user_id : null
          });
        }
      }
    }
  );

  Request.associate = models => {
    models.Request.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'account_id'
    });

    models.Request.belongsTo(models.LocationProcedure, {
      as: 'locationProcedure',
      foreignKey: 'location_procedure_id'
    });

    models.Request.belongsTo(models.Subscription, {
      as: 'subscription',
      foreignKey: 'subscription_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Request.hasMany(models.RequestUpdate, {
      as: 'request_updates',
      constraints: false,
      foreignKey: 'request_id'
    });
  };

  return Request;
};
