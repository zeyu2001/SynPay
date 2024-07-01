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
}

export default DB;
