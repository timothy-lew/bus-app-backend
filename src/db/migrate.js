/* eslint @typescript-eslint/no-var-requires: "off" */
const { Umzug, SequelizeStorage } = require("umzug");
const fs = require("fs");
const { getSequelize } = require("./exec");
const { generator } = require("./template");

function getMigrator(sequelize, folder) {
  return new Umzug({
    migrations: {
      glob: [`${folder}/*.{js,ts,up.sql}`, { cwd: __dirname }],
      resolve: (params) => {
        if (!params.path.endsWith(".sql")) {
          return Umzug.defaultResolver(params);
        }
        const { context: _sequelize } = params;
        return {
          name: params.name,
          up: async () => {
            const sql = fs.readFileSync(params.path).toString();
            return _sequelize.query(sql);
          },
          down: async () => {
            const sql = fs
              .readFileSync(params.path.replace(".up.sql", ".down.sql"))
              .toString();
            return _sequelize.query(sql);
          },
        };
      },
    },
    context: sequelize,
    storage: new SequelizeStorage({
      sequelize,
    }),
    logger: console,
    create: {
      template: generator,
    },
  });
}

exports.getMigrator = getMigrator;

if (require.main === module) {
  const sequelize = getSequelize();
  //sequelize.options.logging = false;

  getMigrator(sequelize, "migrations")
    .runAsCLI()
    .finally(() => {
      sequelize.close();
    });
}
