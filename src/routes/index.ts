import { Router } from 'express';
import type { Controllers } from '../controllers';

export default function (controllers: Controllers) {
  const router = Router();

  // bus
  router.get('/busstop/number/:stopNumber', controllers.Bus.getBusStopByNumber);
  router.get('/busstop/name/:name', controllers.Bus.getBusStopByName);

  return router;
}
