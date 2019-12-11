module.exports = (sequelize, DataTypes) => {
  const SMS = sequelize.define(
    'SMS',
    {
      phone: {
        allowNull: false,
        type: DataTypes.STRING
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'sms_validator',
      underscored: true
    }
  );

  return SMS;
};
