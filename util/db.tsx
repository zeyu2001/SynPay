import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DB {
  async createUser(email: string) {
    return await prisma.user.create({
      data: {
        email: email,
      },
    });
  }

  async getUser(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
