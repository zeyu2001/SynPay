import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MIN_AMOUNT, MAX_AMOUNT, AMOUNT_STEP } from '@/config';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import getStripe from '@/util/getStripejs';

export function TopUpDialog() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    amount: MIN_AMOUNT,
  });

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setLoading(true);

    const response = await axios
      .post('/api/checkout_sessions', {
        amount: input.amount,
      })
      .then(async res => {
        // Redirect to Checkout.
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: res.data.checkoutSession.id,
        });
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        toast({
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: err.response.data.message,
        });
        setLoading(false);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Top Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Top up balance</DialogTitle>
          <DialogDescription>
            Top up your account balance to allow your agents to pay for services. Use any of the{' '}
            <a
              href="https://stripe.com/docs/testing#cards"
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe test cards
            </a>{' '}
            for this demo, e.g. 4242 4242 4242 4242.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={AMOUNT_STEP}
              required
              className="col-span-3"
              value={input.amount}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
