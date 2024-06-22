import Link from 'next/link';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="flex flex-col space-y-4">
          <Link href="/" className="text-gray-700 hover:text-blue-500">
            Dashboard
          </Link>
          <Link href="/agents" className="text-gray-700 hover:text-blue-500">
            My Agents
          </Link>
          <Link href="/marketplace" className="text-gray-700 hover:text-blue-500">
            Marketplace
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
  );
}

export default Layout;