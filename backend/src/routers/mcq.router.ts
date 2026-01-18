import { Router, type Request, type Response } from "express";
import { authMiddleware, verifyUserRole } from "../middlewares/auth.middleware";
import { UserRole } from "../types/UserRoles.type";
import { schemaValidator } from "../validators";
import {
  createMcqSchema,
  type CreateMcqInput,
  type submitMcqInput,
} from "../validators/mcq.validator";
import { prisma } from "../db/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/app.error";
import { successResponse } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";

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

mcqRouter.post(
  "/:questionId/submit",
  authMiddleware,
  verifyUserRole(UserRole.CONTESTEE),
  async (req: Request, res: Response) => {
    const payload = req.body as submitMcqInput;
    const { userId: contesteeId } = req.user!;
    const questionId = Number(req.params.questionId!);
    const constestId = Number(req.params.constestId!);

    const contest = await prisma.contest.findFirst({
      where: {
        id: constestId,
      },
    });

    const question = await prisma.mcqQuestion.findFirst({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      throw new NotFoundError("QUESTION_NOT_FOUND");
    }

    if (!contest) {
      throw new NotFoundError("QUESTION_NOT_FOUND");
    }

    if (contest.startTime >= new Date()) {
      throw new BadRequestError("CONTEST_NOT_ACTIVE");
    }

    const existingSubmission = await prisma.mcqSubmission.findFirst({
      where: {
        questionId,
        userId: contesteeId,
      },
    });

    if (existingSubmission) {
      throw new BadRequestError("ALREADY_SUBMITTED");
    }

    const newSubmission = await prisma.mcqSubmission.create({
      data: {
        isCorrect: payload.selectedOptionIndex === question.correctOptionIndex,
        selectedOptionIndex: payload.selectedOptionIndex,
        userId: contesteeId,
        questionId,
        pointsEarned: question.points,
      },
      select: {
        isCorrect: true,
        pointsEarned: true,
      },
    });

    return successResponse(res, StatusCodes.CREATED, {
      isCorrect: newSubmission.isCorrect,
      pointsEarned: newSubmission.pointsEarned,
    });
  },
);

export default mcqRouter;
