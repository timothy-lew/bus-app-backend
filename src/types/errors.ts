export class EmailAlreadyExists extends Error {
  status = 409;
  errors: [{ errorCode: string; message: string }];

  constructor(resourceName: string) {
    super(`${resourceName} already exists`);
    this.errors = [
      {
        errorCode: `conflict.${resourceName.toLowerCase()}.already.exists`,
        message: this.message,
      },
    ];
  }
}

export class NotFound extends Error {
  status = 404;
  errors: [{ errorCode: string; message: string }];

  constructor(resourceName: string) {
    super(`${resourceName} is not found`);
    this.errors = [
      {
        errorCode: `notfound.${resourceName.toLowerCase()}`,
        message: this.message,
      },
    ];
  }
}

export class InvalidCredential extends Error {
  status = 400;
  errors = [{ errorCode: "invalid.credential", message: this.message }];

  constructor() {
    super(`Credential is invalid`);
  }
}

export class InvalidRequest extends Error {
  status = 400;
  errors = [{ errorCode: "invalid.parameters", message: this.message }];

  constructor() {
    super(`Parameters are invalid`);
  }
}

export class InvalidToken extends Error {
  status = 401;
  errors = [{ errorCode: "invalid.token", message: this.message }];

  constructor() {
    super(`Token is invalid`);
  }
}