const Joi = require('joi');
const { v4 } = require('uuid');
const { replace } = require('lodash');

module.exports = {
  name: 'backoffice.location',

  actions: {
    create: {
      params: Joi.object().keys({
        accessibility: Joi.boolean(),
        address: Joi.object().keys({
          street: Joi.string(),
          number: Joi.string().required(),
          zip_code: Joi.string().required(),
          city: Joi.string(),
          state: Joi.string(),
          neighborhood: Joi.string()
        }),
        category: Joi.string().required(),
        company: Joi.object().keys({
          cnpj: Joi.string()
        }),
        contacts: Joi.array(),
        coords: Joi.array(),
        description: Joi.string(),
        image: Joi.string(),
        name: Joi.string().required(),
        payment_methods: Joi.array(),
        professional: [
          Joi.object()
            .keys({
              account: Joi.object().keys({
                last_name: Joi.string(),
                first_name: Joi.string(),
                cpf: Joi.string(),
                email: Joi.string(),
                msisdn: Joi.string()
              }),
              council_id: Joi.number(),
              council_state: Joi.string(),
              registration_number: Joi.string()
            })
            .required(),
          Joi.number().required()
        ]
      }),
      async handler(ctx) {
        let {
          accessbility,
          address,
          category,
          company,
          contacts,
          coords,
          description,
          image,
          name,
          payment_methods,
          professional
        } = ctx.params;
        const db = this.db;
        const { fn } = db.sequelize;
        const [lat, lng] = coords;
        image = await this.uploadImage({ image });
        if (company) {
          company = await this.findOrCreateCompany({ name, cnpj: company.cnpj });
        }
        professional = await ctx.call('backoffice.professional.findOrCreate', professional);

        const transaction = await db.sequelize.transaction();
        const opts = { transaction };
        try {
          coords = fn('ST_GeomFromText', `POINT(${lng} ${lat})`);
          let location = await db.Location.create(
            {
              accessbility,
              address,
              category,
              contacts,
              coords,
              description,
              image,
              name,
              company_id: company ? company.id : null,
              professional_id: professional.id
            },
            {
              include: ['address', 'company', 'contacts'],
              ...opts
            }
          );

          await Promise.all(
            payment_methods.map(pm => {
              return location.addPayment_method(pm, opts);
            })
          );

          this.logger.info('Usuário manager criou', ctx.meta.user.id);

          await transaction.commit();
          return location.reload();
        } catch (err) {
          transaction.rollback();
          throw err;
        }
      }
    },

    update: {
      params: Joi.object()
        .keys({
          id: [Joi.number().required(), Joi.string().required()],
          accessibility: Joi.boolean(),
          address: Joi.object()
            .keys({
              street: Joi.string(),
              number: Joi.string().required(),
              zip_code: Joi.string().required(),
              city: Joi.string(),
              state: Joi.string(),
              neighborhood: Joi.string()
            })
            .unknown(),
          category: Joi.string().required(),
          company: Joi.object()
            .keys({
              cnpj: Joi.string()
            })
            .unknown(),
          contacts: Joi.array(),
          coords: Joi.array(),
          description: Joi.string(),
          image: Joi.string(),
          name: Joi.string().required(),
          payment_methods: Joi.array()
        })
        .unknown(),
      async handler(ctx) {
        let {
          id,
          accessbility,
          company,
          contacts,
          coords,
          description,
          image,
          name,
          payment_methods
        } = ctx.params;
        const db = this.db;
        const { fn } = db.sequelize;
        let location = await db.Location.findByPk(id, {
          include: ['address', 'company', 'contacts', 'payment_methods']
        });
        if (!location) throw new Error(`Local não encontrado com id ${id}`);

        if (coords) {
          const [lat, lng] = coords;
          coords = fn('ST_GeomFromText', `POINT(${lng} ${lat})`);
        }
        image = await this.uploadImage({ image });
        if (company) {
          await location.company.update(company);
        }

        const transaction = await db.sequelize.transaction();
        const opts = { transaction };
        try {
          location = await location.update(
            {
              accessbility,
              contacts,
              coords,
              description,
              image,
              name,
              company_id: company ? company.id : null
            },
            {
              include: ['address', 'company', 'contacts'],
              ...opts
            }
          );

          await Promise.all(
            payment_methods.map(pm => {
              return location.addPayment_method(pm, opts);
            })
          );

          this.logger.info('Usuário manager criou', ctx.meta.user.id);

          await transaction.commit();
          return location.reload();
        } catch (err) {
          transaction.rollback();
          throw err;
        }
      }
    }
  },

  methods: {
    async uploadImage({ image: base64String, identifier = v4() }) {
      if (!base64String) return null;
      const filePath = await this.broker.call('s3.storage.upload', {
        identifier,
        base64String
      });
      if (!filePath) throw new Error('Não foi possível salvar a imagem selecionada');
      return filePath;
    },

    async findOrCreateCompany({ name: legal_name, cnpj }) {
      cnpj = replace(cnpj, /[^A-Z0-9]/gi, '');
      const db = this.db;
      const [company] = db.Company.findOrCreate({
        where: { cnpj },
        defaults: { cnpj, legal_name }
      });
      return company;
    }
  },

  started() {
    this.db = require('../repository');
  }
};
