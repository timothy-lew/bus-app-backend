import { Services } from "../services";
import { UserController } from "./user";


export type Controllers = {
  User: UserController;
};

export function initControllers(services: Services): Controllers {
  const User = new UserController(services);

  return {
    User,
  };
}
