'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    return pathname === href
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        scrolled ? 'border-b' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name - using serif heading font */}
          <Link
            href="/"
            className="nav-brand font-serif font-bold text-xl hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            Matthew Raphael
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links hidden md:flex items-center space-x-6">
            <Link
              href="/work"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/work')
                  ? 'border-b-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text-primary)',
                borderColor: isActive('/work') ? 'var(--accent)' : 'transparent',
              }}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/about')
                  ? 'border-b-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text-primary)',
                borderColor: isActive('/about') ? 'var(--accent)' : 'transparent',
              }}
            >
              About
            </Link>
            <Link
              href="/dashboards"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                pathname?.startsWith('/dashboards')
                  ? 'border-b-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text-primary)',
                borderColor: pathname?.startsWith('/dashboards') ? 'var(--accent)' : 'transparent',
              }}
            >
              Dashboards
            </Link>
            <a
              href="https://paragraph.com/@notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Read my research on Paragraph"
            >
              Research ↗
            </a>

            {/* Theme toggle */}
            {isMounted && (
              <button
                onClick={toggleTheme}
                className="theme-toggle w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  backgroundColor: theme === 'dark' ? 'transparent' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="nav-links md:hidden flex items-center space-x-2">
            <Link
              href="/work"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/work') ? 'border-b-2 opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text-primary)',
                borderColor: isActive('/work') ? 'var(--accent)' : 'transparent',
              }}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/about') ? 'border-b-2 opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text-primary)',
                borderColor: isActive('/about') ? 'var(--accent)' : 'transparent',
              }}
            >
              About
            </Link>
            <Link
              href="/dashboards"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                pathname?.startsWith('/dashboards') ? 'border-b-2 opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text-primary)',
                borderColor: pathname?.startsWith('/dashboards') ? 'var(--accent)' : 'transparent',
              }}
            >
              Dashboards
            </Link>
            <a
              href="https://paragraph.com/@notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Read my research on Paragraph"
            >
              Research ↗
            </a>

            {/* Mobile theme toggle */}
            {isMounted && (
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ml-1"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}