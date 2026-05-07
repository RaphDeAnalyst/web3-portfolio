'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name */}
          <Link
            href="/"
            className="font-semibold text-lg hover:opacity-70 transition-opacity"
          >
            Matthew Raphael
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/work"
              className={`text-sm transition-opacity hover:opacity-70 ${
                isActive('/work') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-opacity hover:opacity-70 ${
                isActive('/about') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              About
            </Link>
            <a
              href="https://dune.com/rraphael"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              ↗ Dune
            </a>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/work"
              className={`text-sm transition-opacity hover:opacity-70 ${
                isActive('/work') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-opacity hover:opacity-70 ${
                isActive('/about') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              About
            </Link>
            <a
              href="https://dune.com/rraphael"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              ↗
            </a>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}