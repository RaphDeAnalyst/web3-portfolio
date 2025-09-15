'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NavbarAvatar } from '@/components/ui/profile-avatar'
import { NavLink, MobileNavLink } from '@/components/ui/nav-link'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-background/95 dark:backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-header dark:shadow-lg dark:shadow-primary-500/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
            <NavbarAvatar />
            <div className="hidden xs:block">
              <div className="text-base sm:text-xl font-semibold text-storj-navy">Data Analytics</div>
              <div className="text-xs sm:text-xs text-storj-muted -mt-1 hidden sm:block">Web3 Data Analyst | Turning Blockchain Data into Insights</div>
            </div>
          </Link>

          {/* Desktop Navigation with Active States */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
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
              className="relative p-3 text-storj-navy hover:text-storj-blue transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </MobileNavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}