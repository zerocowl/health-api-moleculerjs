module.exports = (sequelize, DataTypes) => {
  const RequestUpdate = sequelize.define(
    'RequestUpdate',
    {
      current_data: {
        allowNull: false,
        type: DataTypes.JSON
      },
      previous_data: {
        allowNull: false,
        type: DataTypes.JSON
      },
      request_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_agent: DataTypes.JSON,
      user_id: {
        references: {
          model: 'users',
          key: 'id'
        },
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: process.env.NODE_ENV === 'production',
      tableName: 'request_updates',
      underscored: true
    }
  );

  return RequestUpdate;
};
