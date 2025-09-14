import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/RaphDeAnalayst',
      icon: <Github className="w-4 h-4" />
    },
    {
      name: 'Twitter/X',
      href: 'https://twitter.com/matthew_nnamani',
      icon: <Twitter className="w-4 h-4" />
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/matthew-nnamani',
      icon: <Linkedin className="w-4 h-4" />
    },
    {
      name: 'Dune Analytics',
      href: 'https://dune.com/raphdeanalyst',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      )
    },
  ]

  return (
    <footer className="bg-background border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground/80">
              Matthew Raphael - Web3 Analytics
            </span>
          </div>

          {/* Center section with social links and theme toggle */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            {/* Social Links */}
            <div className="flex items-center justify-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/60 hover:text-cyber-500 transition-colors duration-200 group"
                  aria-label={link.name}
                >
                  <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center group-hover:border-cyber-500 group-hover:bg-cyber-500/10 transition-all duration-200">
                    <div className="text-foreground/60">{link.icon}</div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Theme Toggle */}
            <div className="border-l border-gray-200 dark:border-gray-800 pl-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-foreground/60">
            © {currentYear} Built for Web3
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