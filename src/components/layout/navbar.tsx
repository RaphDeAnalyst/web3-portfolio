'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NavbarAvatar } from '@/components/ui/profile-avatar'

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg shadow-primary-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <NavbarAvatar />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gradient">Data Analytics</div>
              <div className="text-xs text-foreground/60 -mt-1">Web3 Data Analyst | Turning Blockchain Data into Insights</div>
            </div>
          </Link>

          {/* Desktop Navigation with Active States */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group ${
                  pathname === item.href
                    ? 'text-cyber-500 bg-cyber-500/10'
                    : 'text-foreground/80 hover:text-cyber-500 hover:bg-cyber-500/5'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyber-500 rounded-full"></div>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            
            <ThemeToggle />
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 text-foreground hover:text-cyber-500 transition-colors duration-200"
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
          <div className="py-6 space-y-4 border-t border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-md rounded-b-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-cyber-500 bg-cyber-500/10 border-l-2 border-cyber-500'
                    : 'text-foreground/80 hover:text-cyber-500 hover:bg-cyber-500/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}