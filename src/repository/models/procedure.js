module.exports = (sequelize, DataTypes) => {
  const Procedure = sequelize.define(
    'Procedure',
    {
      category: DataTypes.ENUM('consultation', 'examination'),
      description: DataTypes.TEXT,
      tuss_number: DataTypes.STRING
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'procedures',
      underscored: true
    }
  );

  return Procedure;
};
