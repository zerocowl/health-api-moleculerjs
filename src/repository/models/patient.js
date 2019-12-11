module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    'Patient',
    {
      account_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'accounts',
          key: 'id'
        }
      },
      preferences_allow_notifications: DataTypes.TEXT,
      preferences_max_price: {
        allowNull: false,
        defaultValue: 9999,
        type: DataTypes.INTEGER
      },
      preferences_min_price: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'patients',
      underscored: true
    }
  );

  Patient.associate = models => {
    models.Patient.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'account_id'
    });
  };

  return Patient;
};
