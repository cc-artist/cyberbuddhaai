import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// 导出NextAuth处理函数
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };