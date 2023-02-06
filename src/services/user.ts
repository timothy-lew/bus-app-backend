import { Sequelize } from 'sequelize';
import type { User as UserModel, Models } from '../db/models';
import {
  EmailAlreadyExists,
  NotFound,
  InvalidCredential,
} from '../types/errors';

// services
import { BaseService } from './base';
import type { CryptService } from './crypt';
import type { JsonWebTokenService } from './jsonwebtoken';

import type { Logger } from 'pino';
import type { Config } from '../config';
import * as uuid from 'uuid';

import { User } from '../types';

const axios = require('axios');

export class UserService extends BaseService {
  private cryptService: CryptService;
  private jsonWebTokenService: JsonWebTokenService;

  constructor(
    models: Models,
    logger: Logger,
    db: Sequelize,
    config: Config,

    cryptService: CryptService,
    jsonWebTokenService: JsonWebTokenService
  ) {
    super(models, logger, db, config);

    this.cryptService = cryptService;
    this.jsonWebTokenService = jsonWebTokenService;
  }

  async test() {
    console.log('in test fn');

    try {
      const response = await axios.get(
        'https://dummy.restapiexample.com/api/v1/employees'
      );

      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async get(email: string): Promise<User> {
    const user = await this.models.User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFound(email);
    }
    return toUserResponse(user);
  }

  async create(email: string, password: string): Promise<User> {
    this.logger.info('create_User_user');

    const result = await this.models.User.findOne({ where: { email: email } });
    if (result) {
      throw new EmailAlreadyExists(result.email);
    }

    const salt = this.cryptService.apiSalt();
    const hash = (await this.cryptService.apiPbkdf2(
      Buffer.from(password, 'utf8'),
      salt
    )) as string;

    const user = await this.models.User.create({
      id: uuid.v4(),
      email: email,
      pass_salt: salt,
      pass_hash: hash,
    });

    return toUserResponse(user);
  }

  async login(email: string, password: string): Promise<User> {
    this.logger.info('login_User_user');

    const user = (await this.models.User.findOne({
      where: { email: email },
    })) as User;

    if (!user) {
      throw new NotFound(email);
    }

    const hash = await this.cryptService.apiPbkdf2(
      Buffer.from(password, 'utf8'),
      user!.pass_salt
    );

    // wrong password
    if (user!.pass_hash !== hash) {
      throw new InvalidCredential();
    }

    return toUserResponse(user);
  }

  async resetPassword(old_password: string, new_password: string, user: any) {
    this.logger.info('reset_password_User_user');

    const old_hash = await this.cryptService.apiPbkdf2(
      Buffer.from(old_password, 'utf8'),
      user!.pass_salt
    );

    // wrong password
    if (user!.pass_hash !== old_hash) {
      throw new InvalidCredential();
    }

    // new password
    const salt = this.cryptService.apiSalt();
    const hash = (await this.cryptService.apiPbkdf2(
      Buffer.from(new_password, 'utf8'),
      salt
    )) as string;

    await user.update({
      pass_salt: salt,
      pass_hash: hash,
    });

    return toUserResponse(user);
  }
}

export function toUserResponse(user: User): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
