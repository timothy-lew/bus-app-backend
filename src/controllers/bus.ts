import type { NextFunction, Request, Response } from 'express';
import type { Services } from '../services';
import { BaseController } from './base';

export class BusController extends BaseController {
  constructor(services: Services) {
    super(services);

    // when passing a method as a callback `this` is lost, so bind `this` to
    // each method so that `this` will be passed when method is called
    this.getBusesByCode = this.getBusesByCode.bind(this);
    this.getBusStopsByName = this.getBusStopsByName.bind(this);
    this.getBusStopByCode = this.getBusStopByCode.bind(this);
    this.getBusStopsByLatLong = this.getBusStopsByLatLong.bind(this);
  }

  async getBusesByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.services.Bus.getBusesByCode(
        req.params.stopNumber
      );

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async getBusStopsByName(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.services.Bus.getBusStopsByName(req.params.name);

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async getBusStopByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.services.Bus.getBusStopByCode(req.params.busStopCode);

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async getBusStopsByLatLong(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.services.Bus.getBusStopsByLatLong(req.params.latitude, req.params.longitude);

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
}
