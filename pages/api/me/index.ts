import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '@/util/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/util/authOptions';
import { User } from '@prisma/client';

const db = new DB();

export default async function handler(req: NextApiRequest, res: NextApiResponse<User | null>) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401);

  if (req.method === 'GET') {
    const user = await db.getUser(session.user.email);
    return res.status(200).json(user);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
