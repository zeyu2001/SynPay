'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import GoogleSignInButton from './GoogleSignInButton';
import { FaTachometerAlt, FaUserFriends, FaStore, FaTasks } from 'react-icons/fa';

export interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const LayoutWithSession = ({ children, session }: Readonly<AuthProviderProps>) => {
  return (
    <SessionProvider session={session}>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return (
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-100 p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center text-gray-700 hover:text-blue-500">
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
            <Link href="/agents" className="flex items-center text-gray-700 hover:text-blue-500">
              <FaUserFriends className="mr-2" /> My Agents
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center text-gray-700 hover:text-blue-500"
            >
              <FaStore className="mr-2" /> Marketplace
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8 bg-white">{children}</main>
      </div>
    );
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Sign In</h1>
        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default LayoutWithSession;
