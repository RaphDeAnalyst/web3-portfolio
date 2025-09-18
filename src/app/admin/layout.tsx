'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminDock from '@/components/ui/admin-dock'

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
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [])

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
      console.error('Login error:', error)
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
      console.error('Logout error:', error)
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
    }
  }, [isLoading, isAuthenticated, searchParams])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
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