import { Sequelize } from "sequelize";
import type { Models } from "../db/models";
import { InvalidToken } from "../types/errors";

import { BaseService } from "./base";
import type { Logger } from "pino";
import type { Config } from "../config";

import * as jsonwebtoken from 'jsonwebtoken';
import { Payload } from '../types';

export class JsonWebTokenService extends BaseService {
  constructor(
    models: Models,
    logger: Logger,
    db: Sequelize,
    config: Config,
  ) {
    super(models, logger, db, config);
  }

  async sign (key: string) {
    const token = await new Promise((resolve, reject) => {
      jsonwebtoken.sign(
        {sub: key}, 
        this.config.token.secret,
        {expiresIn: this.config.token.expire_in}, 
        (error: any, data: any) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        }
      );
    });
    return token;
  }

  async verify (token: string) {
    const decode = await new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, this.config.token.secret,  (error: any, data: any) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
    return decode;
  }

  // check validity of token
  async checkToken (req: any) {
    const auth_header = req.header('authorization');

    if (!auth_header) {
      throw new InvalidToken();
    }

    const auth_token = auth_header.split(' ')[1];
    if (!auth_token) {
      throw new InvalidToken();
    }

    let payload;
    try {
      payload = await this.verify(auth_token) as Payload;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new InvalidToken();
      }
    }

    // payload.sub is user email
    const user = await this.models.User.findOne({where: {email: payload?.sub}});

    return user;
  }
}
