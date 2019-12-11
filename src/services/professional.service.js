const Joi = require('joi');
const { v4 } = require('uuid');

module.exports = {
  name: 'professional',

  actions: {
    create: {
      params: Joi.object()
        .keys({
          email: Joi.string().email(),
          first_name: Joi.string().empty(),
          last_name: Joi.string().empty(),
          msisdn: Joi.string().empty(),
          professional: Joi.object()
            .keys({
              specialties: Joi.array(),
              registration_number: Joi.string().empty()
            })
            .unknown(true)
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { professional, ...params } = ctx.params;
        const payload = {
          ...params,
          active: false,
          scope: 'professional',
          accounts: [
            {
              ...params,
              professional: professional
            }
          ]
        };
        const transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          const user = await db.User.create(payload, {
            include: [
              {
                as: 'accounts',
                model: db.Account,
                include: [
                  {
                    as: 'professional',
                    model: db.Professional
                  }
                ]
              }
            ],
            ...opts
          });
          const accounts = await user.getAccounts(opts);
          const mProfessional = await accounts[0].getProfessional(opts);
          await Promise.all(
            professional.specialties.map(i => {
              return mProfessional.addSpecialty(i.id, opts);
            })
          );
          const specialties = await mProfessional.getSpecialties(opts);
          await transaction.commit();
          const result = user.get({ plain: true });
          result.accounts[0].professional.medical_specialties = specialties;
          return result;
        } catch (err) {
          transaction.rollback();
          throw err;
        }
      }
    },

    findById: {
      params: Joi.object().keys({
        id: [Joi.number().required(), Joi.string().required()]
      }),
      handler({ params }) {
        const db = this.db;
        return db.Account.findOne({
          include: [
            {
              as: 'professional',
              model: db.Professional,
              attributes: {
                include: [[db.sequelize.col('council.acronym'), 'council_acronym']]
              },
              include: [
                {
                  as: 'specialties',
                  model: db.Specialty,
                  through: {
                    attributes: []
                  }
                },
                {
                  as: 'council',
                  model: db.Council,
                  attributes: []
                }
              ],
              where: { id: params.id }
            },
            'contacts'
          ]
        });
      }
    },

    update: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()]
        })
        .unknown(true),
      async handler(ctx) {
        const db = this.db;
        const { id, avatar, contacts, professional, ...payload } = ctx.params;
        const account = await db.Account.findById(id, {
          include: ['professional', 'contacts']
        });
        if (!account) throw new Error('Conta não encontrada');
        let transaction = null;
        transaction = await db.sequelize.transaction();
        const opts = { transaction: transaction };
        try {
          if (avatar) {
            const filePath = await ctx.call('s3.storage.upload', {
              identifier: v4(),
              base64String: avatar
            });
            if (!filePath) throw new Error('Não foi possível salvar a imagem do avatar');
            account.avatar = filePath;
          }
          if (professional) {
            if (professional.specialties) {
              account.professional.setSpecialties(professional.specialties, opts);
            }
            account.professional.update(professional, opts);
          }
          if (contacts) {
            account.setContacts(contacts, opts);
          }
          account.update(payload, opts);
          await transaction.commit();
          return account.reload();
        } catch (err) {
          await transaction.rollback();
          throw err;
        }
      }
    }
  },

  started() {
    this.db = require('../repository');
  }
};
