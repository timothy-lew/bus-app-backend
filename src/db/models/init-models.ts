import type { Sequelize } from "sequelize";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
  _User as User,
};

export type {
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const User = _User.initModel(sequelize);

  return {
    User: User,
  };
}
