import type { Logger } from "pino";
import type { Sequelize } from "sequelize";
import type { Models } from "../db/models";
import type { Config } from "../config";

export abstract class BaseService {
  protected models: Models;
  protected logger: Logger;
  protected db: Sequelize;
  protected config: Config;

  constructor(models: Models, logger: Logger, db: Sequelize, config: Config) {
    this.models = models;
    this.logger = logger;
    this.db = db;
    this.config = config;
  }
}
