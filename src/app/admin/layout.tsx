import React from 'react';

// Admin Layout Component for all admin routes
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

// Set dynamic rendering for all admin routes
export const dynamic = 'force-dynamic';

// Allow dynamic parameters for admin routes
export const dynamicParams = true;

// Prevent Next.js from statically generating admin pages
export const generateStaticParams = () => [];

// Explicitly set runtime for server components
export const runtime = 'nodejs';

export default AdminLayout;
