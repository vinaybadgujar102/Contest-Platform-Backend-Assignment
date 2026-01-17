import type { ContestRepository } from "../repositories/contest.repository";
import type { CreateContestInput } from "../validators/contest.validator";

export class ContestService {
  contestRepository: ContestRepository;

  constructor(contestRepository: ContestRepository) {
    this.contestRepository = contestRepository;
  }

  async createContest(contestData: CreateContestInput, creatorId: number) {
    const newContest = await this.contestRepository.createContest({
      ...contestData,
      creatorId,
    });
    return newContest;
  }
}
