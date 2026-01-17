import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import type { SignupInput } from "../validators/auth.validator";
import { errorResponse, successResponse } from "../utils/response.utils";
import type { UserRoleType } from "../types/UserRoles.type";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../utils/app.error";

type SignupResponse = {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
};

const authService = new AuthService(new UserRepository());

export const AuthController = {
  async signUp(req: Request, res: Response) {
    try {
      const data = req.body as SignupInput;
      const newUser = await authService.signup(data);
      return successResponse<SignupResponse>(res, StatusCodes.CREATED, {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });
    } catch (error) {
      if (error instanceof BadRequestError)
        return errorResponse(res, error.statusCode, error.name);
    }
  },
};
