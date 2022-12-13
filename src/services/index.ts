import type { Logger } from "pino";
import type { Sequelize } from "sequelize";
import type { Models } from "../db/models";
import type { Config } from "../config";
import { UserService } from "./user";
import { CryptService } from "./crypt";
import { JsonWebTokenService } from "./jsonwebtoken";

export type Services = {
  User: UserService;
  Crypt: CryptService;
  JsonWebToken: JsonWebTokenService;
};

export {
};

export function initServices(
  models: Models,
  logger: Logger,
  db: Sequelize,
  config: Config,
): Services {
  const JsonWebToken = new JsonWebTokenService(models, logger, db, config);
  const Crypt = new CryptService(models, logger, db, config);
  const User = new UserService(models, logger, db, config, Crypt, JsonWebToken);

  return {
    JsonWebToken,
    User,
    Crypt,
  };
}
