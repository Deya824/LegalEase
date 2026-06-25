"use client";

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/analytics`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Analytics Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-bold mb-2">Total Users</p>
          <p className="text-3xl font-extrabold text-white">{stats.totalUsers}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-bold mb-2">Total Lawyers</p>
          <p className="text-3xl font-extrabold text-amber-400">{stats.totalLawyers}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-bold mb-2">Total Hires</p>
          <p className="text-3xl font-extrabold text-blue-400">{stats.totalHires}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-bold mb-2">Total Revenue</p>
          <p className="text-3xl font-extrabold text-green-400">${stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}