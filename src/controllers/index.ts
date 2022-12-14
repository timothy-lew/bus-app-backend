import { Services } from '../services';
import { BusController } from './bus';
import { UserController } from './user';

export type Controllers = {
	User: UserController;
	Bus: BusController;
};

export function initControllers(services: Services): Controllers {
	const User = new UserController(services);
	const Bus = new BusController(services);

	return {
		User,
		Bus,
	};
}
