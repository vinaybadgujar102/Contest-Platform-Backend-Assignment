import { ContestRepository } from "../repositories/contest.repository";
import type { McqRepository } from "../repositories/mcq.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/app.error";
import type { CreateMcqInput } from "../validators/mcq.validator";

export class McqService {
  mcqRepository: McqRepository;
  contestRepository: ContestRepository;

  constructor(
    mcqRepository: McqRepository,
    contestRepository: ContestRepository,
  ) {
    this.mcqRepository = mcqRepository;
    this.contestRepository = contestRepository;
  }
  async createMcq(
    contestId: number,
    creatorId: number,
    newContestData: CreateMcqInput,
  ) {
    const contest = await this.contestRepository.getContestById(contestId);

    if (!contest) {
      throw new NotFoundError("CONTEST_NOT_FOUND");
    }

    if (contest.creatorId !== creatorId) {
      throw new ForbiddenError("NOT_CONTEST_CREATOR");
    }

    if (new Date() >= contest.startTime) {
      throw new BadRequestError("CONTEST_ALREADY_STARTED");
    }

    if (
      newContestData.correctOptionIndex < 0 ||
      newContestData.correctOptionIndex >= newContestData.options.length
    ) {
      throw new BadRequestError("INVALID_CORRECT_OPTION_INDEX");
    }

    const mcq = await this.mcqRepository.createMcq({
      questionText: newContestData.questionText,
      options: newContestData.options,
      correctOptionIndex: newContestData.correctOptionIndex,
      points: newContestData.points,
    });
  }
}
