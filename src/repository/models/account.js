const { replace, toLower } = require('lodash');
const isCPF = require('../../libs/cpf_validator');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    'Account',
    {
      avatar: DataTypes.STRING,
      birthday: {
        get() {
          if (this.getDataValue('birthday')) {
            return moment(this.getDataValue('birthday')).format('DD/MM/YYYY');
          }
        },
        set(val) {
          if (!val) return;
          this.setDataValue('birthday', moment(val, 'DD/MM/YYYY').toDate());
        },
        type: DataTypes.DATEONLY
      },
      cpf: {
        get() {
          let cpf = this.getDataValue('cpf');
          return replace(cpf, /(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
        },
        set(val) {
          let value = replace(val, /[^\w\s]/gi, '');
          this.setDataValue('cpf', value || null);
        },
        type: DataTypes.STRING,
        validate: {
          isCPF(value) {
            if (!isCPF(value)) throw new Error('CPF inválido');
          }
        }
      },
      email: {
        set(val) {
          this.setDataValue('email', toLower(val));
        },
        type: DataTypes.STRING
      },
      first_name: {
        type: DataTypes.STRING
      },
      gender: DataTypes.ENUM('male', 'female'),
      last_name: {
        type: DataTypes.STRING
      },
      msisdn: {
        get() {
          const value = this.getDataValue('msisdn');
          if (!value) return null;
          return `(${value.substr(2, 2)}) ${value.substr(4, 5)}-${value.substr(9, 4)}`;
        },
        set(val) {
          let value = replace(val, /[^A-Z0-9]/gi, '');
          if (value && value.length < 13) value = '55'.concat(value);
          this.setDataValue('msisdn', value || null);
        },
        type: DataTypes.STRING
      },
      name: {
        get() {
          return [this.getDataValue('first_name'), this.getDataValue('last_name')].join(' ');
        },
        type: DataTypes.VIRTUAL
      },
      pending_for_appointment: {
        get() {
          return (
            !Boolean(this.cpf) ||
            !Boolean(this.first_name) ||
            !Boolean(this.email) ||
            !Boolean(this.birthday) ||
            !Boolean(this.gender)
          );
        },
        type: DataTypes.VIRTUAL
      },
      pending_for_pbm: {
        get() {
          return !Boolean(this.cpf);
        },
        type: DataTypes.VIRTUAL
      },
      rg: {
        set(val) {
          let value = replace(val, /[^\w\s]/gi, '');
          this.setDataValue('rg', value || null);
        },
        type: DataTypes.STRING
      },
      rg_issue_date: DataTypes.DATEONLY,
      rg_issuer: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'accounts',
      underscored: true
    }
  );

  Account.associate = models => {
    models.Account.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Account.hasOne(models.Patient, {
      as: 'patient',
      foreignKey: 'account_id'
    });

    models.Account.hasOne(models.Professional, {
      as: 'professional',
      foreignKey: 'account_id'
    });

    models.Account.belongsToMany(models.Subscription, {
      as: 'subscriptions',
      through: {
        model: models.SubscriptionAccount,
        scope: { as: 'dependent' }
      },
      foreignKey: 'account_id'
    });

    models.Account.hasOne(models.Subscription, {
      as: 'subscription',
      foreignKey: 'account_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Account.hasOne(models.SubscriptionAccount, {
      as: 'subscription_account',
      foreignKey: 'account_id'
    });

    models.Account.hasMany(models.AccountContact, {
      as: 'contacts',
      foreignKey: 'account_id'
    });
  };

  return Account;
};
