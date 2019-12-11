module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      base_value: DataTypes.INTEGER,
      charged_value: DataTypes.INTEGER,
      due_date: DataTypes.DATE,
      interest_rate: DataTypes.INTEGER,
      payment_date: DataTypes.DATE,
      payment_provider_id: DataTypes.STRING,
      status: DataTypes.STRING,
      subscription_id: {
        references: {
          model: 'subscriptions',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      url: DataTypes.STRING
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      },
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'invoices',
      underscored: true
    }
  );

  Invoice.associate = models => {
    models.Invoice.belongsTo(models.Subscription, {
      as: 'subscription',
      foreignKey: 'subscription_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Invoice;
};
