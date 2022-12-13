/* eslint @typescript-eslint/no-var-requires: "off" */

// templates for migration file creation

const js = `
"use strict";

/* eslint @typescript-eslint/no-var-requires: "off" */
const { DataTypes } = require("sequelize");

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { options, queryInterface } }) => {
  await queryInterface.bulkInsert('tableName', [], {})
};
/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { options, queryInterface } }) => {
  await queryInterface.bulkDelete('tableName', null, {})
};
`.trimStart();

const ts = `
import { MigrationFn } from 'umzug';
export const up: MigrationFn = params => {};
export const down: MigrationFn = params => {};
`.trimStart();

const mjs = `
/** @type {import('umzug').MigrationFn<any>} */
export const up = async params => {};
/** @type {import('umzug').MigrationFn<any>} */
export const down = async params => {};
`.trimStart();

const sqlUp = `
-- up migration
`.trimStart();

const sqlDown = `
-- down migration
`.trimStart();

const path = require("path");

exports.generator = (filepath) => {
  const ext = path.extname(filepath);
  const dirname = path.dirname(filepath);
  const filename = path.parse(filepath).name;
  const sqlUpFilepath = path.join(dirname, `${filename}.up${ext}`);
  const sqlDownFilepath = path.join(dirname, `${filename}.down${ext}`);
  switch (ext) {
    case ".js":
    case ".cjs":
      return [[filepath, js]];
    case ".ts":
      return [[filepath, ts]];
    case ".mjs":
      return [[filepath, mjs]];
    case ".sql":
      return [
        [sqlUpFilepath, sqlUp],
        [sqlDownFilepath, sqlDown],
      ];
    default:
      return [];
  }
};
