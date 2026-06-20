import Link from 'next/link'
import type { Project } from '@/lib/project-service-supabase'

interface WorkRowProps {
  project: Project
  index: number
}

export function WorkRow({ project, index }: WorkRowProps) {
  const serial = String(index + 1).padStart(2, '0')

  return (
    <Link
      href={`/work/${project.id}`}
      className="work-ledger-row group"
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr auto',
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

      {/* Title + category + description + mobile tag row */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <h2
            className="font-serif work-ledger-h2"
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
            fontSize: '14px', lineHeight: 1.6, margin: 0,
            color: 'var(--text-secondary)', maxWidth: '560px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {project.description}
        </p>
        {/* Mobile-only: PDF badge + tag pills below description (hidden at ≥641px via CSS) */}
        <div className="work-ledger-mobile-meta">
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
          {project.tech_stack?.slice(0, 3).map((tag) => (
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
      </div>

      {/* Right: PDF badge + ↗ + tags (tags hidden on mobile) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
          {project.file_url && (
            <span
              className="work-ledger-pdf"
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
          <div
            className="work-ledger-tags"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', maxWidth: '220px' }}
          >
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
