'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-background transition-all duration-200 ${
        scrolled ? 'border-b border-border' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name - using serif heading font */}
          <Link
            href="/"
            className="font-serif font-bold text-xl hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
          >
            Matthew Raphael
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/work"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/work')
                  ? 'opacity-100 border-b-2 border-accent'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/about')
                  ? 'opacity-100 border-b-2 border-accent'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              About
            </Link>
            <a
              href="https://paragraph.com/@notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
              aria-label="Read my research on Paragraph"
            >
              Research ↗
            </a>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/work"
              className={`text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/work') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Work
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive('/about') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              About
            </Link>
            <a
              href="https://paragraph.com/@notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
              aria-label="Read my research on Paragraph"
            >
              Research ↗
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}