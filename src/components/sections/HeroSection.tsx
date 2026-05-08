'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-12">
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Matthew Raphael
          </h1>

          {/* Role */}
          <p className="text-lg sm:text-xl md:text-2xl opacity-75">
            Blockchain Intelligence Practitioner
          </p>

          {/* Context sentence */}
          <p className="text-base sm:text-lg max-w-2xl mx-auto opacity-65 leading-relaxed">
            I investigate on-chain financial crime, trace fund flows across EVM chains, and produce AML-aligned intelligence. Published investigations, research papers, and production KYT tooling — based in Lagos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4">
            <Link
              href="/work"
              className="px-8 py-4 h-11 flex items-center justify-center bg-foreground text-background rounded hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity font-medium"
            >
              View Work
            </Link>
            <a
              href="https://paragraph.com/@notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 h-11 flex items-center justify-center border border-foreground rounded hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors font-medium"
            >
              Research ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
