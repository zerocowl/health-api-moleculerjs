const JoiValidator = require('./libs/joi.validator');

module.exports = {
  namespace: 'core-api',
  transporter: 'TCP',
  logger: true,
  logLevel: 'info',
  logFormatter: 'short',
  cacher: {
    type: 'memory',
    options: {
      maxParamsLength: 100
    }
  },
  metrics: true,
  validation: true,
  validator: new JoiValidator()
};
