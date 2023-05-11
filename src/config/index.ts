import type { LoggerOptions } from 'pino';
import type { Options } from 'sequelize';
import config from './config';

export type Config = {
  db: {
    username: string;
    password: string;
  } & Options;
  api: {
    prefix: string;
    corsAllowedOrigins: string;
  };
  pino?: LoggerOptions;
  AccountKey: string;
};

export function getConfig(): Config {
  const env = process.env.NODE_ENV || 'development';
  return config[env as keyof typeof config] as Config;
}
