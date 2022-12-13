import assert from "assert";
import { Sequelize, Options } from "sequelize";
import { getConfig } from "../config";

export type SqlzOptions = Options;

export function getSequelize(dbConfig: SqlzOptions) {
  dbConfig = dbConfig || getConfig().db;

  assert(dbConfig.database);
  assert(dbConfig.username);
  assert(dbConfig.password);

  return new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}