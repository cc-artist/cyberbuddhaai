import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// 导出NextAuth处理函数
const handler = NextAuth(authOptions);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export { handler as GET, handler as POST };