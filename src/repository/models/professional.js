module.exports = (sequelize, DataTypes) => {
  const Professional = sequelize.define(
    'Professional',
    {
      account_id: {
        references: {
          model: 'accounts',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      council_id: {
        references: {
          model: 'councils',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      council_state: DataTypes.STRING,
      registration_number: DataTypes.STRING,
      resume: DataTypes.TEXT
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'professionals',
      underscored: true
    }
  );

  Professional.associate = models => {
    models.Professional.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'account_id'
    });

    models.Professional.belongsTo(models.Council, {
      as: 'council',
      foreignKey: 'council_id'
    });

    models.Professional.belongsToMany(models.Specialty, {
      as: { plural: 'specialties', singular: 'specialty' },
      through: models.ProfessionalSpecialty,
      foreignKey: 'professional_id'
    });

    models.Professional.hasMany(models.Location, {
      as: 'locations',
      foreignKey: 'professional_id'
    });
  };

  return Professional;
};
