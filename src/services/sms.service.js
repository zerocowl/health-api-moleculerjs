const axios = require('axios');
const Joi = require('joi');
const Movile = require('movile-messaging');
const { deburr } = require('lodash');

module.exports = {
  name: 'sms',

  actions: {
    send: {
      async handler(ctx) {
        const { payment_provider_name, msisdn, text } = ctx.params;
        if (payment_provider_name === 'claro') {
          return this.mercury(msisdn, text);
        }
        return this.movile(msisdn, text);
      }
    },

    sendConfirmationCode(ctx) {
      const { destination, messageText } = ctx.params;
      return this.movile(destination, messageText);
    },

    createCodeValidator: {
      params: Joi.object().keys({
        destination: Joi.string().required()
      }),
      async handler(ctx) {
        const db = this.db;
        const { destination } = ctx.params;
        const code = Math.floor(1000 + Math.random() * 9000);
        try {
          this.movile(destination, `Seja bem-vindo(a)! Seu codigo de confirmacao eh ${code}`);
          await db.SMS.create({ phone: destination, code: code });
          return true;
        } catch (err) {
          this.logger.error(err);
          return false;
        }
      }
    },

    confirmCode: {
      params: Joi.object().keys({
        phone: Joi.string().required(),
        code: Joi.string().required()
      }),
      async handler({ params }) {
        const db = this.db;
        try {
          const sms = await db.SMS.findOne({
            where: { phone: params.phone, code: params.code }
          });
          if (!sms) throw new Error(`Codigo inválido`);
          return { message: 'success' };
        } catch (err) {
          throw err;
        }
      }
    }
  },

  methods: {
    movile(msisdn, text) {
      text = deburr(text);
      const sender = new Movile(process.env.MOVILE_USERNAME, process.env.MOVILE_AUTH_TOKEN);
      return sender.send(msisdn, 'DOUTORJA: '.concat(deburr(text)));
    },

    async mercury(msisdn, text) {
      const url = process.env.MERCURY_API;
      text = 'DOUTORJA: '.concat(deburr(text));
      let content = `<?xml version="1.0" encoding="UTF-8"?><Operation><ApplicationContext><ApplicationService>53</ApplicationService><ApplicationItem>001</ApplicationItem><AcessControl><ApplicationIdentity>us_mhealth</ApplicationIdentity><Authentication><Password>1mhealth_2</Password></Authentication></AcessControl></ApplicationContext><SubmitRequest><ShortMessage><Header><Originator>403</Originator><Destination><Number carrierId="">${msisdn}</Number></Destination></Header><Body><Text><![CDATA[${text}]]></Text></Body></ShortMessage></SubmitRequest></Operation>`;
      const { status, statusText, data: body } = await axios.post(url, content, {
        headers: {
          'Content-Type': 'application/xml'
        }
      });
      return { status, statusText, body };
    }
  },

  started() {
    this.db = require('../repository');
  }
};
