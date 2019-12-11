module.exports = (sequelize, DataTypes) => {
  const ProfessionalSpecialty = sequelize.define(
    'ProfessionalSpecialty',
    {
      professional_id: {
        primaryKey: true,
        references: {
          key: 'id',
          model: 'professionals'
        },
        type: DataTypes.INTEGER
      },
      specialty_id: {
        primaryKey: true,
        references: {
          key: 'id',
          model: 'specialties'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'professional_specialties',
      underscored: true
    }
  );

  return ProfessionalSpecialty;
};
