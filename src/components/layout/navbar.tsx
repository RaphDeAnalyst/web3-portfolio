'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme-provider'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { effectiveTheme, setTheme } = useTheme()
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
            className="font-semibold text-lg hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
          >
            Matthew Raphael
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/work"
              className={`text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                isActive('/work') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                isActive('/about') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              About
            </Link>
            <a
              href="https://dune.com/notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
              aria-label="Visit my Dune Analytics profile"
            >
              Dune ↗
            </a>
            {mounted && (
              <button
                onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
                className="opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity p-1"
                aria-label="Toggle theme"
              >
                {effectiveTheme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/work"
              className={`text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                isActive('/work') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                isActive('/about') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              About
            </Link>
            <a
              href="https://dune.com/notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
              aria-label="Visit my Dune Analytics profile"
            >
              Dune ↗
            </a>
            {mounted && (
              <button
                onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
                className="opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity p-1"
                aria-label="Toggle theme"
              >
                {effectiveTheme === 'dark' ? (
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