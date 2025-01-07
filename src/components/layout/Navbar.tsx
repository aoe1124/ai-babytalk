'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../icons/Logo';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <Logo />
            <span className="ml-2 text-2xl font-bold text-blue-500 group-hover:opacity-80 transition-opacity">
              宝宝说
            </span>
            <span className="ml-2 text-sm text-gray-400">AI育儿助手</span>
          </Link>
          <div className="flex space-x-2">
            <Link 
              href="/" 
              className={`px-5 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              首页
            </Link>
            <Link 
              href="/stats" 
              className={`px-5 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/stats') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              统计
            </Link>
            <Link 
              href="/graph" 
              className={`px-5 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/graph') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              图谱
            </Link>
            <Link 
              href="/settings" 
              className={`px-5 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/settings') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              设置
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 