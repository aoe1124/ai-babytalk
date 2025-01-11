import { NextResponse } from 'next/server';
import { WordsDB } from '@/lib/db';

export async function GET() {
  try {
    console.log('开始获取词语列表...');
    
    // 获取所有词语记录
    const words = await WordsDB.getRecentWords(1000); // 暂时限制1000条
    
    console.log(`成功获取词语列表，共 ${words.length} 条记录`);
    
    // 按时间倒序排列
    words.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ words });
  } catch (error) {
    console.error('获取词语列表时出错:', error);
    console.error('错误详情:', {
      message: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // 返回更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: `获取词语列表失败: ${errorMessage}` },
      { status: 500 }
    );
  }
} 