'use client'

import Link from 'next/link'

/** Deterministic LCG random — same seed always produces same graph */
function buildNodeGraph({
  width, height, numNodes, seed, lineOpacity = 0.55, nodeRadius = 2.6,
}: {
  width: number; height: number; numNodes: number; seed: number
  lineOpacity?: number; nodeRadius?: number
}) {
  let s = seed
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }

  const pad = 28
  const pts: [number, number][] = []
  for (let i = 0; i < numNodes; i++) {
    pts.push([pad + rnd() * (width - 2 * pad), pad + rnd() * (height - 2 * pad)])
  }

  const order = pts.map((_, i) => i).sort((a, b) => pts[a][0] - pts[b][0])
  const seen: Record<string, boolean> = {}
  const edges: [number, number][] = []
  const addEdge = (a: number, b: number) => {
    if (a === b) return
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (!seen[key]) { seen[key] = true; edges.push([a, b]) }
  }
  for (let k = 0; k < order.length - 1; k++) {
    addEdge(order[k], order[k + 1])
    if (k + 2 < order.length && rnd() < 0.45) addEdge(order[k], order[k + 2])
  }

  return { pts, edges }
}

function AmbientGraph() {
  const { pts, edges } = buildNodeGraph({ width: 700, height: 640, numNodes: 26, seed: 11 })

  return (
    <svg
      viewBox="0 0 700 640"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block' }}
    >
      {edges.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={pts[a][0]} y1={pts[a][1]}
          x2={pts[b][0]} y2={pts[b][1]}
          stroke="currentColor" strokeWidth={0.6} strokeOpacity={0.7}
        />
      ))}
      {pts.map((p, i) => (
        <circle key={`n${i}`} cx={p[0]} cy={p[1]} r={2.6} fill="currentColor" />
      ))}
    </svg>
  )
}

const CHAINS = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Base', 'Optimism', 'Mantle', 'Monad']

export function HeroSection() {
  return (
    <section
      className="hero-ed"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px - var(--safe-area-top))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 32px 64px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient node-graph — right half, very faint */}
      <div
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%',
          opacity: 0.055, pointerEvents: 'none', color: 'var(--text-primary)',
        }}
      >
        <AmbientGraph />
      </div>

      {/* Vertical side rail — hidden below 900px */}
      <div
        className="hero-rail mono"
        style={{
          position: 'absolute', left: '18px', top: '50%',
          transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px', letterSpacing: '0.25em',
          color: 'var(--text-muted)', textTransform: 'uppercase',
        }}
      >
        Forensic Onchain Intelligence
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1080px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>

        {/* Name */}
        <h1
          className="font-serif hero-name"
          style={{
            fontWeight: 700,
            fontSize: 'clamp(48px, 8.5vw, 104px)',
            lineHeight: 1.0,
            margin: 0,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          Matthew Raphael<br />Nnamani
        </h1>

        {/* Tagline */}
        <p
          className="font-serif"
          style={{
            fontWeight: 500,
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            margin: 0,
            color: 'var(--accent)',
            fontStyle: 'italic',
          }}
        >
          Blockchain Intelligence Practitioner
        </p>

        {/* Bio */}
        <p
          style={{
            maxWidth: '600px', fontSize: '17px', lineHeight: 1.65,
            margin: 0, color: 'var(--text-secondary)',
          }}
        >
          I investigate on-chain financial crime, trace fund flows across EVM chains, and produce AML-aligned intelligence.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', paddingTop: '4px' }}>
          <Link
            href="/work"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 26px', border: '1px solid var(--accent)',
              color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', borderRadius: '2px', transition: 'all .15s',
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
            View work →
          </Link>
          <a
            href="https://paragraph.com/@notes0x"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', opacity: 0.75, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75' }}
          >
            Research ↗
          </a>
        </div>

        {/* Chains */}
        <div style={{ marginTop: '24px', paddingTop: '28px', borderTop: '1px solid var(--separator)' }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.16em', margin: '0 0 14px',
              color: 'var(--text-muted)',
            }}
          >
            Chains
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CHAINS.map((chain) => (
              <span
                key={chain}
                style={{
                  fontSize: '12px', padding: '6px 13px',
                  border: '1px solid var(--border)', borderRadius: '9999px',
                  color: 'var(--text-secondary)', opacity: 0.65,
                }}
              >
                {chain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
