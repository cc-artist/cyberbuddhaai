import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const path = request.nextUrl.pathname

  const isAdminPath = path.startsWith('/admin')
  const isLoginPath = path === '/admin/login'
  const isAuthApiPath = path.startsWith('/api/auth')

  if (isAuthApiPath) {
    return NextResponse.next()
  }

  if (isAdminPath) {
    if (!token) {
      if (isLoginPath) {
        return NextResponse.next()
      }
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    if (isLoginPath) {
      const adminUrl = new URL('/admin', request.url)
      return NextResponse.redirect(adminUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*'
  ]
}
