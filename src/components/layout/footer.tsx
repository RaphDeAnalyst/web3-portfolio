export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          {/* Copyright */}
          <p className="text-sm opacity-60">
            © {currentYear} Matthew Raphael
          </p>

          {/* Social Links */}
          <div className="flex gap-6 text-sm">
            <a
              href="https://x.com/0x_note"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              X ↗
            </a>
            <a
              href="https://github.com/notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              GitHub ↗
            </a>
            <a
              href="https://dune.com/notes0x"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Dune ↗
            </a>
            <a
              href="https://linkedin.com/in/matthew-nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
