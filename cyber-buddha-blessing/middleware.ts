import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 定义需要认证的路径
const PROTECTED_PATHS = ['/admin'];
const LOGIN_PATH = '/admin/login';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 检查是否是需要保护的路径
  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) => path.startsWith(protectedPath) && path !== LOGIN_PATH
  );

  // 如果是登录路径，直接继续
  if (path === LOGIN_PATH) {
    return NextResponse.next();
  }

  // 如果是受保护路径，检查认证
  if (isProtectedPath) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        const loginUrl = new URL(LOGIN_PATH, request.url);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware authentication error:', error);
      const loginUrl = new URL(LOGIN_PATH, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
