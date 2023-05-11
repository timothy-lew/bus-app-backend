/* eslint @typescript-eslint/no-var-requires: "off" */

// .env file is not in the same dir as this file
require('dotenv').config({ path: __dirname + '/../../.env' });

const pinoCommonSettings = {
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  formatters: {
    level(label, _number) {
      return { level: label };
    },
  },
  redact: {
    paths: ['req.headers.authorization', 'err.config.auth.*', 'config.auth.*'],
  },
};

module.exports = {
  development: {
    db: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    api: {
      prefix: '',
      corsAllowedOrigins: '*',
    },
    pino: {
      level: 'debug',
      ...pinoCommonSettings,
    },
    AccountKey: process.env.ACCOUNT_KEY,
  },
};
