import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function successResponse<T>(
  res: Response,
  statusCode: StatusCodes,
  data: T,
) {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
}
