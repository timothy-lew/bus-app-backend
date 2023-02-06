import type { LoggerOptions } from 'pino';
import type { Options } from 'sequelize';
import config from './config';

export type Config = {
  db: {
    database: string;
    username: string;
    password: string;
    host: string;
    // define: {
    //   schema: string;
    // };
  } & Options;
  api: {
    prefix: string;
    corsAllowedOrigins: string;
  };
  pino?: LoggerOptions;
  token: {
    secret: string;
    expire_in: string;
  };
  AccountKey: string;
};

export function getConfig(): Config {
  const env = process.env.NODE_ENV || 'development';
  return config[env as keyof typeof config] as Config;
}
