'use client';

import { useEffect, useState } from 'react';

interface Stats {
  categories: Record<string, number>;
}

// 所有可能的分类
const ALL_CATEGORIES = [
  "动物", "食物", "动作", "物品", "交通",
  "情感", "人物", "日常用语", "其他"
];

export default function CategoryStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats({ categories: data.categories });
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
      <div className="animate-pulse flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 rounded-full w-16"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map(category => {
        const count = stats?.categories[category] || 0;
        return (
          <div 
            key={category} 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
              count > 0
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {category}
            <span className={`ml-1.5 ${count > 0 ? 'text-blue-500' : 'text-gray-400'}`}>
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
} 