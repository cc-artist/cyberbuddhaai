'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (!data.user) {
          router.push('/admin/login');
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1D1D1F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8676B6]/30 border-t-[#8676B6] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { name: '仪表盘', href: '/admin', icon: 'fas fa-tachometer-alt' },
    { name: '咨询管理', href: '/admin/consultations', icon: 'fas fa-comments' },
    { name: '支付管理', href: '/admin/payments', icon: 'fas fa-credit-card' },
    { name: '订单管理', href: '/admin/orders', icon: 'fas fa-shopping-cart' },
    { name: '评论管理', href: '/admin/comments', icon: 'fas fa-comment-dots' },
    { name: 'API管理', href: '/admin/api-keys', icon: 'fas fa-key' },
    { name: '账单管理', href: '/admin/billing', icon: 'fas fa-file-invoice' },
  ];

  return (
    <div className="min-h-screen bg-[#1D1D1F]">
      {/* 侧边栏 */}
      <aside className={`fixed left-0 top-0 h-screen bg-[#2C2C2E] border-r border-[#48484A] transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#48484A]">
          <h1 className="text-xl font-bold text-white flex items-center">
            <i className="fas fa-dharmachakra mr-2 text-[#8676B6]"></i>
            {isSidebarOpen && '赛博佛祖管理'}
          </h1>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'bg-[#8676B6]/30 text-white'
                        : 'text-[#86868B] hover:bg-[#3A3A3C] hover:text-white'
                    }`}
                  >
                    <i className={`${item.icon} mr-3 ${isActive ? 'text-[#8676B6]' : ''}`}></i>
                    {isSidebarOpen && item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 用户信息和退出 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#48484A]">
          <div className="flex items-center px-4 py-3 rounded-lg bg-[#1D1D1F]/50">
            <div className="w-10 h-10 rounded-full bg-[#8676B6]/30 flex items-center justify-center">
              <i className="fas fa-user-circle text-[#8676B6]"></i>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-white text-sm font-medium">{user.email}</p>
                <p className="text-[#86868B] text-xs">管理员</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <Link
              href="/api/auth/signout"
              className="flex items-center px-4 py-3 mt-2 rounded-lg text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              退出登录
            </Link>
          )}
        </div>
      </aside>

      {/* 侧边栏切换按钮 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-64 top-4 z-50 bg-[#2C2C2E] hover:bg-[#3A3A3C] p-2 rounded-lg text-[#86868B] hover:text-white transition-colors hidden md:block"
        style={{ left: isSidebarOpen ? '260px' : '0' }}
      >
        <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </button>

      {/* 主内容区域 */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* 顶部栏 */}
        <header className="bg-[#2C2C2E] border-b border-[#48484A] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white">
                {navItems.find(item => pathname === item.href)?.name || '管理后台'}
              </h2>
              <span className="ml-3 px-2 py-1 bg-[#8676B6]/30 rounded-full text-xs text-[#8676B6]">
                生产环境
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#86868B] text-sm">
                {new Date().toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}