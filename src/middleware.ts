import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { logger } from './lib/logger'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow main admin page to be accessed (for deception page)
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next()
    }

    // Protect all other admin routes
    try {
      const token = request.cookies.get('admin-token')?.value

      if (!token) {
        // Redirect to login with auth parameter
        const loginUrl = new URL('/admin', request.url)
        loginUrl.searchParams.set('auth', 'true')
        return NextResponse.redirect(loginUrl)
      }

      // Verify JWT token
      const { payload } = await jwtVerify(token, secret)

      if (payload.role !== 'admin') {
        // Invalid token, redirect to login
        const loginUrl = new URL('/admin', request.url)
        loginUrl.searchParams.set('auth', 'true')
        return NextResponse.redirect(loginUrl)
      }

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      logger.error('Admin middleware error', error)
      // Token verification failed, redirect to login
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('auth', 'true')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}