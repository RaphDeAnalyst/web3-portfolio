export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          {/* Copyright */}
          <p className="text-sm opacity-50">
            © {currentYear} Matthew Raphael
          </p>

          {/* Social Links */}
          <div className="flex gap-6 text-sm">
            <a
              href="https://github.com/RaphDeAnalyst"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              GitHub ↗
            </a>
            <a
              href="https://twitter.com/matthew_nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Twitter ↗
            </a>
            <a
              href="https://linkedin.com/in/matthew-nnamani"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://dune.com/rraphael"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Dune ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
