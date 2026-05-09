'use client'

import { useState } from 'react'

export function AboutClient() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('matthewraphael@matthewraphael.xyz')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Section 1 — Introduction */}
        <div className="mb-20">
          <div className="flex gap-6 items-start mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center bg-background/50">
                <span className="font-serif text-lg font-bold">MR</span>
              </div>
            </div>

            {/* Name and title */}
            <div className="flex-1">
              <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">
                Blockchain Intelligence Practitioner
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                Matthew Raphael Nnamani
              </h1>
            </div>
          </div>

          {/* Bio */}
          <p className="text-base opacity-75 leading-relaxed">
            On-chain investigator and AML compliance analyst conducting fund tracing, KYT/transaction monitoring, and financial crime investigations across EVM chains since 2024. Applies FATF, OFAC, and FinCEN frameworks to real casework. BSc Chemistry, University of Uyo, 2023.
          </p>
        </div>

        {/* Section 2 — Published Work */}
        <div className="mb-20 pb-20 border-b border-border">
          <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-8">Published work</p>
          <div className="space-y-6">

            <div className="pb-6 border-b border-border last:border-b-0">
              <a
                href="https://x.com/0x_note"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity block mb-2"
              >
                Kraken $18.2M Social Engineering Theft
              </a>
              <p className="text-sm opacity-70 leading-relaxed">
                Full ETH trace through THORChain to dual-chain HitBTC cash-out. ↗
              </p>
            </div>

            <div className="pb-6 border-b border-border last:border-b-0">
              <a
                href="https://paragraph.com/@notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity block mb-2"
              >
                LastPass Drain Cluster
              </a>
              <p className="text-sm opacity-70 leading-relaxed">
                March 2026 — 287 ETH, 60,133 USDT reconciled, victim identified. ↗
              </p>
            </div>

            <div className="pb-6 border-b border-border last:border-b-0">
              <a
                href="https://paragraph.com/@notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity block mb-2"
              >
                Coordinated ETH Distribution Network
              </a>
              <p className="text-sm opacity-70 leading-relaxed">
                New wallet taxonomy class: provisioned EOA infrastructure. ↗
              </p>
            </div>

          </div>
        </div>

        {/* Section 3 — Methods */}
        <div className="mb-20 pb-20 border-b border-border">
          <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-6">Methods</p>
          <div className="flex flex-wrap gap-2">
            {[
              'On-chain investigation',
              'KYT / Transaction monitoring',
              'Multi-hop fund tracing',
              'AML/CTF compliance',
              'OFAC sanctions screening',
              'Cross-chain analysis',
              'Wallet behavioral profiling',
            ].map((method) => (
              <span
                key={method}
                className="text-xs px-3 py-1.5 border border-border/60 opacity-75 hover:opacity-100 transition-opacity"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Section 4 — Contact */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-6">Get in touch</p>
          <button
            onClick={copyEmail}
            className="font-serif font-bold text-lg hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity mb-6"
          >
            matthewraphael@matthewraphael.xyz
            {copied && (
              <span className="ml-2 text-sm opacity-60">Copied!</span>
            )}
          </button>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://x.com/0x_note"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-border/60 opacity-75 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
            >
              X ↗
            </a>
            <a
              href="https://linkedin.com/in/matthew-nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-border/60 opacity-75 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
