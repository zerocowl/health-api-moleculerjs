module.exports = (sequelize, DataTypes) => {
  const SCOMMDataRevision = sequelize.define(
    'SCOMMDataRevision',
    {
      subscription_id: {
        allowNull: false,
        references: {
          model: 'scomm_data',
          key: 'subscription_id'
        },
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
      tableName: 'scomm_data_revisions',
      underscored: true,
      timestamps: false
    }
  );

  return SCOMMDataRevision;
};
