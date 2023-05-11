import type { Logger } from 'pino';
import type { MongoClient } from 'mongodb';
import type { Config } from '../config';
import { BusService } from './bus';

export type Services = {
  Bus: BusService;
};

export {};

export function initServices(
  logger: Logger,
  config: Config,
  mongo: MongoClient
): Services {
  const Bus = new BusService(logger, config, mongo);

  return {
    Bus,
  };
}
