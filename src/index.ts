"use strict";

import express, { Request, Response, NextFunction } from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import cors from "cors";
import { Sequelize, Options as SqlzOptions } from "sequelize";
import router from "./routes";
import { Models, initModels } from "./db/models";
import { initControllers } from "./controllers";
import { initServices, Services } from "./services";
import { getConfig } from "./config";

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
    paths: ["req.headers.authorization"],
  },
});

// add logger
app.use(
  pinoHttp({
    logger: logger,
  })
);

const db = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db as SqlzOptions
);

// initialize models, services and controllers.
const models: Models = initModels(db);
const services: Services = initServices(models, logger, db, config);
const controllers = initControllers(services);

// add body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// add main router
const authRouter = router(controllers);
authRouter.get("/ping", (_req, res) => {
  db.query(`SELECT now()`)
    .then(() => {
      res.status(200).send("pong");
    })
    .catch((err) => {
      logger.error(err);
      res.sendStatus(500);
    });
});
app.use(config.api.prefix, authRouter);

/* eslint-disable @typescript-eslint/no-explicit-any */
app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  const status = err.status || 500;

  if (status === 500) {
    req.log.error(err);
    res.status(500).json({
      message: "Internal Server Error",
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
