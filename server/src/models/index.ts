import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      !file.endsWith(".test.ts")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
