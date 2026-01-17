import type { ContestRepository } from "../repositories/contest.repository";
import { UserRole, type UserRoleType } from "../types/UserRoles.type";
import { NotFoundError } from "../utils/app.error";
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

  async getContestByIdWithProblems(contestId: number, role: UserRoleType) {
    const contest =
      await this.contestRepository.getContestByIdWithProblems(contestId);
    if (!contest) {
      throw new NotFoundError("CONTEST_NOT_FOUND");
    }

    const mcqs =
      role === UserRole.CREATOR
        ? contest.mcqQuestions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options?.toString().split(",")!,
            points: q.points,
            correctOptionIndex: q.correctOptionIndex,
          }))
        : contest.mcqQuestions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options?.toString().split(",")!,
            points: q.points,
          }));

    return {
      id: contest.id,
      title: contest.title,
      description: contest.description,
      startTime: contest.startTime.toISOString(),
      endTime: contest.endTime.toISOString(),
      creatorId: contest.creatorId,
      mcqs,
      dsaProblems: contest.dsaProblems.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tags: p.tags?.toString().split(",")!,
        points: p.points,
        timeLimit: p.timeLimit,
        memoryLimit: p.memoryLimit,
      })),
    };
  }
}
