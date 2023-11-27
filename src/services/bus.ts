import { InvalidRequest } from '../types/errors';
import type { MongoClient } from 'mongodb';

// services
import { BaseService } from './base';

import type { Logger } from 'pino';
import type { Config } from '../config';

const axios = require('axios');

export class BusService extends BaseService {
  constructor(logger: Logger, config: Config, mongo: MongoClient) {
    super(logger, config, mongo);
  }

  async getBusesByCode(stopNumber: string) {
    try {
      const response = await axios.get(
        'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2',
        {
          params: {
            BusStopCode: stopNumber,
          },
          headers: {
            AccountKey: this.config.AccountKey,
          },
        }
      );

      // console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new InvalidRequest();
    }
  }

  async getBusStopsByName(name: string) {
    try {
      const db = this.mongo.db('bus');
      const collection = db.collection('buses');

      // search db using regex
      const bus_stops = await collection
        .find(
          {
            $or: [
              { RoadName: { $regex: new RegExp(name, 'i') } },
              { Description: { $regex: new RegExp(name, 'i') } },
            ],
          },
          { projection: { _id: 0 } } // not show _id
        )
        .toArray();

      return bus_stops;
    } catch (error) {
      console.error(error);
      throw new InvalidRequest();
    }
  }

  async getBusStopByCode(code: string) {
    try {
      const db = this.mongo.db('bus');
      const collection = db.collection('buses');

      // search db using regex
      const bus_stops = await collection
        .find(
          { BusStopCode: code},
          { projection: { _id: 0 } } // not show _id
        )
        .toArray();

      return bus_stops.length == 0 ? {} : bus_stops[0]
    } catch (error) {
      console.error(error);
      throw new InvalidRequest();
    }
  }
}
