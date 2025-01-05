import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">宝宝说</h1>
          <p className="text-gray-600">智能育儿助手</p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            {children}
          </div>
          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-3">发展进度</h2>
              <div className="text-sm text-gray-500 italic">
                🚧 进度追踪功能开发中...
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-3">历史记录</h2>
              <div className="text-sm text-gray-500 italic">
                🚧 历史记录功能开发中...
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
} 