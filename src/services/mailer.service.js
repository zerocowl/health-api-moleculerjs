const Joi = require('joi');
const sgMail = require('@sendgrid/mail');

module.exports = {
  name: 'mailer',

  actions: {
    send: {
      params: Joi.object().keys({
        to: Joi.string()
          .email()
          .required(),
        subject: Joi.string().required(),
        text: Joi.string().required()
      }),
      async handler(ctx) {
        const { params } = ctx;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        try {
          sgMail.send({
            from: 'noreply@doutorja.com.br',
            to: params.to,
            subject: params.subject,
            text: params.text
          });
        } catch (error) {
          return this.logger.error(error);
        }
      }
    },
    sendWithTemplate: {
      params: Joi.object().keys({
        to: Joi.string()
          .email()
          .required(),
        templateId: Joi.string(),
        dynamic_template_data: Joi.object()
      }),
      async handler(ctx) {
        const { params } = ctx;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        try {
          sgMail.send({
            from: 'noreply@doutorja.com.br',
            to: params.to,
            templateId: params.templateId,
            dynamic_template_data: params.dynamic_template_data
          });
        } catch (error) {
          return this.logger.error(error);
        }
      }
    }
  }
};
