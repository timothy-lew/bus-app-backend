import { Sequelize } from "sequelize";
import type { Models } from "../db/models";

import { BaseService } from "./base";
import type { Logger } from "pino";
import type { Config } from "../config";

import crypto from 'crypto';

export class CryptService extends BaseService {

  constructor(
    models: Models,
    logger: Logger,
    db: Sequelize,
    config: Config,
  ) {
    super(models, logger, db, config);
  }

  /**
  * get the api secret
  */
  apiSecret () {
    return crypto.randomBytes(32).toString('base64');
  }

  /**
   * get an api salt
   */
  apiSalt () {
    return crypto.randomBytes(16).toString('base64');
  }

  /**
   * get the password-based key
   */
  apiPbkdf2 (secret: any, salt: any) {
    if (!Buffer.isBuffer(secret)) {
      secret = Buffer.from(secret, 'base64');
    }

    if (!Buffer.isBuffer(salt)) {
      salt = Buffer.from(salt, 'base64');
    }

    return new Promise((rslv, rjct) => {
      crypto.pbkdf2(secret, salt, 10000, 64, 'sha256', (err, key) => {
        if (err) return rjct(err);
        return rslv(key.toString('base64'));
      });
    });
  }

}
