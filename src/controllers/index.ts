import { Services } from '../services';
import { BusController } from './bus';

export type Controllers = {
  Bus: BusController;
};

export function initControllers(services: Services): Controllers {
  const Bus = new BusController(services);

  return {
    Bus,
  };
}
