import type { NextFunction, Request, Response } from 'express';
import type { Services } from '../services';
import { BaseController } from './base';

export class BusController extends BaseController {
  constructor(services: Services) {
    super(services);

    // when passing a method as a callback `this` is lost, so bind `this` to
    // each method so that `this` will be passed when method is called
    this.getBusStopByNumber = this.getBusStopByNumber.bind(this);
    this.getBusStopByName = this.getBusStopByName.bind(this);
  }

  async getBusStopByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.services.Bus.getBusStopByNumber(
        req.params.stopNumber
      );

      // res.status(200).send(result.data);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async getBusStopByName(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.services.Bus.getBusStopByName(req.params.name);

      // res.status(200).send(result.data);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
}
