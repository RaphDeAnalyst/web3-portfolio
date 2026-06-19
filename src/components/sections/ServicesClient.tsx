'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIERS = [
  {
    label: 'Quick Report',
    description: 'Single wallet screening across EVM chains.',
    details: 'Address labeling, counterparty categories, mixer/bridge exposure, risk flags. Delivered as a structured written brief.',
    meta: '48hr turnaround · Wallet address required',
    accent: false,
  },
  {
    label: 'Full Investigation',
    description: 'Multi-hop fund tracing with written intelligence brief.',
    details: 'End-to-end transaction graph traversal, cross-chain tracing, exchange attribution, confidence-graded findings.',
    meta: '5–7 days · Address, tx hash, or incident description required',
    accent: true,
  },
  {
    label: 'Retainer',
    description: 'Ongoing monitoring and investigation support.',
    details: 'Monthly wallet screening, incident response, custom Dune dashboard delivery, and written briefings on request.',
    meta: 'Monthly engagement · Scope agreed per client',
    accent: false,
  },
]

export function ServicesClient() {
  const [wallet, setWallet]       = useState('')
  const [details, setDetails]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px - var(--safe-area-top))', padding: '88px 32px 80px' }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>

        {/* Back */}
        <Link
          href="/work"
          className="link-fade"
          style={{ fontSize: '14px', display: 'inline-block', marginBottom: '28px', color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          ← Work
        </Link>

        {/* Header */}
        <h1
          className="font-serif"
          style={{ fontWeight: 700, fontSize: 'clamp(28px, 5vw, 40px)', margin: '0 0 12px', lineHeight: 1.1, color: 'var(--text-primary)' }}
        >
          Services
        </h1>
        <p style={{ fontSize: '16px', lineHeight: 1.65, margin: '0 0 40px', color: 'var(--text-secondary)' }}>
          Wallet screening, fund tracing, and AML-aligned investigation — engaged directly.
        </p>

        {/* Tier cards — flex: 1 1 180px collapses to single column on mobile */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
          {TIERS.map((tier) => (
            <div
              key={tier.label}
              style={{
                flex: '1 1 180px',
                backgroundColor: 'var(--card-bg)',
                border: `1px solid ${tier.accent ? 'var(--accent)' : 'var(--card-border)'}`,
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px', textTransform: 'uppercase',
                  letterSpacing: '0.1em', margin: '0 0 8px',
                  color: tier.accent ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {tier.label}
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.5, margin: '0 0 10px', color: 'var(--text-primary)' }}>
                {tier.description}
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.65, margin: 0, color: 'var(--text-secondary)' }}>
                {tier.details}
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: 'auto' }}>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', lineHeight: 1.5, margin: 0, color: 'var(--text-muted)' }}>
                  {tier.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Intake form */}
        <div style={{ borderTop: '1px solid var(--separator)', paddingTop: '40px', maxWidth: '560px' }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.16em', margin: '0 0 28px', color: 'var(--text-muted)',
            }}
          >
            Start an Inquiry
          </p>

          {submitted ? (
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-secondary)', textAlign: 'center', padding: '32px 0' }}>
              Message received. I&apos;ll be in touch within 48 hours.
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label
                  htmlFor="wallet"
                  style={{
                    display: 'block', fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '8px', color: 'var(--text-muted)',
                  }}
                >
                  Wallet address or transaction hash
                </label>
                <input
                  id="wallet"
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x… or txhash"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: '2px',
                    fontSize: '14px', color: 'var(--text-primary)',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border)'  }}
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  style={{
                    display: 'block', fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '8px', color: 'var(--text-muted)',
                  }}
                >
                  What happened
                </label>
                <textarea
                  id="details"
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the situation…"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: '2px',
                    fontSize: '14px', color: 'var(--text-primary)',
                    outline: 'none', resize: 'vertical',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border)'  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '13px 26px', border: '1px solid var(--accent)',
                    background: 'transparent', color: 'var(--text-primary)',
                    fontSize: '14px', fontWeight: 500,
                    borderRadius: '2px', cursor: 'pointer', transition: 'all .15s',
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
                  Send inquiry →
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
