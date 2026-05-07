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
          <p className="text-lg sm:text-xl md:text-2xl opacity-70">
            Web3 Data Analyst
          </p>

          {/* Context sentence */}
          <p className="text-base sm:text-lg max-w-2xl mx-auto opacity-60 leading-relaxed">
            I analyze on-chain data across DeFi, NFT markets, and L2 networks using SQL, Python, and Dune Analytics — based in Lagos, open to the world.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4">
            <Link
              href="/work"
              className="px-8 py-3 bg-black text-white rounded hover:opacity-80 transition-opacity font-medium"
            >
              View Work
            </Link>
            <a
              href="https://dune.com/rraphael"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-black rounded hover:bg-black hover:text-white transition-colors font-medium"
            >
              Dune Profile ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
