import { Router } from "express";
import { authMiddleware, verifyUserRole } from "../middlewares/auth.middleware";
import { UserRole } from "../types/UserRoles.type";
import { ContestController } from "../controllers/contest.controller";

const contestRouter = Router();

contestRouter.post(
  "/",
  authMiddleware,
  verifyUserRole(UserRole.CREATOR),
  ContestController.createContest,
);

contestRouter.get(
  "/:contestId",
  authMiddleware,
  ContestController.getContestById,
);

export default contestRouter;
