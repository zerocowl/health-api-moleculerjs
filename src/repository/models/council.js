module.exports = (sequelize, DataTypes) => {
  const Council = sequelize.define(
    'Council',
    {
      acronym: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      name: DataTypes.STRING
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'councils',
      underscored: true
    }
  );

  return Council;
};
