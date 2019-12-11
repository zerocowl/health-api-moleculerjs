module.exports = (sequelize, DataTypes) => {
  const CrmRequest = sequelize.define(
    'CrmRequest',
    {
      description: {
        type: DataTypes.STRING
      },
      category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'crm_categories',
          key: 'id'
        }
      },
      contact_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'crm_contacts',
          key: 'id'
        }
      },
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'crm_requests',
      underscored: true
    }
  );

  CrmRequest.associate = (models) => {
    models.CrmRequest.belongsTo(models.CrmCategory, { as: 'category', foreignKey: 'category_id' })
    models.CrmRequest.belongsTo(models.CrmContact, { as: 'contact', foreignKey: 'contact_id' })
  }

  return CrmRequest;
};