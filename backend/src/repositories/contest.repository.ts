import { prisma } from "../db/prisma";

type ContestPersistanceInput = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  creatorId: number;
};

export class ContestRepository {
  async createContest(data: ContestPersistanceInput) {
    return await prisma.contest.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        creatorId: data.creatorId,
      },
    });
  }

  async getContestByIdWithProblems(contestId: number) {
    const contest = await prisma.contest.findFirst({
      where: {
        id: contestId,
      },
      include: {
        mcqQuestions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            points: true,
            correctOptionIndex: true,
          },
        },
        dsaProblems: {
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
            points: true,
            timeLimit: true,
            memoryLimit: true,
          },
        },
      },
    });
    return contest;
  }
}
