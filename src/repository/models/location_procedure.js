module.exports = (sequelize, DataTypes) => {
  const LocationProcedure = sequelize.define(
    'LocationProcedure',
    {
      active: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      base_value: {
        allowNull: false,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('base_value')) / 100;
        },
        type: DataTypes.INTEGER
      },
      days_to_next_appointment: {
        defaultValue: 30,
        type: DataTypes.INTEGER
      },
      discount: {
        allowNull: false,
        defaultValue: 0,
        get() {
          return `${this.getDataValue('discount')} %`;
        },
        type: DataTypes.INTEGER
      },
      final_value: {
        get() {
          let base_value = this.getDataValue('base_value');
          let discount = this.getDataValue('discount') || 0;
          let fixed_discount = parseFloat(discount / 100);
          if (fixed_discount > 1) fixed_discount = fixed_discount / 100;
          return parseFloat((base_value - base_value * fixed_discount) / 100);
        },
        type: DataTypes.VIRTUAL
      },
      location_id: {
        references: {
          key: 'id',
          model: 'locations'
        },
        type: DataTypes.INTEGER
      },
      procedure_id: {
        references: {
          key: 'id',
          model: 'procedures'
        },
        type: DataTypes.INTEGER
      },
      professional_id: {
        references: {
          key: 'id',
          model: 'professionals'
        },
        type: DataTypes.INTEGER
      },
      restrictions_min_age: {
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      specialty_id: {
        references: {
          key: 'id',
          model: 'specialties'
        },
        type: DataTypes.INTEGER
      },
      uid: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      hooks: {
        beforeValidate: function(instance) {
          instance.uid = [
            instance.getDataValue('location_id'),
            instance.getDataValue('procedure_id'),
            instance.getDataValue('specialty_id'),
            instance.getDataValue('professional_id')
          ].join('');
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'location_procedures',
      underscored: true
    }
  );

  LocationProcedure.associate = models => {
    models.LocationProcedure.belongsTo(models.Location, {
      as: 'location',
      foreignKey: 'location_id'
    });

    models.LocationProcedure.belongsTo(models.Procedure, {
      as: 'procedure',
      foreignKey: 'procedure_id'
    });

    models.LocationProcedure.belongsTo(models.Professional, {
      as: 'professional',
      foreignKey: 'professional_id'
    });

    models.LocationProcedure.belongsTo(models.Specialty, {
      as: 'specialty',
      foreignKey: 'specialty_id'
    });
  };

  return LocationProcedure;
};
