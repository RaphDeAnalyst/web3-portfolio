'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminDock from '@/components/ui/admin-dock'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tapCount, setTapCount] = useState(0)
  const [lastTapTime, setLastTapTime] = useState(0)
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [showProgress, setShowProgress] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('admin-authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    }

    // Secret trigger listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      // Desktop secret: Ctrl+Shift+L
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        triggerAuthForm()
        return
      }

      // Alternative sequence: A-D-M-I-N
      const newSequence = [...keySequence, e.key.toUpperCase()]
      if (newSequence.length > 5) {
        newSequence.shift()
      }
      setKeySequence(newSequence)

      if (newSequence.join('') === 'ADMIN') {
        triggerAuthForm()
        setKeySequence([])
      }
    }

    const handleTripleTap = (e: TouchEvent | MouseEvent) => {
      const now = Date.now()

      if (now - lastTapTime < 500) { // Within 500ms
        setTapCount(prev => {
          const newCount = prev + 1
          if (newCount >= 3) {
            triggerAuthForm()
            return 0
          }
          return newCount
        })
      } else {
        setTapCount(1)
      }

      setLastTapTime(now)
    }

    const triggerAuthForm = () => {
      setShowProgress(true)
      setTimeout(() => {
        setShowAuthForm(true)
        setShowProgress(false)
      }, 800)
    }

    // Reset tap count after 2 seconds
    const resetTapCount = setTimeout(() => {
      setTapCount(0)
    }, 2000)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleTripleTap)
    window.addEventListener('touchstart', handleTripleTap)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleTripleTap)
      window.removeEventListener('touchstart', handleTripleTap)
      clearTimeout(resetTapCount)
    }
  }, [keySequence, lastTapTime])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Get admin password from environment variable with fallback
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('admin-authenticated', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowAuthForm(false)
    localStorage.removeItem('admin-authenticated')
    router.push('/')
  }

  // Handle redirect to /lost page or show auth form
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shouldShowAuth = urlParams.get('auth') === 'true'

    if (!isAuthenticated) {
      if (shouldShowAuth) {
        setShowAuthForm(true)
      } else if (!showAuthForm) {
        // Immediate redirect to prevent flash
        router.replace('/lost')
        return
      }
    }
  }, [isAuthenticated, showAuthForm, router])

  // Show nothing while redirecting - prevent any flash
  if (!isAuthenticated && !showAuthForm) {
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
                className="w-full px-4 py-3 rounded-lg bg-foreground hover:bg-foreground/80 text-background font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20"
              >
                Login
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-foreground/50">
              {process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? 'Custom password configured' : 'Default password: admin123'}
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