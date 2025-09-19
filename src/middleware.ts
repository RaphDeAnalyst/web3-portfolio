import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { logger } from './lib/logger'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Define canonical domain (without www)
  const CANONICAL_DOMAIN = 'matthewraphael.xyz'

  // 1. CANONICAL URL HANDLING (before admin protection)

  // Check if request is coming from www subdomain
  if (hostname.startsWith('www.')) {
    // Redirect www.matthewraphael.xyz to matthewraphael.xyz
    url.hostname = CANONICAL_DOMAIN
    return NextResponse.redirect(url, 301)
  }

  // Ensure HTTPS in production
  if (process.env.NODE_ENV === 'production' && url.protocol === 'http:') {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  // Handle trailing slash normalization (remove trailing slashes except for root)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  // Normalize common duplicate URL patterns
  const pathname = url.pathname.toLowerCase()

  // Redirect uppercase paths to lowercase
  if (url.pathname !== pathname) {
    url.pathname = pathname
    return NextResponse.redirect(url, 301)
  }

  // Remove common query parameters that don't affect content (except for admin routes)
  if (!url.pathname.startsWith('/admin')) {
    const unnecessaryParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']
    let paramsChanged = false
    unnecessaryParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param)
        paramsChanged = true
      }
    })

    // If search params were modified, redirect to clean URL
    if (paramsChanged) {
      return NextResponse.redirect(url, 301)
    }
  }

  // 2. ADMIN ROUTE PROTECTION (after canonical handling)

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
  // Match all paths except static files, API routes, and internal Next.js paths
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - manifest files
     * - static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm|ogg|mp3|wav|flac|aac|opus|pdf)).*)',
  ],
}