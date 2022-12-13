"use strict";

/* eslint @typescript-eslint/no-var-requires: "off" */
const Sequelize = require("sequelize");
const config = require("../config/config");

function getConfig() {
  const env = process.env.NODE_ENV || "development";
  return config[env];
}

function getSequelize(dbConfig) {
  dbConfig = dbConfig || getConfig().db;

  return new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

function translateCommand(command, dbConfig) {
  switch (command) {
    case "user:exists":
      return `SELECT 1 FROM pg_roles WHERE rolname='${dbConfig.username}'`;
    case "user:create":
      return `CREATE USER "${dbConfig.username}" WITH CREATEDB ENCRYPTED PASSWORD '${dbConfig.password}'`;
    case "user:drop":
      return `DROP USER IF EXISTS "${dbConfig.username}"`;
    case "db:exists":
      return `SELECT 1 FROM pg_database WHERE datname='${dbConfig.database}'`;
    case "db:create":
      return `CREATE DATABASE ${dbConfig.database}`;
    case "db:drop":
      return `DROP DATABASE ${dbConfig.database}`;
    default:
      return command;
  }
}

async function execCommand(command, dbConfig) {
  const sql = translateCommand(command, dbConfig);

  const dbConfigCopy = Object.assign({}, dbConfig);

  if (command.startsWith("user:")) {
    dbConfigCopy.username = process.env.USER;
    dbConfigCopy.database = "postgres";
  }
  if (command.startsWith("db:")) {
    dbConfigCopy.database = "postgres";
  }

  const sequelize = getSequelize(dbConfigCopy);

  let result;
  try {
    [result] = await sequelize.query(sql);
    if (command.endsWith("exists")) {
      return result.length !== 0;
    } else if (command.endsWith("create") || command.endsWith("drop")) {
      return true;
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await sequelize.close();
  }

  return result;
}

async function main(sql) {
  sql = sql || process.argv[2];

  const dbConfig = getConfig().db;

  await execCommand(sql, dbConfig);
}

exports.getConfig = getConfig;
exports.getSequelize = getSequelize;
exports.execCommand = execCommand;

if (require.main === module) {
  if (process.argv.length < 3) {
    console.log("usage: node dist/db/exec <SQL>");
    process.exit(2);
  }
  main();
}
