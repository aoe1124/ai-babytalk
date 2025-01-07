import { NextResponse } from 'next/server';
import { ChatDB } from '@/lib/db';

export async function GET() {
  try {
    console.log('开始获取聊天记录');
    const messages = await ChatDB.getRecentMessages();
    console.log('获取到的聊天记录:', messages);
    return NextResponse.json(messages || []);
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    return NextResponse.json([]);
  }
} 