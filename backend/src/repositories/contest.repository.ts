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
}
