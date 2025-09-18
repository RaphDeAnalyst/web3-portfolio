'use client'

import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [isEggBroken, setIsEggBroken] = useState(false)

  const handleEggClick = () => {
    if (!isEggBroken) {
      setIsEggBroken(true)
    }
  }

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/RaphDeAnalyst',
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
    <footer className="bg-background-secondary border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col space-y-6 sm:space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          {/* Brand */}
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="text-sm sm:text-base font-medium text-foreground/90 text-center md:text-left">
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
                  className="text-foreground/60 hover:text-primary transition-colors duration-200 group"
                  aria-label={link.name}
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-200 min-w-[36px] min-h-[36px]">
                    <div className="text-foreground/60 group-hover:text-primary">{link.icon}</div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Theme Toggle */}
            <div className="sm:border-l sm:border-border sm:pl-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-foreground/70 text-center md:text-right order-last md:order-none">
            © {currentYear} Built for Web3
          </div>
        </div>

        {/* Interactive Easter Egg */}
        <div className="mt-4 text-center">
          {!isEggBroken ? (
            <button
              onClick={handleEggClick}
              className="group relative inline-flex items-center justify-center space-x-2 p-3 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Click to reveal Easter egg message"
            >
              <span className="text-xl group-hover:animate-bounce group-active:scale-110 transition-transform duration-200">🥚</span>
              <span className="text-[0.8rem] text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors duration-200">Curious?</span>
            </button>
          ) : (
            <div className="inline-flex items-center space-x-2 text-[0.8rem] animate-in fade-in slide-in-from-bottom duration-700">
              <span className="text-xl animate-bounce">🐣</span>
              <span className="text-[#6B7280] font-medium">Built smarter, not harder. Thanks Claude ✨</span>
            </div>
          )}
        </div>

        {/* Web3 tagline */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-foreground/60">
            Decentralized • Transparent • Future-Ready
          </p>
        </div>
      </div>
    </footer>
  )
}