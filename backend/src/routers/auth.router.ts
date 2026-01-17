import { Router } from "express";
import { schemaValidator } from "../validators";
import { signupSchema } from "../validators/auth.validator";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  schemaValidator(signupSchema),
  AuthController.signUp,
);

export default authRouter;
