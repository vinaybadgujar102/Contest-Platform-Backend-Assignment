import { Router } from "express";
import { schemaValidator } from "../validators";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  schemaValidator(signupSchema),
  AuthController.signUp,
);

authRouter.post("/login", schemaValidator(loginSchema), AuthController.login);

export default authRouter;
