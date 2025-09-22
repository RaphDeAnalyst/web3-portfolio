'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Github, Twitter, Linkedin, Sparkles } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [isEggBroken, setIsEggBroken] = useState(false)

  const handleEggClick = () => {
    if (!isEggBroken) {
      setIsEggBroken(true)
    }
  }

  const navigationLinks = [
    {
      name: 'About Matthew Raphael',
      href: '/about',
      description: 'Learn about my Web3 data analytics journey'
    },
    {
      name: 'Portfolio Projects',
      href: '/portfolio',
      description: 'Explore my blockchain analytics work'
    },
    {
      name: 'Blog & Insights',
      href: '/blog',
      description: 'Read my Web3 analysis and research'
    },
    {
      name: 'Contact & Collaboration',
      href: '/contact',
      description: 'Let\'s work together on your Web3 project'
    },
  ]

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
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Matthew Raphael
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Web3 Data Analyst specializing in blockchain analytics, DeFi protocols, and on-chain insights. Transitioning traditional data skills to decentralized finance.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              Explore My Work
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {navigationLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="group block hover:text-primary transition-colors duration-200"
                  >
                    <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {link.name}
                    </h5>
                    <p className="text-xs text-foreground/60 mt-1 group-hover:text-foreground/80 transition-colors duration-200">
                      {link.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links & Theme */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              Connect
            </h4>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-foreground/60 hover:text-primary transition-colors duration-200 group"
                    aria-label={link.name}
                    title={link.name}
                  >
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-200">
                      <div className="text-foreground/60 group-hover:text-primary">{link.icon}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="pt-2 border-t border-border">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-border space-y-4 sm:space-y-0">
          <div className="text-sm text-foreground/70">
            © {currentYear} Matthew Raphael. Built for Web3.
          </div>
          <div className="text-xs text-foreground/60">
            Decentralized • Transparent • Future-Ready
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
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-[0.8rem] animate-in fade-in slide-in-from-bottom duration-700">
              <span className="text-xl animate-bounce">🐣</span>
              <div className="text-center sm:text-left">
                <span className="text-[#6B7280] font-medium">This website was built smarter, not harder.</span>
                <br className="sm:hidden" />
                <span className="text-[#6B7280] font-medium sm:ml-1 flex items-center gap-1">
                  Thanks Claude
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>
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