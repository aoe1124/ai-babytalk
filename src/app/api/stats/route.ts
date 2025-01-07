import { NextResponse } from 'next/server';
import { WordsDB } from '@/lib/db';

export async function GET() {
  try {
    // 获取分类统计
    const categoryStats = await WordsDB.getCategoryStats();
    
    // 计算总词汇量
    const totalWords = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);
    
    // 获取最近7天的每日新增词汇量
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentWords = await WordsDB.getRecentWords(1000); // 获取足够多的记录以确保覆盖7天
    
    // 按日期分组统计
    const dailyStats = recentWords
      .filter(word => word.createdAt >= sevenDaysAgo)
      .reduce((acc, word) => {
        const date = new Date(word.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      total: totalWords,
      categories: categoryStats,
      dailyStats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 