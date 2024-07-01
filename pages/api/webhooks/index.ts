import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import DB from '@/util/db';

const db = new DB();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${(err as Error).message}`);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id);

    // Cast event data to Stripe object.
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
      const paymentIntent = charge.payment_intent as string;
      const checkoutSession = (
        await stripe.checkout.sessions.list({
          payment_intent: paymentIntent,
        })
      ).data[0];
      const userId = (await db.getCheckoutSession(checkoutSession.id))?.userId;
      if (!userId) {
        console.error(`❌ User not found for session: ${checkoutSession.id}`);
        return;
      }
      await db.updateUserBalance(userId, charge.amount / 100);
      console.log(`🔔 User ${userId} topped up ${charge.amount}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(webhookHandler as any);
