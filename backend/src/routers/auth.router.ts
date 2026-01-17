import { Router, type Request, type Response } from "express";
import { schemaValidator } from "../validators";
import { signupSchema } from "../validators/auth.validator";
import { prisma } from "../db/prisma";
import { errorResponse, successResponse } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import type { UserRole } from "../types/UserRoles.type";

const authRouter = Router();

type SignupResponse = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

authRouter.post(
  "/signup",
  schemaValidator(signupSchema),
  async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (existingUser) {
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "EMAIL_ALREADY_EXISTS",
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      return successResponse<SignupResponse>(res, StatusCodes.CREATED, {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });
    } catch (error) {
      return errorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR",
      );
    }
  },
);

export default authRouter;
