import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DB {
  async createUser(email: string, name: string) {
    return await prisma.user.create({
      data: {
        email: email,
        name: name,
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

  async updateUserBalance(userId: string, amount: number) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: amount > 0 ? { increment: amount } : { decrement: Math.abs(amount) },
      },
    });
  }

  async createCheckoutSession(checkoutSessionId: string, userId: string) {
    return await prisma.stripeCheckoutSession.create({
      data: {
        checkoutSessionId: checkoutSessionId,
        userId: userId,
      },
    });
  }

  async getCheckoutSession(checkoutSessionId: string) {
    return await prisma.stripeCheckoutSession.findUnique({
      where: {
        checkoutSessionId: checkoutSessionId,
      },
    });
  }

  async upsertAgent({
    name,
    description,
    schema,
    url,
    userId,
    balance,
    cost,
    pub,
    id,
  }: {
    name: string;
    description: string;
    schema: string;
    url: string;
    userId: string;
    balance: number;
    cost: number;
    pub: boolean;
    id?: string;
  }) {
    if (!id) {
      return await prisma.agent.create({
        data: {
          name: name,
          description: description,
          schema: schema,
          url: url,
          userId: userId,
          balance: balance,
          cost: cost,
          public: pub,
        },
      });
    } else {
      return await prisma.agent.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          description: description,
          schema: schema,
          url: url,
          userId: userId,
          balance: balance,
          cost: cost,
          public: pub,
        },
      });
    }
  }

  async getAgentByName(name: string) {
    return await prisma.agent.findUnique({
      where: {
        name: name,
      },
    });
  }

  async getAgentById(id: string) {
    return await prisma.agent.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getAllAgents() {
    return await prisma.agent.findMany();
  }
}

export default DB;
