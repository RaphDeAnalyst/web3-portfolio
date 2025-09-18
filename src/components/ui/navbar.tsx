'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
// Removed framer-motion for performance optimization
import { Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NavbarAvatar } from '@/components/ui/profile-avatar'
import { logger } from '@/lib/logger'

/**
 * Navigation item interface
 */
interface NavItem {
  name: string
  href: string
}

/**
 * Component that handles admin link detection using searchParams
 */
function AdminLinkDetector({ onAdminDetected }: { onAdminDetected: (show: boolean) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const adminParam = searchParams?.get('admin') === 'true' || searchParams?.get('dev') === 'true'
    onAdminDetected(adminParam)
  }, [searchParams, onAdminDetected])

  return null
}

/**
 * Production-grade navigation component following Meta's UI/UX standards
 *
 * Features:
 * - Mobile-first responsive design
 * - Framer Motion animations
 * - Full accessibility compliance
 * - Keyboard navigation support
 * - Focus trapping
 * - Next.js App Router integration
 */
export function Navbar() {
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [showAdminLink, setShowAdminLink] = useState(false)

  // Hooks
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()

  // Refs for admin access
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Refs for focus management
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const lastLinkRef = useRef<HTMLAnchorElement>(null)

  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ]

  /**
   * Handle admin link detection
   */
  const handleAdminDetected = useCallback((show: boolean) => {
    setShowAdminLink(show)
  }, [])

  /**
   * Handle scroll effect for navbar background
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * Cleanup tap timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Handle escape key to close mobile menu
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        // Return focus to hamburger button
        hamburgerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  /**
   * Handle clicks outside mobile menu to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  /**
   * Focus trapping for mobile menu accessibility
   */
  useEffect(() => {
    if (isOpen) {
      // Focus first link when menu opens
      setTimeout(() => {
        firstLinkRef.current?.focus()
      }, 100)

      // Trap focus within mobile menu
      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = mobileMenuRef.current?.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )

          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

            if (event.shiftKey) {
              // Shift + Tab
              if (document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
              }
            } else {
              // Tab
              if (document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
              }
            }
          }
        }
      }

      document.addEventListener('keydown', handleTabKey)
      return () => document.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  /**
   * Toggle mobile menu with proper accessibility
   */
  const toggleMobileMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  /**
   * Close mobile menu and focus hamburger button
   */
  const closeMobileMenu = useCallback(() => {
    setIsOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  /**
   * Check if current route is active
   */
  const isActiveRoute = (href: string): boolean => {
    if (!pathname) return false
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  /**
   * Handle logo tap for admin access (5 taps in 3 seconds)
   */
  const handleLogoTap = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only process on mobile devices
    const isMobile = window.innerWidth < 768
    const isTouch = 'touches' in e

    console.log('Admin gesture: Event triggered', {
      isMobile,
      isTouch,
      eventType: e.type,
      currentTapCount: tapCount
    })

    if (!isMobile) {
      logger.info('Admin gesture: Desktop detected, skipping tap detection')
      return
    }

    // Clear existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }

    const newCount = tapCount + 1
    logger.info('Admin gesture: Processing tap', { newCount, totalNeeded: 5 })
    setTapCount(newCount)

    // Check if we've reached 5 taps
    if (newCount >= 5) {
      logger.info('Admin gesture: 5 taps reached! Navigating to admin')

      // Haptic feedback if available
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 100])
        logger.info('Admin gesture: Haptic feedback triggered')
      }

      // Navigate to admin
      router.push('/admin')
      setTapCount(0)
      return
    }

    // Navigate to home page after a short delay if less than 5 taps
    setTimeout(() => {
      if (tapCount < 4) {
        logger.info('Admin gesture: Normal navigation to home')
        router.push('/')
      }
    }, 150)

    // Reset tap count after 3 seconds of no activity
    tapTimeoutRef.current = setTimeout(() => {
      logger.info('Admin gesture: Timeout reached, resetting tap count')
      setTapCount(0)
    }, 3000)
  }, [tapCount, router])

  // CSS animation classes for mobile menu
  const mobileMenuClass = isOpen
    ? 'navbar-mobile-menu-open'
    : 'navbar-mobile-menu-closed'

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group hover:scale-105 transition-all duration-200 focus:outline-none rounded-lg p-1"
            aria-label="Navigate to homepage"
            onClick={(e) => {
              // Handle navigation for desktop only
              if (window.innerWidth >= 768) {
                // Normal desktop navigation
                router.push('/')
              } else {
                // Mobile - let touch handler manage everything
                e.preventDefault()
              }
            }}
            onTouchStart={handleLogoTap}
          >
            <div className="relative">
              <NavbarAvatar />
              {/* Tap counter indicator for mobile admin access */}
              {tapCount > 0 && tapCount < 5 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse md:hidden">
                  {tapCount}
                </div>
              )}
            </div>
            <div className="hidden xs:block">
              <div className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                Data Analytics
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 -mt-1 hidden sm:block">
                Web3 Data Analyst | Turning Blockchain Data into Insights
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group focus:outline-none ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                    {isActive && (
                      <div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 animate-slide-in"
                      />
                    )}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              <div className={`transition-all duration-200 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-0 opacity-100'}`}>
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="mobile-menu-button"
        >
          <div className={`px-4 py-6 space-y-2 transition-all duration-300 ${
            isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}>
            {navItems.map((item, index) => {
              const isActive = isActiveRoute(item.href)
              return (
                <div
                  key={item.href}
                  className={`transition-all duration-200 ${isOpen ? 'animate-slide-in-left' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    ref={index === 0 ? firstLinkRef : index === navItems.length - 1 ? lastLinkRef : undefined}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 dark:border-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </div>
              )
            })}

            {/* Admin Link - Only shown when URL parameter is present */}
            {showAdminLink && (
              <div className={`transition-all duration-200 ${isOpen ? 'animate-slide-in-left' : ''}`}
                style={{ animationDelay: `${navItems.length * 50}ms` }}
              >
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-l-4 border-red-500"
                    role="menuitem"
                  >
                    🔒 Admin Panel
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Link Detection with Suspense Boundary */}
      <Suspense fallback={null}>
        <AdminLinkDetector onAdminDetected={handleAdminDetected} />
      </Suspense>
    </nav>
  )
}