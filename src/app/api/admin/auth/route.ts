import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return `admin_login_${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record) {
    rateLimitStore.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  // Reset if more than 15 minutes have passed
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    rateLimitStore.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  // Allow max 5 attempts per 15 minutes
  if (record.attempts >= 5) {
    return false
  }

  record.attempts++
  record.lastAttempt = now
  return true
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)

    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Server-side password verification
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create JWT token with 24 hour expiration
    const token = await new SignJWT({
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    // Create response
    const response = NextResponse.json(
      { message: 'Authentication successful' },
      { status: 200 }
    )

    // Set secure HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    // Reset rate limit on successful login
    rateLimitStore.delete(rateLimitKey)

    return response
  } catch (error) {
    logger.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, secret)

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Admin auth verification error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    // Clear the authentication cookie
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response
  } catch (error) {
    logger.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}