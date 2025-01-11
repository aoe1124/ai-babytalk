'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WordGraph from '@/components/graph/WordGraph';

interface WordNode {
  id: string;
  word: string;
  category: string;
  value: number;
  children?: WordNode[];
}

interface WordData {
  id: string;
  word: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  context?: string;
  pronunciation?: string;
  notes?: string;
  relatedWords?: string[];
  isPartOfSentence?: boolean;
}

export default function GraphPage() {
  const [graphData, setGraphData] = useState<WordNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取所有词语数据
        const response = await fetch('/api/words/list');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || '获取数据失败');
        }

        console.log('API返回数据:', data); // 添加日志
        const words = data.words || [];

        if (!Array.isArray(words)) {
          throw new Error('返回的数据格式不正确');
        }

        // 转换数据为图谱格式
        const categories: { [key: string]: WordNode[] } = {};
        
        // 按分类组织词语
        words.forEach((word: WordData) => {
          const category = word.category || '未分类';
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push({
            id: word.id,
            word: word.word,
            category,
            value: 1
          });
        });

        // 构建图谱数据结构
        const graphData: WordNode = {
          id: 'root',
          word: '词语图谱',
          category: 'root',
          value: words.length,
          children: Object.entries(categories).map(([category, words]) => ({
            id: category,
            word: category,
            category: 'category',
            value: words.length,
            children: words
          }))
        };

        setGraphData(graphData);
        setLoading(false);
      } catch (err) {
        console.error('数据加载错误:', err);
        setError(err instanceof Error ? err.message : '未知错误');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">词语图谱</h1>
          <div className="text-sm text-gray-500">
            {loading ? '加载中...' : 
             error ? error : 
             graphData ? `共 ${graphData.value} 个词语` : ''}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[600px] text-red-500">
            <div>
              <p className="mb-2">加载失败</p>
              <p className="text-sm opacity-75">{error}</p>
            </div>
          </div>
        ) : graphData ? (
          <WordGraph data={graphData} />
        ) : null}
      </div>
    </MainLayout>
  );
} 