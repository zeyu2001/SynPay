'use client';

import { useSession } from 'next-auth/react';
import { TopUpDialog } from '@/components/TopUpDialog';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR('/api/me', (...args) =>
    fetch(...args).then(res => res.json()),
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div>
        <div>
          <p className="mt-4 text-xl">Welcome back, {session?.user?.name}!</p>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Account Balance</h2>
          <p className="text-3xl">
            {isClient && isLoading ? (
              <Skeleton className="h-8 w-[150px] bg-gray-400" />
            ) : (
              data?.balance
            )}
          </p>
          <TopUpDialog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
