import Link from 'next/link'
import type { Project } from '@/lib/project-service-supabase'

/** Deterministic seeded LCG for reproducible node graphs */
function mkGraph(seed: number, w = 120, h = 80, n = 9) {
  let s = seed
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }

  const pad = 10
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    pts.push([pad + rnd() * (w - 2 * pad), pad + rnd() * (h - 2 * pad)])
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

  const flaggedIdx = Math.floor(rnd() * n)

  return { pts, edges, flaggedIdx, w, h }
}

function MiniGraph({ seed }: { seed: number }) {
  const { pts, edges, flaggedIdx, w, h } = mkGraph(seed)
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      {edges.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={pts[a][0]} y1={pts[a][1]}
          x2={pts[b][0]} y2={pts[b][1]}
          stroke="currentColor" strokeWidth={0.7} strokeOpacity={0.5}
        />
      ))}
      {pts.map((p, i) => (
        <circle
          key={`n${i}`}
          cx={p[0]} cy={p[1]}
          r={i === flaggedIdx ? 3 : 2}
          fill={i === flaggedIdx ? 'var(--accent)' : 'currentColor'}
          opacity={i === flaggedIdx ? 0.9 : 0.7}
        />
      ))}
    </svg>
  )
}

interface WorkRowProps {
  project: Project
  index: number
}

export function WorkRow({ project, index }: WorkRowProps) {
  const serial = String(index + 1).padStart(2, '0')
  const seed = (index * 37 + 11)

  return (
    <Link
      href={`/work/${project.id}`}
      className="work-ledger-row group"
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 96px 1fr auto',
        gap: '28px',
        alignItems: 'center',
        padding: '28px 12px',
        borderTop: '1px solid var(--separator)',
        textDecoration: 'none',
        transition: 'background .15s',
      }}
    >
      {/* Serial number */}
      <span
        className="font-serif"
        style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1 }}
      >
        {serial}
      </span>

      {/* Mini graph thumbnail */}
      <div
        className="work-ledger-graph"
        style={{
          width: '96px', height: '64px',
          border: '1px solid var(--border)', borderRadius: '2px',
          background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <MiniGraph seed={seed} />
      </div>

      {/* Title + meta + description */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <h2
            className="font-serif"
            style={{ fontWeight: 700, fontSize: '21px', margin: 0, color: 'var(--text-primary)' }}
          >
            {project.title}
          </h2>
          {project.category && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '2px 8px', border: '1px solid var(--border)',
                borderRadius: '9999px', color: 'var(--text-muted)',
              }}
            >
              {project.category}
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px', letterSpacing: '0.06em',
            margin: '0 0 10px', color: 'var(--text-muted)', textTransform: 'uppercase',
          }}
        >
          {project.tech_stack?.slice(0, 2).join(' · ')}
        </p>
        <p
          style={{
            fontSize: '14px', lineHeight: 1.6, margin: 0,
            color: 'var(--text-secondary)', maxWidth: '560px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Right: PDF badge + tags */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
          {project.file_url && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px', border: '1px solid var(--border)',
                borderRadius: '2px', padding: '1px 6px', opacity: 0.55,
                color: 'var(--text-secondary)',
              }}
            >
              PDF
            </span>
          )}
          <span style={{ fontSize: '16px', opacity: 0.4 }}>↗</span>
        </div>
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', maxWidth: '220px' }}>
            {project.tech_stack.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '11px', padding: '3px 9px',
                  border: '1px solid var(--border)', borderRadius: '9999px',
                  color: 'var(--text-secondary)', opacity: 0.6,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
