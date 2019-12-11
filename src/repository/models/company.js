module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
    {
      cnpj: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      legal_name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      name: DataTypes.STRING
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'companies',
      underscored: true
    }
  );

  return Company;
};
