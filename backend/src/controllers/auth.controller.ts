import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import type { LoginSchema, SignupInput } from "../validators/auth.validator";
import { successResponse } from "../utils/response.utils";
import type { UserRoleType } from "../types/UserRoles.type";
import { StatusCodes } from "http-status-codes";

type SignupResponse = {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
};

type LoginResponse = {
  token: string;
};

const authService = new AuthService(new UserRepository());

export const AuthController = {
  async signUp(req: Request, res: Response) {
    const data = req.body as SignupInput;
    const newUser = await authService.signup(data);
    return successResponse<SignupResponse>(res, StatusCodes.CREATED, {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });
  },

  async login(req: Request, res: Response) {
    const data = req.body as LoginSchema;
    const token = await authService.login(data.email, data.password);
    return successResponse<LoginResponse>(res, StatusCodes.OK, {
      token,
    });
  },
};
