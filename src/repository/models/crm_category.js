module.exports = (sequelize, DataTypes) => {
  const CrmCategory = sequelize.define(
    'CrmCategory',
    {
      type: {
        get() {
          switch(this.getDataValue('type')) {
            case 'complain':
            return 'Reclamação';
            case 'question': 
            return 'Dúvida';
            case 'clinic_pre_register':
            return 'Pré cadastro de Clínica'
          }
        },
        allowNull: false,
        type: DataTypes.ENUM('complain', 'question', 'clinic_pre_register')
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'crm_categories',
      underscored: true
    }
  );

  return CrmCategory;
};
