const isCPF = require('../../libs/cpf_validator');
const { replace, toLower } = require('lodash');
const { compareSync, hashSync, genSaltSync } = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      active: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      cpf: {
        set(val) {
          if (!val) return;
          this.setDataValue('cpf', replace(val, /[^\w\s]/gi, ''));
        },
        type: DataTypes.STRING,
        validate: {
          isCPF(value) {
            if (value && !isCPF(value)) throw new Error('CPF inválido');
          }
        }
      },
      email: {
        set(val) {
          if (!val) return;
          this.setDataValue('email', toLower(val));
        },
        type: DataTypes.STRING
      },
      msisdn: {
        allowNull: true,
        set(val) {
          if (val) {
            val = val.trim();
            val = replace(val, /[^A-Z0-9]/gi, '');
            this.setDataValue('msisdn', val);
          }
        },
        type: DataTypes.STRING,
        unique: true
      },
      password: DataTypes.STRING,
      password_reset_token: DataTypes.STRING,
      password_reset_token_expires_at: DataTypes.DATE,
      scope: {
        allowNull: false,
        defaultValue: 'patient',
        get() {
          return this.getDataValue('scope').split(', ');
        },
        type: DataTypes.STRING
      }
    },
    {
      defaultScope: {
        attributes: {
          include: [
            [
              sequelize.literal(
                "(case when password is not null and password != '' then true else false end)"
              ),
              'has_password'
            ]
          ],
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_token_expires_at',
            'created_at',
            'updated_at'
          ]
        }
      },
      scopes: {
        oauth: {}
      },
      tableName: 'users',
      underscored: true,
      paranoid: process.env.NODE_ENV === 'production'
    }
  );

  User.associate = models => {
    models.User.hasMany(models.Account, {
      as: 'accounts',
      foreignKey: 'user_id'
    });

    models.User.belongsToMany(models.Location, {
      as: 'locations',
      through: models.LocationEmployee,
      foreignKey: 'user_id'
    });
  };

  User.beforeSave(user => {
    if (user.changed('password')) {
      const salt = genSaltSync(10);
      let password = user.password;
      user.password = hashSync(password, salt);
    }
  });

  User.prototype.verifyPassword = function(password) {
    return compareSync(password, this.getDataValue('password'));
  };

  return User;
};
