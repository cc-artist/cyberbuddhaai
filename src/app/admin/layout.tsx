import React from 'react';

// Set dynamic rendering for all admin routes
export const dynamic = 'force-dynamic';

// Allow dynamic parameters for admin routes
export const dynamicParams = true;

// Prevent Next.js from statically generating admin pages
export const generateStaticParams = () => [];

// Explicitly set runtime for server components
export const runtime = 'nodejs';

// Admin Layout Component for all admin routes
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  // 暂时移除认证检查，让页面可以正常预览
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
