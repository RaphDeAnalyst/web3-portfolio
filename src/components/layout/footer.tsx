export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 mt-20" style={{ borderTopColor: 'var(--separator)', borderTopWidth: '1px' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          {/* Copyright */}
          <p className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
            © {currentYear} Matthew Raphael
          </p>

          {/* Social Links */}
          <div className="flex gap-6 text-sm">
            <a
              href="https://x.com/0x_note"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
            >
              X ↗
            </a>
            <a
              href="https://github.com/notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
            >
              GitHub ↗
            </a>
            <a
              href="https://dune.com/notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
            >
              Dune ↗
            </a>
            <a
              href="https://linkedin.com/in/matthew-nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
