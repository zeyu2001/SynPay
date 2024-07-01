'use client';

import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { toast, useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useEffect } from 'react';

const ResultPage: NextPage = () => {
  const sessionId = useSearchParams().get('session_id');
  const { toast } = useToast();
  const router = useRouter();

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error, isLoading } = useSWR(
    sessionId ? `/api/checkout_sessions/${sessionId}` : null,
    (...args) => fetch(...args).then(res => res.json()),
  );

  useEffect(() => {
    if (error) {
      router.push('/');
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Could not fetch your payment session.',
      });
    } else if (data && data.status === 'complete') {
      router.push('/');
      toast({
        title: 'Payment successful!',
        description: 'Your account has been topped up.',
      });
    } else if (data && data.status === 'expired') {
      router.push('/');
      toast({
        title: 'Checkout session expired.',
        description: 'Please try again.',
      });
    } else if (data && data.status === 'open') {
      router.push('/');
      toast({
        title: 'Payment incomplete.',
        description: 'Please try again.',
      });
    }
  }, [data, error, isLoading]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
};

export default ResultPage;
