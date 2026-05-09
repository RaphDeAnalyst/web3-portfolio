'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 px-6 lg:px-8 overflow-hidden">
      {/* Subtle network graph background - right side only */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-[0.03] pointer-events-none">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g>
            {/* Network nodes - fixed positions */}
            <circle cx="100" cy="80" r="2" fill="currentColor" />
            <circle cx="250" cy="150" r="2" fill="currentColor" />
            <circle cx="400" cy="120" r="2" fill="currentColor" />
            <circle cx="550" cy="200" r="2" fill="currentColor" />
            <circle cx="700" cy="100" r="2" fill="currentColor" />
            <circle cx="150" cy="350" r="2" fill="currentColor" />
            <circle cx="450" cy="380" r="2" fill="currentColor" />
            <circle cx="650" cy="420" r="2" fill="currentColor" />
            <circle cx="300" cy="500" r="2" fill="currentColor" />
            <circle cx="650" cy="550" r="2" fill="currentColor" />

            {/* Network connections */}
            <line x1="100" y1="80" x2="250" y2="150" stroke="currentColor" strokeWidth="0.5" />
            <line x1="250" y1="150" x2="400" y2="120" stroke="currentColor" strokeWidth="0.5" />
            <line x1="400" y1="120" x2="550" y2="200" stroke="currentColor" strokeWidth="0.5" />
            <line x1="550" y1="200" x2="700" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="150" y1="350" x2="450" y2="380" stroke="currentColor" strokeWidth="0.5" />
            <line x1="450" y1="380" x2="650" y2="420" stroke="currentColor" strokeWidth="0.5" />
            <line x1="300" y1="500" x2="650" y2="550" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="80" x2="150" y2="350" stroke="currentColor" strokeWidth="0.5" />
            <line x1="400" y1="120" x2="300" y2="500" stroke="currentColor" strokeWidth="0.5" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-4xl relative z-10">
        <div className="space-y-8">
          {/* Location label */}
          <div className="text-xs font-mono uppercase tracking-wider opacity-60 letter-spacing">
            Lagos, Nigeria — Open to remote
          </div>

          {/* Name - serif, large */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Matthew Raphael Nnamani
          </h1>

          {/* Tagline */}
          <p className="font-serif text-lg sm:text-xl md:text-2xl font-normal" style={{ color: 'var(--accent)' }}>
            Blockchain Intelligence Practitioner
          </p>

          {/* Description - brief */}
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            I investigate on-chain financial crime, trace fund flows across EVM chains, and produce AML-aligned intelligence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/work"
              className="inline-flex items-center justify-center px-6 py-3 border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent text-sm font-medium"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--bg-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
            >
              View work →
            </Link>
            <a
              href="https://paragraph.com/@notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent font-medium hover:opacity-100"
              style={{ color: 'var(--text-secondary)', opacity: 0.75 }}
            >
              Research ↗
            </a>
          </div>

          {/* Chains section */}
          <div className="pt-12" style={{ borderTopColor: 'var(--separator)', borderTopWidth: '1px' }}>
            <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              Chains
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Ethereum',
                'BSC',
                'Polygon',
                'Arbitrum',
                'Base',
                'Optimism',
                'Mantle',
                'Monad',
              ].map((chain) => (
                <span
                  key={chain}
                  className="text-xs px-3 py-1.5 transition-opacity hover:opacity-100"
                  style={{
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    color: 'var(--text-secondary)',
                    opacity: 0.6,
                  }}
                >
                  {chain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
