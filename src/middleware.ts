import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow login page to be accessed
    if (request.nextUrl.pathname === '/admin' && request.nextUrl.searchParams.get('auth') === 'true') {
      return NextResponse.next()
    }

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
      console.error('Admin middleware error:', error)
      // Token verification failed, redirect to login
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('auth', 'true')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}