import { NextResponse } from 'next/server';
import { WordsDB } from '@/lib/db';

export async function GET() {
  try {
    // 获取所有词语记录
    const words = await WordsDB.getRecentWords(1000); // 暂时限制1000条
    
    // 按时间倒序排列
    words.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Error fetching words list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words list' },
      { status: 500 }
    );
  }
} 