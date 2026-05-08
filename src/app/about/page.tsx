import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Matthew Raphael Nnamani | Blockchain Intelligence Practitioner',
  description: 'About Matthew Raphael Nnamani — blockchain intelligence practitioner, on-chain investigator, and AML compliance analyst. BSc Chemistry, University of Uyo. Independent investigator since 2024.',
  alternates: {
    canonical: 'https://matthewraphael.xyz/about',
  },
  openGraph: {
    title: 'About Matthew Raphael Nnamani — Blockchain Intelligence Practitioner',
    description: 'About Matthew Raphael Nnamani — blockchain intelligence practitioner, on-chain investigator, and AML compliance analyst. BSc Chemistry, University of Uyo. Independent investigator since 2024.',
    url: 'https://matthewraphael.xyz/about',
  },
}

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section 1 — Introduction */}
        <div className="mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Matthew Raphael Nnamani</h1>
          <p className="text-lg sm:text-xl opacity-60 mb-8">Blockchain Intelligence Practitioner</p>
          <p className="text-base sm:text-lg opacity-75 leading-relaxed">
            Blockchain intelligence analyst conducting AML-aligned on-chain investigations, wallet behavioral profiling, and KYT/transaction monitoring across EVM chains since 2024. Work spans multi-hop fund tracing, USDT flow attribution, cross-chain bridge analysis, sanctions screening, and structured compliance reporting — applying FATF, OFAC, and FinCEN frameworks to real financial crime casework. BSc Chemistry, University of Uyo, 2023.
          </p>
        </div>

        {/* Section 2 — Published Work */}
        <div className="mb-16 pb-16 border-b border-border">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-8">Published Work</p>
          <div className="space-y-8">

            <div>
              <a
                href="https://x.com/0x_note"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
              >
                Kraken $18.2M Social Engineering Theft ↗
              </a>
              <p className="text-sm opacity-60 mt-1 leading-relaxed">
                Full end-to-end ETH trace through staging wallets, THORChain, and dual-chain HitBTC cash-out.
              </p>
            </div>

            <div>
              <a
                href="https://paragraph.com/@notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
              >
                LastPass Drain Cluster — March 2026 ↗
              </a>
              <p className="text-sm opacity-60 mt-1 leading-relaxed">
                KYT analysis of active phishing drainer — 287 ETH, 60,133 USDT reconciled, BSC→ETH bridge confirmed, victim identified.
              </p>
            </div>

            <div>
              <a
                href="https://paragraph.com/@notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
              >
                Coordinated ETH Distribution Network ↗
              </a>
              <p className="text-sm opacity-60 mt-1 leading-relaxed">
                Behavioral taxonomy paper introducing provisioned EOA infrastructure as a new on-chain wallet class.
              </p>
            </div>

            <div>
              <a
                href="https://dune.com/notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
              >
                Stablecoin Analytics — Kaia Chain ↗
              </a>
              <p className="text-sm opacity-60 mt-1 leading-relaxed">
                USDT dominance dashboard: $60M+ volume, 34.4% market share, 29.5K unique users.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3 — Methods */}
        <div className="mb-16 pb-16 border-b border-border">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Methods</p>
          <div className="flex flex-wrap gap-2">
            {[
              'On-Chain Investigation',
              'KYT / Transaction Monitoring',
              'Multi-Hop Fund Tracing',
              'AML/CTF Compliance',
              'OFAC Sanctions Screening',
              'Cross-Chain Analysis',
              'Wallet Behavioral Profiling',
              'Trino SQL',
              'Dune Analytics',
              'Python (AI-assisted)',
              'Etherscan V2',
              'BSCScan',
              'Breadcrumbs',
            ].map((method) => (
              <span
                key={method}
                className="inline-block text-sm px-3 py-1.5 border border-border rounded opacity-75"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Section 4 — Contact */}
        <div>
          <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Get in Touch</p>
          <a
            href="mailto:matthewraphael@matthewraphael.xyz"
            className="font-medium mb-6 inline-block hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
          >
            matthewraphael@matthewraphael.xyz
          </a>
          <div className="flex flex-wrap gap-4 text-sm mt-6">
            <a
              href="https://x.com/0x_note"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-75 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
            >
              X: @0x_note ↗
            </a>
            <a
              href="https://linkedin.com/in/matthew-nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-75 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
