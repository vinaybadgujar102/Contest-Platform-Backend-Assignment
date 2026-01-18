import { Router, type Request, type Response } from "express";
import { authMiddleware, verifyUserRole } from "../middlewares/auth.middleware";
import { UserRole } from "../types/UserRoles.type";
import { ContestController } from "../controllers/contest.controller";
import { schemaValidator } from "../validators";
import {
  createDsaProblemSchema,
  type CreateDsaProblemInput,
} from "../validators/contest.validator";
import { prisma } from "../db/prisma";
import { NotFoundError } from "../utils/app.error";
import { successResponse } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";

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

contestRouter.post(
  "/:contestId/dsa",
  authMiddleware,
  verifyUserRole(UserRole.CREATOR),
  schemaValidator(createDsaProblemSchema),
  async (req: Request, res: Response) => {
    const payload = req.body as CreateDsaProblemInput;
    const contestId = Number(req.params.contestId);

    const contest = await prisma.contest.findFirst({
      where: {
        id: contestId,
      },
    });
    if (!contest) {
      throw new NotFoundError("CONTEST_NOT_FOUND");
    }
    const newContest = await prisma.dsaProblem.create({
      data: {
        title: payload.title,
        description: payload.description,
        tags: JSON.parse(payload.tags as string),
        points: payload.points,
        timeLimit: payload.timeLimit,
        memoryLimit: payload.memoryLimit,
        testCases: JSON.parse(payload.testCases.toString()),
        contestId,
      },
      select: {
        id: true,
        contestId: true,
      },
    });
    return successResponse(res, StatusCodes.CREATED, {
      id: newContest.id,
      contestId: newContest.contestId,
    });
  },
);

export default contestRouter;
