'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SidebarNavLink } from '@/components/ui/nav-link'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('admin-authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password protection - in production, use proper auth
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-authenticated', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-authenticated')
    router.push('/admin')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Blog Posts', href: '/admin/posts' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Profile', href: '/admin/profile' },
    { name: 'Media', href: '/admin/media' },
  ]

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
              Default password: admin123
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-background border border-gray-200 dark:border-gray-800 shadow-lg"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-background border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 z-40 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="font-bold text-foreground">Admin Panel</h2>
                <p className="text-xs text-foreground/60">Content Management</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <SidebarNavLink
                  key={item.name}
                  href={item.href}
                >
                  <span>{item.name}</span>
                </SidebarNavLink>
              ))}
            </nav>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors duration-200"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  )
}