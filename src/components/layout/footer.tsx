'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--separator)', padding: '48px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
        <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-muted)' }}>
          © {currentYear} Matthew Raphael
        </p>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="https://x.com/0x_note" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', opacity: 0.6, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}>
            X ↗
          </a>
          <a href="https://github.com/notes0x" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', opacity: 0.6, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}>
            GitHub ↗
          </a>
          <a href="https://dune.com/notes0x" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', opacity: 0.6, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}>
            Dune ↗
          </a>
          <a href="https://linkedin.com/in/matthew-nnamani" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', opacity: 0.6, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}>
            LinkedIn ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
