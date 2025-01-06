import React from 'react';
import RecentRecords from '@/components/records/RecentRecords';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <main className="flex gap-6">
          {/* 左侧信息栏，只在首页显示 */}
          {showSidebar && (
            <aside className="w-80 space-y-6">
              {/* 数据概览 */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">数据概览</h2>
                <div className="text-sm text-gray-500">
                  🚧 数据概览开发中...
                </div>
              </div>
              
              {/* 最近记录 */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">最近记录</h2>
                <RecentRecords />
              </div>
              
              {/* 分类统计 */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">分类统计</h2>
                <div className="text-sm text-gray-500">
                  🚧 分类统计开发中...
                </div>
              </div>
            </aside>
          )}

          {/* 主要内容区 */}
          <div className={showSidebar ? "flex-1" : "w-full"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 