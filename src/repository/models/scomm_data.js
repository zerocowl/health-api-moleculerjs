module.exports = (sequelize, DataTypes) => {
  const SCOMMData = sequelize.define(
    'SCOMMData',
    {
      subscription_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      msisdn: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'scomm_data',
      underscored: true,
      timestamps: false
    }
  );

  return SCOMMData;
};
