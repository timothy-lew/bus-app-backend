import type { NextFunction, Request, Response } from "express";
import type { Services } from "../services";
import { BaseController } from "./base";

export class UserController extends BaseController {
  constructor(services: Services) {
    super(services);

    // when passing a method as a callback `this` is lost, so bind `this` to
    // each method so that `this` will be passed when method is called
    this.test = this.test.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
    this.token = this.token.bind(this);
    this.reset = this.reset.bind(this);
  }

  async test(req: Request, res: Response, next: NextFunction) {
    console.log('testing');
    const result = await this.services.User.test();

    res.status(200).send(result.data);
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.services.JsonWebToken.checkToken(req);
      const result = await this.services.User.get(req.params.email);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.services.User.create(req.body.email, req.body.password);

      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.services.User.login(req.body.email, req.body.password);
      const token = await this.services.JsonWebToken.sign(user.email);

      res.status(200).send({user,token});
    } catch (err) {
      next(err);
    }
  }

  async token(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.services.JsonWebToken.checkToken(req);

      res.status(200).send({
        email: user!.email,
        name: user?.name
      });
    } catch (err) {
      next(err);
    }
  }

  async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.services.JsonWebToken.checkToken(req);
      const response = await this.services.User.resetPassword(req.body.old_password, req.body.new_password, user);

      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  }
}
