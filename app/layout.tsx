import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutWithSession from '@/components/Layout';
import { getServerSession } from 'next-auth';
import authOptions from '@/util/authOptions';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SynPay | Payment Infrastructure for the Agentic Economy',
  description: 'SynPay is building the financial stack for the agentic economy.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWithSession session={session}>{children}</LayoutWithSession>
        <Toaster />
      </body>
    </html>
  );
}
