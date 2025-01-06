'use client';

import React, { useEffect, useState } from 'react';
import { WordRecord } from '@/lib/db';

export default function RecentRecords() {
  const [records, setRecords] = useState<WordRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecords() {
    try {
      const response = await fetch('/api/words/recent');
      if (!response.ok) throw new Error('获取记录失败');
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
    // 每30秒刷新一次
    const interval = setInterval(fetchRecords, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    try {
      const response = await fetch(`/api/words/delete?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('删除失败');
      
      // 重新获取记录
      fetchRecords();
    } catch (err) {
      alert('删除失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        获取记录失败: {error}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        还没有记录任何词语...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="border-b pb-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-medium">{record.word}</span>
              <span className="ml-2 text-sm text-gray-500">[{record.category}]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {new Date(record.createdAt).toLocaleString('zh-CN', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <button
                onClick={() => handleDelete(record.id)}
                className="text-xs text-red-400 hover:text-red-500"
                title="删除记录"
              >
                ×
              </button>
            </div>
          </div>
          {record.context && (
            <div className="text-sm text-gray-600 mt-1">
              场景：{record.context}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 