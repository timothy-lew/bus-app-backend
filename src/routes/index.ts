import { Router } from 'express';
import type { Controllers } from '../controllers';

export default function (controllers: Controllers) {
	const router = Router();

	router.get('/test', controllers.User.test);

	// admin
	router.get('/user/:email', controllers.User.get);
	router.post('/user', controllers.User.create);
	router.post('/user/login', controllers.User.login);
	router.post('/user/password', controllers.User.reset);

	// test to check validity of json web token
	router.get('/token/test', controllers.User.token);

	// bus
	router.get('/busstop/number/:stopNumber', controllers.Bus.getBusStopByNumber);
	router.get('/busstop/name/:name', controllers.Bus.getBusStopByName);

	return router;
}
