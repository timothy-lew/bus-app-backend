import { Router } from 'express';
import type { Controllers } from '../controllers';

export default function (controllers: Controllers) {
  const router = Router();

  // bus
  router.get('/buses/code/:stopNumber', controllers.Bus.getBusesByCode);
  router.get('/busstops/name/:name', controllers.Bus.getBusStopsByName);
  router.get('/busstop/code/:busStopCode', controllers.Bus.getBusStopByCode);

  return router;
}
