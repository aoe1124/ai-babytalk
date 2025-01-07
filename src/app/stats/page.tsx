'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { WordRecord } from '@/lib/db';

interface Stats {
  total: number;
  categories: Record<string, number>;
  dailyStats: Record<string, number>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [words, setWords] = useState<WordRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // 获取统计数据
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // 获取词语列表
      const wordsResponse = await fetch('/api/words/list');
      const wordsData = await wordsResponse.json();
      setWords(wordsData.words);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // 删除词语
  async function handleDelete(wordId: string) {
    if (!confirm('确定要删除这个词语吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/api/words/delete?id=${wordId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // 重新获取数据以更新页面
        await fetchData();
      } else {
        const data = await response.json();
        alert(data.error || '删除失败，请重试');
      }
    } catch (error) {
      console.error('Error deleting word:', error);
      alert('删除失败，请重试');
    }
  }

  // 根据分类筛选词语
  const filteredWords = selectedCategory
    ? words.filter(word => word.category === selectedCategory)
    : words;

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 核心统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">总词汇量</h3>
            <p className="text-3xl font-bold text-blue-500">{stats?.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">今日新增</h3>
            <p className="text-3xl font-bold text-blue-500">
              {stats?.dailyStats[new Date().toISOString().split('T')[0]] || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">分类数量</h3>
            <p className="text-3xl font-bold text-blue-500">
              {stats?.categories ? Object.keys(stats.categories).length : 0}
            </p>
          </div>
        </div>

        {/* 分类统计 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">分类统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats?.categories && Object.entries(stats.categories).map(([category, count]) => (
              <div 
                key={category} 
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedCategory === category 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
              >
                <h4 className="text-sm font-medium text-gray-600 mb-1">{category}</h4>
                <p className="text-2xl font-bold text-blue-500">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 词语列表 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              词语列表
              {selectedCategory && ` - ${selectedCategory}`}
            </h2>
            <span className="text-sm text-gray-500">
              共 {filteredWords.length} 个词语
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">词语</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">记录时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备注</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWords.map((word) => (
                  <tr key={word.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{word.word}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{word.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(word.createdAt).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{word.notes || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(word.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 最近趋势 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">最近7天趋势</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">🚧 趋势图表开发中...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 