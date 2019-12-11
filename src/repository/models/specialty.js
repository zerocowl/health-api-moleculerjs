module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define(
    'Specialty',
    {
      council_id: {
        references: {
          key: 'id',
          model: 'councils'
        },
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      specialty_id: {
        references: {
          key: 'id',
          model: 'specialties'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'specialties',
      underscored: true
    }
  );

  Specialty.associate = models => {
    models.Specialty.belongsTo(models.Council, {
      as: 'council',
      foreignKey: 'council_id'
    });
  };

  return Specialty;
};
