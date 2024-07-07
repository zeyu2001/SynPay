'use client';

import { NextPage } from 'next';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { MarketplaceAgentCard } from '@/components/MarketplaceAgentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Agent } from '@prisma/client';

const MarketplacePage: NextPage = () => {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR('/api/agents/list', (...args) =>
    fetch(...args).then(res => res.json()),
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold">Public Agents</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 my-8">
        {isLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[150px] w-[350px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
        ) : (
          data.others.map((agent: Agent) => (
            <MarketplaceAgentCard key={agent.id} agent={agent} myAgents={data.mine} />
          ))
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
