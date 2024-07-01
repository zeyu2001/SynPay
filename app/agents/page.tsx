'use client';

import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { toast, useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useEffect } from 'react';

const AgentsPage: NextPage = () => {
  return (
    <div>
      <h1>Agents</h1>
    </div>
  );
};

export default AgentsPage;
