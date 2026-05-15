import React from 'react';
import { redirect } from 'next/navigation';
import { getAppSession } from '../../lib/auth';

// Set dynamic rendering for all admin routes
export const dynamic = 'force-dynamic';

// Allow dynamic parameters for admin routes
export const dynamicParams = true;

// Prevent Next.js from statically generating admin pages
export const generateStaticParams = () => [];

// Explicitly set runtime for server components
export const runtime = 'nodejs';

// Admin Layout Component for all admin routes
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  // 在layout级别进行认证检查，保护所有admin子路由
  const session = await getAppSession();
  
  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
