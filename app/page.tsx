"use client";

import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();

  const handleTopUp = async () => {};

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div>
        <div>
          <p className="mt-4 text-xl">Welcome back, {session?.user?.name}!</p>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-lg font-semibold">Account Balance</h2>
          <p className="text-2xl">${100}</p>
          <button
            onClick={handleTopUp}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Top Up Balance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
