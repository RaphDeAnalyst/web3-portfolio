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
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-lg font-bold"
                style={{
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              >
                MR
              </div>
            </div>

            {/* Name and title */}
            <div className="flex-1">
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Blockchain Intelligence Practitioner
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Matthew Raphael Nnamani
              </h1>
            </div>
          </div>

          {/* Bio */}
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            On-chain investigator and AML compliance analyst conducting fund tracing, KYT/transaction monitoring, and financial crime investigations across EVM chains since 2024. Applies FATF, OFAC, and FinCEN frameworks to real casework. BSc Chemistry, University of Uyo, 2023.
          </p>
        </div>

        {/* Section 2 — Published Work */}
        <div className="mb-20 pb-20" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
          <p className="text-xs font-mono uppercase tracking-wider mb-8" style={{ color: 'var(--text-muted)' }}>Published work</p>
          <div className="space-y-6">

            <div className="pb-6" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
              <a
                href="https://x.com/0x_note"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity block mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Kraken $18.2M Social Engineering Theft
              </a>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Full ETH trace through THORChain to dual-chain HitBTC cash-out. ↗
              </p>
            </div>

            <div className="pb-6" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
              <a
                href="https://paragraph.com/@notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity block mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                LastPass Drain Cluster
              </a>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                March 2026 — 287 ETH, 60,133 USDT reconciled, victim identified. ↗
              </p>
            </div>

            <div className="pb-6">
              <a
                href="https://paragraph.com/@notes0x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity block mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Coordinated ETH Distribution Network
              </a>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                New wallet taxonomy class: provisioned EOA infrastructure. ↗
              </p>
            </div>

          </div>
        </div>

        {/* Section 3 — Methods */}
        <div className="mb-20 pb-20" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
          <p className="text-xs font-mono uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>Methods</p>
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
                className="text-xs px-3 py-1.5 transition-opacity hover:opacity-100"
                style={{
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  color: 'var(--text-secondary)',
                  opacity: 0.75,
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Section 4 — Contact */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>Get in touch</p>
          <button
            onClick={copyEmail}
            className="font-serif font-bold text-lg hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity mb-6"
            style={{ color: 'var(--text-primary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            matthewraphael@matthewraphael.xyz
            {copied && (
              <span className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>Copied!</span>
            )}
          </button>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://x.com/0x_note"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{
                borderColor: 'var(--border)',
                borderWidth: '1px',
                color: 'var(--text-secondary)',
                opacity: 0.75,
              }}
            >
              X ↗
            </a>
            <a
              href="https://linkedin.com/in/matthew-nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{
                borderColor: 'var(--border)',
                borderWidth: '1px',
                color: 'var(--text-secondary)',
                opacity: 0.75,
              }}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
