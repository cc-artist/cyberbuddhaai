'use client';

import { SessionProvider } from 'next-auth/react';
import AdminSecurity from './AdminSecurity';

export default function AdminClientWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminSecurity />
      {children}
    </SessionProvider>
  );
}
