import { StatusCodes } from "http-status-codes";

export interface AppError extends Error {
  statusCode: number;
}

export class BadRequestError implements AppError {
  statusCode: number;
  name: string;
  message: string;

  constructor(name: string) {
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = name;
    this.message = "BAD_REQUEST";
  }
}
