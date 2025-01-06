import { NextResponse } from 'next/server';
import { WordsDB } from '@/lib/db';

export async function GET() {
  try {
    const records = await WordsDB.getRecentWords(5); // 获取最近5条记录
    return NextResponse.json(records);
  } catch (error) {
    console.error('获取最近记录失败:', error);
    return NextResponse.json(
      { error: '获取记录失败' },
      { status: 500 }
    );
  }
} 