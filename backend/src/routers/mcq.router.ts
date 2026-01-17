import { Router, type Request, type Response } from "express";
import { authMiddleware, verifyUserRole } from "../middlewares/auth.middleware";
import { UserRole } from "../types/UserRoles.type";
import { schemaValidator } from "../validators";
import {
  createMcqSchema,
  type CreateMcqInput,
} from "../validators/mcq.validator";
import { prisma } from "../db/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/app.error";

const mcqRouter = Router();

mcqRouter.post(
  "/",
  authMiddleware,
  verifyUserRole(UserRole.CREATOR),
  schemaValidator(createMcqSchema),
  async (req: Request, res: Response) => {
    const contestId = Number(req.params.contestId);
    const userId = req.user!.userId;
    const data = req.body as CreateMcqInput;

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new NotFoundError("CONTEST_NOT_FOUND");
    }

    if (contest.creatorId !== userId) {
      throw new ForbiddenError("NOT_CONTEST_CREATOR");
    }

    if (new Date() >= contest.startTime) {
      throw new BadRequestError("CONTEST_ALREADY_STARTED");
    }

    if (
      data.correctOptionIndex < 0 ||
      data.correctOptionIndex >= data.options.length
    ) {
      throw new BadRequestError("INVALID_CORRECT_OPTION_INDEX");
    }

    const mcq = await prisma.mcqQuestion.create({
      data: {
        contestId,
        questionText: data.questionText,
        options: data.options,
        correctOptionIndex: data.correctOptionIndex,
        points: data.points,
      },
    });

    res.status(201).json({
      success: true,
      data: mcq,
      error: null,
    });
  },
);

export default mcqRouter;
