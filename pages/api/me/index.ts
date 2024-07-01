import type { NextApiRequest, NextApiResponse } from 'next';
import { formatAmountForStripe } from '@/util/stripeHelpers';
import Stripe from 'stripe';
import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from '@/config';
import DB from '@/util/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/util/authOptions';

const db = new DB();

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'GET') {
    const user = await db.getUser(session.user.email);
    return res.status(200).json(user);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
