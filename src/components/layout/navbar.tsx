'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NavbarAvatar } from '@/components/ui/profile-avatar'
import { NavLink, MobileNavLink } from '@/components/ui/nav-link'
import { getAllNavigationItems } from '@/lib/color-system'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAdminHint, setShowAdminHint] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Get navigation items from shared color system, plus Home
  const navItems = [
    { name: 'Home', href: '/' },
    ...getAllNavigationItems()
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Global keyboard shortcut for admin access
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        setShowAdminHint(true)
        setTimeout(() => setShowAdminHint(false), 2000)
        router.push('/admin')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  // Handle Alt+Click on logo for discrete admin access (Desktop)
  const handleLogoClick = (event: React.MouseEvent) => {
    if (event.altKey) {
      event.preventDefault()
      setShowAdminHint(true)
      setTimeout(() => setShowAdminHint(false), 2000)
      router.push('/admin')
    }
  }

  // Prevent context menu on logo
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
  }

  // Handle long press on logo for mobile admin access
  const handleLongPressStart = () => {
    setIsLongPressing(true)
    const timer = setTimeout(() => {
      setIsLongPressing(false)
      setShowAdminHint(true)
      setTimeout(() => setShowAdminHint(false), 2000)
      router.push('/admin')
    }, 2000) // 2 second long press
    setLongPressTimer(timer)
  }

  const handleLongPressEnd = () => {
    setIsLongPressing(false)
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [longPressTimer])

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-background/95 dark:backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-header dark:shadow-lg dark:shadow-primary-500/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center space-x-3 group hover:scale-105 transition-all duration-200 focus:outline-none relative touch-none ${
              isLongPressing ? 'scale-110 brightness-110' : ''
            }`}
            onClick={handleLogoClick}
            onContextMenu={handleContextMenu}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            onTouchCancel={handleLongPressEnd}
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
          >
            <NavbarAvatar />
            <div className="hidden xs:block">
              <div className="text-base sm:text-xl font-semibold text-storj-navy dark:text-white">Data Analytics</div>
              <div className="text-xs sm:text-xs text-storj-muted dark:text-gray-300 -mt-1 hidden sm:block">Web3 Data Analyst | Turning Blockchain Data into Insights</div>
            </div>

            {/* Long Press Progress Indicator */}
            {isLongPressing && (
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full animate-pulse" style={{
                  animation: 'longPressProgress 2s linear forwards'
                }}></div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation with Active States */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 text-storj-navy hover:text-storj-blue transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 px-4 space-y-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background/95 dark:backdrop-blur-md mx-4 rounded-b-lg shadow-lg">
            {navItems.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </MobileNavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Access Notification */}
      {showAdminHint && (
        <div className="fixed top-24 right-4 z-50 animate-bounce-in">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg border border-primary-500">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Accessing Admin Panel...</span>
            </div>
          </div>
        </div>
      )}

      {/* Long Press Hint for Mobile */}
      {isLongPressing && (
        <div className="fixed top-24 left-4 z-50">
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs">
            Hold to access admin...
          </div>
        </div>
      )}
    </nav>
  )
}