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

export class ForbiddenError extends AppError {
  statusCode: number;
  errorCode: string;

  constructor(errorCode: string) {
    super();
    this.statusCode = StatusCodes.FORBIDDEN;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  override statusCode: number;
  override errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
    this.statusCode = StatusCodes.NOT_FOUND;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
