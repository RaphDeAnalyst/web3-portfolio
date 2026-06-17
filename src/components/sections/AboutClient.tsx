'use client'

const PRINCIPLES = [
  { num: '01', title: 'Assert only what the data supports.', note: 'CONFIRMED, PROBABLE, UNCONFIRMED — never collapsed into one.' },
  { num: '02', title: 'Slow movement beats no movement.', note: 'A logged blocker is progress. An abandoned thread is not.' },
  { num: '03', title: 'The exit matters as much as the source.', note: 'Following funds to a cash-out endpoint is not enough — the regulatory posture of that endpoint is part of the finding.' },
  { num: '04', title: 'Automation leaves fingerprints.', note: '21,000 gas, every transaction, every time. Determinism is a signature.' },
  { num: '05', title: "Label what you don't know.", note: 'An open thread documented is more honest than a conclusion forced.' },
]

const METHODS = [
  'On-chain investigation', 'KYT / Transaction monitoring', 'Multi-hop fund tracing',
  'AML/CTF compliance', 'OFAC sanctions screening', 'Cross-chain analysis',
  'Wallet behavioral profiling', 'Trino SQL', 'Dune Analytics',
  'Python (AI-assisted)', 'Etherscan V2', 'BSCScan', 'Breadcrumbs',
]

export function AboutClient() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '88px 32px 80px' }}>
      <div
        className="about-grid"
        style={{
          maxWidth: '1040px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '280px 1fr',
          gap: '64px', alignItems: 'start',
        }}
      >
        {/* Sticky sidebar */}
        <aside
          className="about-aside"
          style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Avatar */}
          <div
            className="font-serif"
            style={{
              width: '72px', height: '72px', borderRadius: '9999px',
              border: '1px solid var(--border)', background: 'var(--bg-secondary)',
              color: 'var(--text-primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '22px', fontWeight: 700,
            }}
          >
            MR
          </div>

          {/* Name + title */}
          <div>
            <h1
              className="font-serif"
              style={{ fontWeight: 700, fontSize: '26px', margin: '0 0 6px', lineHeight: 1.1, color: 'var(--text-primary)' }}
            >
              Matthew Raphael Nnamani
            </h1>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px', textTransform: 'uppercase',
                letterSpacing: '0.1em', margin: 0, color: 'var(--text-muted)',
              }}
            >
              Blockchain Intelligence
            </p>
          </div>

          <div style={{ height: '1px', background: 'var(--separator)' }} />

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.14em', margin: 0, color: 'var(--text-muted)',
              }}
            >
              Get in touch
            </p>
            <a
              href="mailto:matthewraphael@matthewraphael.xyz"
              className="font-serif"
              style={{
                fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
                textDecoration: 'none', lineHeight: 1.3, wordBreak: 'break-word',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
            >
              matthewraphael@matthewraphael.xyz
            </a>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
              <a
                href="https://x.com/0x_note"
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '7px 14px', border: '1px solid var(--border)',
                  fontSize: '13px', color: 'var(--text-secondary)', opacity: 0.75,
                  textDecoration: 'none', borderRadius: '2px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75' }}
              >
                X ↗
              </a>
              <a
                href="https://linkedin.com/in/matthew-nnamani"
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '7px 14px', border: '1px solid var(--border)',
                  fontSize: '13px', color: 'var(--text-secondary)', opacity: 0.75,
                  textDecoration: 'none', borderRadius: '2px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75' }}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* § 01 — Profile */}
          <div style={{ paddingBottom: '36px', borderBottom: '1px solid var(--separator)' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.16em', margin: '0 0 16px', color: 'var(--text-muted)',
              }}
            >
              § 01 — Profile
            </p>
            <p
              className="font-serif"
              style={{
                fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 500,
                lineHeight: 1.35, margin: 0, color: 'var(--text-primary)',
              }}
            >
              On-chain investigator and AML compliance analyst tracing illicit fund flows across EVM chains.
            </p>
            <p
              style={{
                fontSize: '16px', lineHeight: 1.7, margin: '20px 0 0',
                color: 'var(--text-secondary)', maxWidth: '600px',
              }}
            >
              Conducting fund tracing, KYT/transaction monitoring, and financial crime investigations since 2024 — applying FATF, OFAC, and FinCEN frameworks to real casework.
            </p>
          </div>

          {/* § 02 — Operating Principles */}
          <div style={{ padding: '36px 0', borderBottom: '1px solid var(--separator)' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.16em', margin: '0 0 28px', color: 'var(--text-muted)',
              }}
            >
              § 02 — Operating Principles
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr',
                    gap: '20px', padding: '18px 0',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '13px', color: 'var(--accent)', paddingTop: '3px',
                    }}
                  >
                    {p.num}
                  </span>
                  <div>
                    <p
                      className="font-serif"
                      style={{ fontSize: '19px', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3, color: 'var(--text-primary)' }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '13px', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)',
                      }}
                    >
                      {p.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* § 03 — Methods & Tooling */}
          <div style={{ paddingTop: '36px' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.16em', margin: '0 0 24px', color: 'var(--text-muted)',
              }}
            >
              § 03 — Methods &amp; Tooling
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {METHODS.map((m) => (
                <span
                  key={m}
                  style={{
                    fontSize: '13px', padding: '7px 14px',
                    border: '1px solid var(--border)', borderRadius: '9999px',
                    color: 'var(--text-secondary)', opacity: 0.8,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
