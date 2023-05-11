'use strict';

import express, { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';
import router from './routes';
import { initControllers } from './controllers';
import { initServices, Services } from './services';
import { getConfig } from './config';
import { MongoClient } from 'mongodb';

const PORT = process.env.PORT || 3000;

const config = getConfig();

const app = express();

// add cors middleware
const corsOptions = {
  origin: config.api.corsAllowedOrigins,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// initialize pino
const logger = pino({
  ...config.pino,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['req.headers.authorization'],
  },
});

// add logger
app.use(
  pinoHttp({
    logger: logger,
  })
);

// initialize models, services and controllers.
const mongo = new MongoClient(
  `mongodb+srv://${config.db.username}:${config.db.password}@cluster0.mbbwtrn.mongodb.net/?retryWrites=true&w=majority`
);
mongo.connect();
const services: Services = initServices(logger, config, mongo);
const controllers = initControllers(services);

// add body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// add main router
const authRouter = router(controllers);
app.use(config.api.prefix, authRouter);

/* eslint-disable @typescript-eslint/no-explicit-any */
app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  const status = err.status || 500;

  if (status === 500) {
    req.log.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  } else {
    logger.info(err);
    res.status(status).json({
      message: err.message,
      errors: err.errors,
    });
  }
});

app.listen(PORT, () => {
  logger.info(`Listening on: 0.0.0.0:${PORT}`);

  // sync db
  // db.sync()
});
