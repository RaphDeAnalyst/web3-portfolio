'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="6.5" cy="8" r="5" fill="currentColor" />
      <circle cx="9.5" cy="6" r="4.5" fill="var(--bg-primary)" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
      <line x1="8" y1="0.8" x2="8" y2="2.6" />
      <line x1="8" y1="13.4" x2="8" y2="15.2" />
      <line x1="0.8" y1="8" x2="2.6" y2="8" />
      <line x1="13.4" y1="8" x2="15.2" y2="8" />
      <line x1="2.9" y1="2.9" x2="4.2" y2="4.2" />
      <line x1="11.8" y1="11.8" x2="13.1" y2="13.1" />
      <line x1="13.1" y1="2.9" x2="11.8" y2="4.2" />
      <line x1="4.2" y1="11.8" x2="2.9" y2="13.1" />
    </svg>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setIsMounted(true) }, [])

  const workActive = pathname === '/work' || pathname?.startsWith('/work/')
  const aboutActive = pathname === '/about'
  const dashActive = pathname?.startsWith('/dashboards')

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <nav
      className="site-nav sticky top-0 w-full z-50"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--separator)',
      }}
    >
      <div
        className="nav-inner"
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Wordmark — collapses to MR monogram below 640px */}
        <Link
          href="/"
          className="font-serif font-bold hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          style={{ fontSize: '18px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '0.01em' }}
        >
          <span className="brand-full">Matthew Raphael</span>
          <span className="brand-mono">MR</span>
        </Link>

        {/* Nav links — unified, no separate mobile version */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <NavLink href="/work" active={!!workActive}>Work</NavLink>
          <NavLink href="/about" active={!!aboutActive}>About</NavLink>
          <NavLink href="/dashboards" active={!!dashActive}>Dashboards</NavLink>
          <a
            href="https://paragraph.com/@notes0x"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            style={{ fontSize: '14px', color: 'var(--text-primary)', opacity: 0.6, textDecoration: 'none', whiteSpace: 'nowrap', paddingBottom: '6px' }}
            aria-label="Read my research on Paragraph"
          >
            Research ↗
          </a>

          {isMounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{
                width: '36px', height: '36px', borderRadius: '9999px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{
        position: 'relative', fontSize: '14px', color: 'var(--text-primary)',
        opacity: active ? 1 : 0.6, textDecoration: 'none', paddingBottom: '6px',
      }}
    >
      {children}
      {active && (
        <span style={{
          position: 'absolute', left: 0, right: 0, bottom: '-1px',
          height: '2px', background: 'var(--accent)',
        }} />
      )}
    </Link>
  )
}