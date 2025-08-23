export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: '⚡' },
    { name: 'Twitter/X', href: '#', icon: '🐦' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'ENS', href: '#', icon: '🌐' },
  ]

  return (
    <footer className="bg-background border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">W3</span>
            </div>
            <span className="text-sm font-medium text-foreground/80">
              Web3 Data & AI Specialist
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/60 hover:text-cyber-500 transition-colors duration-200 group"
                aria-label={link.name}
              >
                <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center group-hover:border-cyber-500 group-hover:bg-cyber-500/10 transition-all duration-200">
                  <span className="text-sm">{link.icon}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-foreground/60">
            © {currentYear} Built with ❤️ for Web3
          </div>
        </div>

        {/* Web3 tagline */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-foreground/50">
            Decentralized • Transparent • Future-Ready
          </p>
        </div>
      </div>
    </footer>
  )
}