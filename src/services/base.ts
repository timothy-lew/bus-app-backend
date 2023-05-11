import type { Logger } from 'pino';
import type { Config } from '../config';
import type { MongoClient } from 'mongodb';

export abstract class BaseService {
  protected logger: Logger;
  protected config: Config;
  protected mongo: MongoClient;

  constructor(logger: Logger, config: Config, mongo: MongoClient) {
    this.logger = logger;
    this.config = config;
    this.mongo = mongo;
  }
}
