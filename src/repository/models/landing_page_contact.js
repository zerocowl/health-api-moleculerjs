module.exports = (sequelize, DataTypes) => {
  const LandingPageContact = sequelize.define(
    'LandingPageContact',
    {
      campaign_id: {
        allowNull: false,
        defaultValue: 2,
        references: {
          keys: 'id',
          model: 'campaigns'
        },
        type: DataTypes.INTEGER
      },
      channel_id: {
        allowNull: false,
        defaultValue: 9,
        references: {
          keys: 'id',
          model: 'channels'
        },
        type: DataTypes.INTEGER
      },
      company_healthcare: DataTypes.BOOLEAN,
      company_name: DataTypes.STRING,
      company_url: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'E-mail inválido'
          }
        }
      },
      employees_number: DataTypes.INTEGER,
      media_id: {
        allowNull: false,
        defaultValue: 4,
        references: {
          keys: 'id',
          model: 'media'
        },
        type: DataTypes.INTEGER
      },
      offer_id: {
        allowNull: false,
        defaultValue: 8,
        references: {
          keys: 'id',
          model: 'offers'
        },
        type: DataTypes.INTEGER
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING
      },
      position: DataTypes.STRING,
      supervisor: DataTypes.STRING
    },
    {
      tableName: 'landing_page_contact',
      underscored: true,
      paranoid: process.env.NODE_ENV === 'production'
    }
  );

  return LandingPageContact;
};
