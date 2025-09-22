'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { logger } from '@/lib/logger'

// Extend window interface for admin key sequence
declare global {
  interface Window {
    adminKeySequence?: string
  }
}

// Lazy load AdminDock for better performance
const AdminDock = dynamic(() => import('@/components/ui/admin-dock'), {
  loading: () => <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-96 h-16 bg-card rounded-full animate-pulse" />,
  ssr: false
})

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [showAdminAccess, setShowAdminAccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(data.authenticated)
          logger.info('Authentication check result', { authenticated: data.authenticated })
        } else {
          setIsAuthenticated(false)
          logger.warn('Authentication check failed, setting to false')
        }
      } catch (error) {
        logger.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  // Helper function to trigger admin access with feedback
  const triggerAdminAccess = useCallback(() => {
    setShowAdminAccess(true)
    setTimeout(() => {
      router.push('/admin?auth=true')
    }, 1500) // Show message for 1.5 seconds
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        setShowAuthForm(false)
        setPassword('')
        // Redirect to admin dashboard
        router.push('/admin')
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (error) {
      logger.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
    } catch (error) {
      logger.error('Logout error:', error)
    }

    setIsAuthenticated(false)
    setShowAuthForm(false)
    router.push('/')
  }

  // Handle authentication form display
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const shouldShowAuth = searchParams?.get('auth') === 'true'
      setShowAuthForm(shouldShowAuth)
      logger.info('Auth form visibility check', { shouldShow: shouldShowAuth, authParam: searchParams?.get('auth') })
    }
  }, [isLoading, isAuthenticated, searchParams])

  // Secret access methods
  useEffect(() => {
    if (!isAuthenticated && !showAuthForm) {
      let tapResetTimer: NodeJS.Timeout

      const handleTap = (event: MouseEvent | TouchEvent) => {
        // Don't count taps on buttons or links
        const target = event.target as HTMLElement
        if (target.closest('button') || target.closest('a')) {
          return
        }

        // Clear existing timer
        clearTimeout(tapResetTimer)

        setTapCount(prev => {
          const newCount = prev + 1
          logger.info('Admin access tap sequence', { tapCount: newCount, required: 3 })

          // Redirect to admin after 3 taps with auth trigger
          if (newCount >= 3) {
            logger.info('Triggering admin access after tap sequence')
            triggerAdminAccess()
            return 0
          }

          // Set new reset timer
          tapResetTimer = setTimeout(() => {
            logger.info('Resetting admin tap count after timeout')
            setTapCount(0)
          }, 3000)

          return newCount
        })
      }

      const handleKeyboard = (event: KeyboardEvent) => {
        // Ctrl+Shift+L shortcut
        if (event.ctrlKey && event.shiftKey && event.key === 'L') {
          event.preventDefault()
          triggerAdminAccess()
          return
        }

        // Type "ADMIN" sequence
        const sequence = 'ADMIN'
        if (!window.adminKeySequence) window.adminKeySequence = ''

        window.adminKeySequence += event.key.toUpperCase()

        if (window.adminKeySequence.includes(sequence)) {
          triggerAdminAccess()
          window.adminKeySequence = ''
          return
        }

        // Reset sequence if it gets too long
        if (window.adminKeySequence.length > 10) {
          window.adminKeySequence = ''
        }
      }

      // Add event listeners
      document.addEventListener('click', handleTap)
      document.addEventListener('touchstart', handleTap)
      document.addEventListener('keydown', handleKeyboard)

      return () => {
        document.removeEventListener('click', handleTap)
        document.removeEventListener('touchstart', handleTap)
        document.removeEventListener('keydown', handleKeyboard)
        clearTimeout(tapResetTimer)
      }
    }
  }, [isAuthenticated, showAuthForm, router, triggerAdminAccess])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Show fake 404 page if auth parameter is not present
    if (!showAuthForm) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-8">

            {/* Tap counter feedback */}
            {tapCount > 0 && tapCount < 3 && (
              <div className="absolute top-4 left-4 z-50">
                <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {tapCount}/3
                </div>
              </div>
            )}

            {/* Admin Access Loading Message */}
            {showAdminAccess && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="bg-primary-600 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg">
                  Redirecting...
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
              {/* Friendly Message */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                  Oops, you found this page!
                </h1>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  You think you&apos;re lost? Don&apos;t worry, it happens to the best of us.
                </p>
              </div>

              {/* Illustration/Icon */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-cyber-500/20 flex items-center justify-center backdrop-blur-sm border border-primary-500/20">
                  <div className="text-6xl">🧭</div>
                </div>
              </div>

              {/* Home Button */}
              <div className="pt-4">
                <a
                  href="/"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-cyber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-background"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Take me home</span>
                </a>
              </div>

              {/* Additional Help */}
              <div className="pt-6 space-y-3 text-sm text-foreground/60">
                <p>Or try these popular pages:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/portfolio"
                    className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
                  >
                    Portfolio
                  </a>
                  <a
                    href="/blog"
                    className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
                  >
                    Blog
                  </a>
                  <a
                    href="/about"
                    className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
                  >
                    About
                  </a>
                  <a
                    href="/contact"
                    className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-500/10 to-cyber-500/10 blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyber-500/10 to-primary-500/10 blur-3xl"></div>
            </div>
          </div>
        </div>
      )
    }

    // Show login form when auth=true
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Admin Panel</h1>
              <p className="text-foreground/60">Enter password to access dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-foreground focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-foreground hover:bg-foreground/80 text-background font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-foreground/50">
              Secure authentication enabled
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content - Full Width */}
      <div className="min-h-screen p-4 lg:p-8 pt-20 lg:pt-24 pb-40">
        {children}
      </div>

      {/* Bottom Dock Navigation */}
      <AdminDock onLogout={handleLogout} />
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    }>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  )
}