'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: '仪表板', href: '/admin', icon: 'fa-tachometer-alt' },
  { name: '评论管理', href: '/admin/comments', icon: 'fa-comments' },
  { name: '支付管理', href: '/admin/payments', icon: 'fa-credit-card' },
  { name: '订单管理', href: '/admin/orders', icon: 'fa-file-invoice-dollar' },
  { name: '咨询管理', href: '/admin/consultations', icon: 'fa-headset' },
  { name: 'API密钥', href: '/admin/api-keys', icon: 'fa-key' },
];

const AdminClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#1D1D1F] text-[#F5F5F7] flex">
      {/* 侧边栏 */}
      <aside 
        className={`bg-[#2C2C2E] border-r border-[#48484A] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* 侧边栏头部 */}
        <div className="p-4 border-b border-[#48484A] flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-white">赛博佛祖后台</h1>
          ) : (
            <i className="fas fa-buddha text-2xl text-[#8676B6]"></i>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#86868B] hover:text-white"
          >
            <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#8676B6]/20 text-[#8676B6] border border-[#8676B6]/30' 
                    : 'text-[#86868B] hover:bg-[#3A3A3C] hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} text-lg`}></i>
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 底部 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#48484A]">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#86868B] hover:bg-[#3A3A3C] hover:text-white transition-colors"
          >
            <i className="fas fa-home text-lg"></i>
            {sidebarOpen && <span className="font-medium">返回首页</span>}
          </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-[#2C2C2E] border-b border-[#48484A] sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-white">
                {navItems.find(item => item.href === pathname)?.name || '管理后台'}
              </h2>
              <span className="ml-3 text-sm text-[#86868B] hidden sm:inline">Production Environment</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#86868B]">
                <i className="fas fa-user-circle mr-2"></i>
                管理员
              </span>
              <Link
                href="/api/auth/signout"
                className="bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                退出
              </Link>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* 页脚 */}
        <footer className="text-center text-[#86868B] text-sm py-4 border-t border-[#48484A]">
          <p>&copy; 2026 赛博佛祖在线加持服务</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminClientLayout;