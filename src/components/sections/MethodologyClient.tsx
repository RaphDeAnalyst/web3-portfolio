'use client'

import Link from 'next/link'

const PHASES = [
  {
    num: '01',
    title: 'Address Clustering & Entity Identification',
    body: 'Every investigation begins with the source address and works outward. I cluster wallets by shared funding sources, timing patterns, and behavioral signatures — identifying whether multiple addresses represent one actor before tracing any further. Entity labels from Arkham and Breadcrumbs are cross-referenced against on-chain behavior rather than accepted at face value.',
    tools: ['Arkham Intelligence', 'Breadcrumbs', 'Etherscan V2', 'BSCScan'],
  },
  {
    num: '02',
    title: 'Transaction Graph Traversal',
    body: 'From the clustered entity, I trace fund flows hop by hop using forward and backward BFS — following both where funds went and where they came from. Custom Python tooling (wallet_investigator.py, multi_hop_tracer.py) automates the traversal across large address sets. All hops are verified against raw chain data, not inferred.',
    tools: ['wallet_investigator.py', 'multi_hop_tracer.py', 'Etherscan V2 API', 'Alchemy RPC', 'DuneSQL'],
  },
  {
    num: '03',
    title: 'Exchange & Bridge Attribution',
    body: 'When funds reach a bridge or exchange, I identify the specific contract, reconstruct the cross-chain transfer using timing and amount matching, and attribute the destination address. Bridge protocols traced include THORChain, deBridge, and Chainflip. Exchange attribution is recorded at the deposit-address level where possible.',
    tools: ['THORChain', 'deBridge', 'Chainflip', 'Etherscan V2', 'BSCScan', 'Alchemy RPC'],
  },
  {
    num: '04',
    title: 'Reporting & Confidence Grading',
    body: 'Findings are written up as structured intelligence briefs. Every claim is graded: Confirmed (directly verifiable on-chain), Probable (consistent with evidence, alternative explanation possible), or Unconfirmed (hypothesis requiring further data). Nothing is collapsed into a single verdict. Reports are delivered as PDF for formal investigations and as structured markdown write-ups on this site.',
    tools: ['PDF (formal delivery)', 'Markdown (site write-ups)'],
  },
]

export function MethodologyClient() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px - var(--safe-area-top))', padding: '88px 32px 80px' }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>

        {/* Back */}
        <Link
          href="/about"
          className="link-fade"
          style={{ fontSize: '14px', display: 'inline-block', marginBottom: '28px', color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          ← About
        </Link>

        {/* Header */}
        <h1
          className="font-serif"
          style={{ fontWeight: 700, fontSize: 'clamp(28px, 5vw, 40px)', margin: '0 0 12px', lineHeight: 1.1, color: 'var(--text-primary)' }}
        >
          Methodology
        </h1>
        <p style={{ fontSize: '16px', lineHeight: 1.65, margin: '0 0 20px', color: 'var(--text-secondary)' }}>
          How I investigate on-chain financial crime — from initial address to attributed entity.
        </p>
        <p
          className="font-serif"
          style={{ fontSize: '16px', lineHeight: 1.6, margin: '0 0 32px', color: 'var(--text-secondary)', fontStyle: 'italic' }}
        >
          Assert only what the data supports.
        </p>

        {/* Phases */}
        <div>
          {PHASES.map((phase) => (
            <div
              key={phase.num}
              style={{ borderTop: '1px solid var(--card-border)', paddingTop: '28px', marginBottom: '28px' }}
            >
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px', textTransform: 'uppercase',
                  letterSpacing: '0.14em', margin: '0 0 8px',
                  color: 'var(--accent)',
                }}
              >
                Phase {phase.num}
              </p>
              <h2
                className="font-serif"
                style={{ fontWeight: 700, fontSize: '20px', margin: '0 0 14px', lineHeight: 1.3, color: 'var(--text-primary)' }}
              >
                {phase.title}
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, margin: '0 0 18px', color: 'var(--text-secondary)' }}>
                {phase.body}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginRight: '4px',
                    color: 'var(--text-muted)',
                  }}
                >
                  Tools
                </span>
                {phase.tools.map((tool) => (
                  <span
                    key={tool}
                    style={{
                      fontSize: '12px', padding: '4px 10px',
                      border: '1px solid var(--card-border)', borderRadius: '9999px',
                      color: 'var(--text-secondary)', opacity: 0.8,
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Closing note */}
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '28px' }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.16em', margin: '0 0 16px', color: 'var(--text-muted)',
            }}
          >
            A Note on Confidence
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
            On-chain data is immutable but interpretation is not. The confirmed / probable / unconfirmed framework exists because collapsing uncertain findings into confident verdicts causes real harm — to investigations, to subjects, and to the credibility of the analysis. Every claim in every write-up on this site is graded. When I don&apos;t know, I say so.
          </p>
        </div>

      </div>
    </div>
  )
}
