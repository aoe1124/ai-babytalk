'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  categories: Record<string, number>;
  dailyStats: Record<string, number>;
}

export default function DataOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mt-1"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mt-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <div>
        <div className="text-sm text-gray-500 mb-1">总词汇量</div>
        <div className="text-2xl font-bold text-blue-500">{stats?.total || 0}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500 mb-1">今日新增</div>
        <div className="text-2xl font-bold text-blue-500">
          {stats?.dailyStats[new Date().toISOString().split('T')[0]] || 0}
        </div>
      </div>
    </div>
  );
} 