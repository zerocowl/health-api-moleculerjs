module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      accessibility: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      active: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      category: {
        allowNull: false,
        type: DataTypes.ENUM('clinic', 'office')
      },
      company_id: {
        references: {
          key: 'id',
          model: 'companies'
        },
        type: DataTypes.INTEGER
      },
      coords: {
        allowNull: false,
        get() {
          return [
            this.getDataValue('coords').coordinates[1],
            this.getDataValue('coords').coordinates[0]
          ];
        },
        type: DataTypes.GEOMETRY('POINT')
      },
      description: DataTypes.TEXT,
      hidden: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      image: DataTypes.STRING,
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      professional_id: {
        allowNull: false,
        references: {
          key: 'id',
          model: 'professionals'
        },
        type: DataTypes.INTEGER
      },
      radius: DataTypes.INTEGER,
      restricted_search: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      score: {
        defaultValue: 500,
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
      tableName: 'locations',
      underscored: true
    }
  );

  Location.associate = models => {
    models.Location.hasOne(models.LocationAddress, {
      as: 'address',
      foreignKey: 'location_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Location.belongsTo(models.Company, {
      as: 'company',
      foreignKey: 'company_id'
    });

    models.Location.hasMany(models.LocationContact, {
      as: 'contacts',
      foreignKey: 'location_id'
    });

    models.Location.belongsTo(models.Professional, {
      as: 'professional',
      foreignKey: 'professional_id'
    });

    models.Location.hasMany(models.LocationProcedure, {
      as: 'location_procedures',
      foreignKey: 'location_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    models.Location.belongsToMany(models.PaymentMethod, {
      as: 'payment_methods',
      through: models.LocationPaymentMethod,
      foreignKey: 'location_id'
    });

    models.Location.belongsToMany(models.User, {
      as: 'employees',
      through: models.LocationEmployee,
      foreignKey: 'location_id'
    });
  };

  return Location;
};
