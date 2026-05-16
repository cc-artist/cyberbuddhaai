'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function AdminSecurity() {
  const { data: session } = useSession();

  useEffect(() => {
    // 页面关闭或刷新时自动登出
    const handleBeforeUnload = () => {
      // 使用 sendBeacon 确保请求在页面关闭前发出
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/auth/signout');
      }
    };

    // 页面可见性变化时的额外检查
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时可以考虑登出，但这里我们只做警告
        console.log('Admin page hidden');
      }
    };

    // 活动检测 - 如果用户一段时间没有活动就登出
    let inactivityTimer: NodeJS.Timeout;
    
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      // 15分钟无活动就登出
      inactivityTimer = setTimeout(() => {
        if (session) {
          console.log('Auto logout due to inactivity');
          signOut({ callbackUrl: '/admin/login' });
        }
      }, 15 * 60 * 1000);
    };

    // 监听用户活动
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // 初始化计时器
    if (session) {
      resetInactivityTimer();
    }

    // 添加页面关闭监听器
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // 清理
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [session]);

  return null;
}
