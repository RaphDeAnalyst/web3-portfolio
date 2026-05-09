'use client'

export function AboutClient() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Section 1 — Introduction */}
        <div className="mb-8 pb-8 page-header" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
          <div className="flex gap-6 items-start mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-16 h-16 about-avatar rounded-full flex items-center justify-center font-serif text-lg font-bold"
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
            On-chain investigator and AML compliance analyst conducting fund tracing, KYT/transaction monitoring, and financial crime investigations across EVM chains since 2024. Applies FATF, OFAC, and FinCEN frameworks to real casework.
          </p>
        </div>

        {/* Section 2 — Principles */}
        <div className="mb-8 pb-8" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
          <p className="text-xs font-mono uppercase tracking-wider mb-8" style={{ color: 'var(--text-muted)' }}>Principles</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div>
              <p className="font-serif" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, marginBottom: '0.35rem' }}>
                Assert only what the data supports.
              </p>
              <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '1.25rem' }}>
                CONFIRMED, PROBABLE, UNCONFIRMED — never collapsed into one.
              </p>
            </div>

            <div>
              <p className="font-serif" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, marginBottom: '0.35rem' }}>
                Slow movement beats no movement.
              </p>
              <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '1.25rem' }}>
                A logged blocker is progress. An abandoned thread is not.
              </p>
            </div>

            <div>
              <p className="font-serif" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, marginBottom: '0.35rem' }}>
                The exit matters as much as the source.
              </p>
              <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '1.25rem' }}>
                Following funds to a cash-out endpoint is not enough —<br />
                the regulatory posture of that endpoint is part of the finding.
              </p>
            </div>

            <div>
              <p className="font-serif" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, marginBottom: '0.35rem' }}>
                Automation leaves fingerprints.
              </p>
              <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '1.25rem' }}>
                21,000 gas, every transaction, every time.<br />
                Determinism is a signature.
              </p>
            </div>

            <div>
              <p className="font-serif" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, marginBottom: '0.35rem' }}>
                {`Label what you don't know.`}
              </p>
              <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '1.25rem' }}>
                An open thread documented is more honest than a conclusion forced.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3 — Methods */}
        <div className="mb-8 pb-8" style={{ borderBottomColor: 'var(--separator)', borderBottomWidth: '1px' }}>
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
              'Trino SQL',
              'Dune Analytics',
              'Python (AI-assisted)',
              'Etherscan V2',
              'BSCScan',
              'Breadcrumbs',
            ].map((method) => (
              <span
                key={method}
                className="method-tag text-xs px-3 py-1.5 transition-opacity hover:opacity-100"
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
          <a
            href="mailto:matthewraphael@matthewraphael.xyz"
            className="font-serif font-bold text-lg no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent block mb-6"
            style={{ color: 'var(--text-primary)', textDecorationColor: 'var(--text-primary)' }}
          >
            matthewraphael@matthewraphael.xyz
          </a>
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
              className="px-4 py-2 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-accent"
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
