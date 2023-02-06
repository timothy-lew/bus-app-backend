import { Sequelize } from 'sequelize';
import type { Models } from '../db/models';
import { InvalidRequest } from '../types/errors';

// services
import { BaseService } from './base';

import type { Logger } from 'pino';
import type { Config } from '../config';

const axios = require('axios');

export class BusService extends BaseService {
  constructor(models: Models, logger: Logger, db: Sequelize, config: Config) {
    super(models, logger, db, config);
  }

  async getBusStopByNumber(stopNumber: string) {
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

      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new InvalidRequest();
    }
  }

  async getBusStopByName(name: string) {
    try {
      // there are ~5080 bus stops

      const loop = 0;
      let res = [] as any;

      for (let i = 0; i < 11; i++) {
        const busStops = await axios.get(
          `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${
            i * 500
          }`,
          {
            headers: {
              AccountKey: this.config.AccountKey,
            },
          }
        );

        let stops = busStops.data.value;

        for (let stop of stops) {
          if (
            stop.RoadName.toLowerCase().includes(name.toLowerCase()) ||
            stop.Description.toLowerCase().includes(name.toLowerCase())
          ) {
            res.push(stop);
          }
        }
      }

      return res;
    } catch (error) {
      console.error(error);
      throw new InvalidRequest();
    }
  }
}
