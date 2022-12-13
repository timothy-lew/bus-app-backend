import type { Services } from "../services";

export abstract class BaseController {
  protected services: Services;

  constructor(services: Services) {
    this.services = services;
  }
}
