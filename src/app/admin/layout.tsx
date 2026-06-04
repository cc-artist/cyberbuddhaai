// Server-side dynamic configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import AdminClientLayout from './AdminClientLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}