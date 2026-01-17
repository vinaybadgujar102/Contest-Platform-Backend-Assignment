import { StatusCodes } from "http-status-codes";

export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract errorCode: string;

  constructor() {
    super();
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class BadRequestError extends AppError {
  statusCode: number;
  errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
    this.statusCode = StatusCodes.BAD_REQUEST;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnAuthorizedError extends AppError {
  statusCode: number;
  errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
    this.statusCode = StatusCodes.BAD_REQUEST;
    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }
}
