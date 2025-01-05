'use client';

import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // 添加用户消息
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // 发送API请求
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('API请求失败');

      const data = await response.json();
      // 添加AI回复
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送消息失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="输入消息..."
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-300"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`rounded-full px-6 py-2 transition-colors ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="text-sm px-3 py-1 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors">
            记录新进步
          </button>
          <button className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors">
            遇到哭闹
          </button>
        </div>
      </div>
    </div>
  );
} 