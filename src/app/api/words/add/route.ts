import { NextRequest, NextResponse } from 'next/server';
import { WordsDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.word || !data.category) {
      return NextResponse.json(
        { error: '词语和分类是必填项' },
        { status: 400 }
      );
    }

    const word = await WordsDB.addWord({
      word: data.word,
      category: data.category,
      context: data.context,
      pronunciation: data.pronunciation,
      notes: data.notes,
      relatedWords: data.relatedWords,
      isPartOfSentence: data.isPartOfSentence,
    });

    return NextResponse.json({ word });
  } catch (error) {
    console.error('Error adding word:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: `添加词语失败: ${errorMessage}` },
      { status: 500 }
    );
  }
} 