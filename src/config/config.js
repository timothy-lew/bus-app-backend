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

const dbCommonSettings = {
  dialect: 'postgres',
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
};

module.exports = {
  development: {
    db: {
      database: process.env.DEV_DB_NAME,
      username: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      host: process.env.DEV_DB_HOST,
      ...dbCommonSettings,
      //logging: false,
    },
    api: {
      prefix: '',
      corsAllowedOrigins: '*',
    },
    pino: {
      level: 'debug',
      ...pinoCommonSettings,
    },
    token: {
      secret: '123',
      expire_in: '10h',
    },
    AccountKey: process.env.ACCOUNT_KEY,
  },
};
