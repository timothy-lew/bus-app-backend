import { Router } from 'express';
import type { Controllers } from '../controllers';

export default function (controllers: Controllers) {
  const router = Router();

  // bus
  router.get('/buses/code/:stopNumber', controllers.Bus.getBusesByCode);

  // busstop
  router.get('/busstops/name/:name', controllers.Bus.getBusStopsByName);
  router.get('/busstop/code/:busStopCode', controllers.Bus.getBusStopByCode);

  router.get('/busstops/latlong/:latitude/:longitude', controllers.Bus.getBusStopsByLatLong);

  return router;
}
