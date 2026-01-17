import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { verifyToken, type AuthPayload } from "../utils/jwt.utils";
import { UserRole } from "../types/UserRoles.type";
import { ForbiddenError } from "../utils/app.error";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      errorResponse(res, StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
      return;
    }
    const token = header.split("_")[1]!;
    const decodedToken = verifyToken(token.toString());
    req.user = decodedToken;
    next();
  } catch {
    return errorResponse(res, StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
  }
};

export function verifyUserRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (userRole === role) {
      next();
    } else {
      throw new ForbiddenError("FORBIDDEN");
    }
  };
}
