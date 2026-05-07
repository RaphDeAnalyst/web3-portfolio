import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Matthew Raphael | Web3 Data Analyst',
  description: 'Matthew Raphael is a Web3 Data Analyst specializing in on-chain analytics, DeFi protocols, and L2 networks. Based in Lagos.',
}

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">About</h1>
        </div>

        {/* Zone 1: Writing */}
        <div className="space-y-6 mb-12">
          <p className="text-base sm:text-lg opacity-70 leading-relaxed">
            I&apos;m a Web3 Data Analyst based in Lagos, Nigeria, focused on turning on-chain data into actionable insights. I studied at the University of Uyo, where I first developed my foundation in data analysis and problem-solving. What started as traditional business intelligence work evolved into a fascination with blockchain data — the transparency, the patterns, the ability to answer questions about entire networks in real time.
          </p>

          <p className="text-base sm:text-lg opacity-70 leading-relaxed">
            I spend most of my time analyzing DeFi protocols, L2 networks, and NFT market dynamics using SQL, Python, and Dune Analytics. I&apos;m interested in questions like: How do users behave on different L2s? Which protocols are capturing value? What does early adoption look like on new chains? I approach data like a journalist — looking for the story underneath the numbers.
          </p>

          <p className="text-base sm:text-lg opacity-70 leading-relaxed">
            I&apos;m available for contract work, consulting, and full-time roles globally. If you have a dataset that needs exploring or a research question that matters, let&apos;s talk.
          </p>
        </div>

        {/* Zone 2: Tools */}
        <div className="mb-12 pb-12 border-b border-gray-200">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-4">Tools</p>
          <p className="text-sm sm:text-base opacity-70">
            Python · SQL · Dune Analytics · Flipside Crypto · Power BI · Tableau · Pandas · Web3.py · Etherscan API
          </p>
        </div>

        {/* Zone 3: Contact */}
        <div>
          <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Get in touch</p>
          <p className="font-medium mb-6">matthewraphael@matthewraphael.xyz</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              GitHub ↗
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Twitter ↗
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://dune.com/rraphael"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Dune ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
