import type { NextApiRequest, NextApiResponse } from 'next';
import { formatAmountForStripe } from '@/util/stripeHelpers';
import Stripe from 'stripe';
import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from '@/config';
import DB from '@/util/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/util/authOptions';

const db = new DB();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
});

type ResponseData = {
  message: string;
  checkoutSession?: Stripe.Checkout.Session;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'POST') {
    const amount = req.body.amount;
    if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
      res.status(400).json({ message: `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}.` });
      return;
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'Top-up',
            },
            unit_amount: formatAmountForStripe(amount, CURRENCY),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
    const user = await db.getUser(session.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await db.createCheckoutSession(checkoutSession.id, user.id);
    res.status(200).json({ message: 'Success', checkoutSession });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
