import { prisma } from "../db/prisma";
import type { UserRoleType } from "../types/UserRoles.type";

type UserPersistenceInput = {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
};

export class UserRepository {
  async getUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async createUser(data: UserPersistenceInput) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        name: data.name,
      },
    });
  }
}
