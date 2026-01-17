import type { Request, Response } from "express";
import type { CreateContestInput } from "../validators/contest.validator";
import { ContestService } from "../services/contest.service";
import { ContestRepository } from "../repositories/contest.repository";
import { successResponse } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";

type CreateResponse = {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  startTime: string;
  endTime: string;
};

type GetContestByIdWithProblemType = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  creatorId: number;
  mcqs: {
    id: number;
    questionText: string;
    options: string[];
    points: number;
  }[];
  dsaProblems: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    points: number;
    timeLimit: number;
    memoryLimit: number;
  }[];
};

const contestService = new ContestService(new ContestRepository());

export const ContestController = {
  async createContest(req: Request, res: Response) {
    const { userId } = req.user!;
    const data = req.body as CreateContestInput;
    const { id, title, description, startTime, endTime, creatorId } =
      await contestService.createContest(data, userId);
    successResponse<CreateResponse>(res, StatusCodes.OK, {
      id,
      title,
      description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      creatorId,
    });
  },

  async getContestById(req: Request, res: Response) {
    const contestId = Number(req.params.contestId);
    const userRole = req.user!.role;

    const contest = await contestService.getContestByIdWithProblems(
      contestId,
      userRole,
    );

    successResponse<GetContestByIdWithProblemType>(
      res,
      StatusCodes.OK,
      contest,
    );
  },
};
