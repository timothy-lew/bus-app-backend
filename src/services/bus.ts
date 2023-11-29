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

  async getBusStopsByLatLong(latitude: string, longitude: string) {
    try {
      const db = this.mongo.db('bus');
      const collection = db.collection('buses');

      // 400m
      let range = 0.004
      const bus_stops = await collection
        .find( 
          {
          $and: [
              { Latitude: { $gte: Number(latitude) - range, $lte: Number(latitude) + range } },
              { Longitude: { $gte: Number(longitude) - range, $lte: Number(longitude) + range } },
            ],
          },
        { projection: { _id: 0 } } // not show _id
        )
        .toArray();

      // return bus_stops

      // Calculate distances and sort the results
      const sortedBusStops = bus_stops
          .map((busStop) => {
              const distance = this.calculateHaversineDistance(
                  Number(latitude),
                  Number(longitude),
                  busStop.Latitude,
                  busStop.Longitude
              );
              return { ...busStop, Distance: distance };
          })
          .sort((a, b) => a.Distance - b.Distance);

      return sortedBusStops;
    } catch (error) {
      console.error(error);
      throw new InvalidRequest();
    }
  }

  // Function to calculate the Haversine distance between two points
  calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
      const R = 6371000; // Earth radius in meters
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers
      return Math.round(distance);
  }
}
