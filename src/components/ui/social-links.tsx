'use client'

import { useState } from 'react'
import { Github, Twitter, Linkedin, MessageCircle, CreditCard, Award } from 'lucide-react'

interface SocialLink {
  name: string
  username: string
  url: string
  icon: React.ReactElement
  color: string
  description: string
}

export function SocialLinks() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      username: 'RaphDeAnalayst',
      url: 'https://github.com/RaphDeAnalayst',
      icon: <Github className="w-8 h-8" />,
      color: 'gray-600',
      description: 'Open source projects and contributions'
    },
    {
      name: 'Twitter',
      username: '@matthew_nnamani',
      url: 'https://twitter.com/matthew_nnamani',
      icon: <Twitter className="w-8 h-8" />,
      color: 'gray-600',
      description: 'Web3 insights and market analysis'
    },
    {
      name: 'LinkedIn',
      username: 'matthew-nnamani',
      url: 'https://www.linkedin.com/in/matthew-nnamani',
      icon: <Linkedin className="w-8 h-8" />,
      color: 'gray-700',
      description: 'Professional network and career updates'
    },
    {
      name: 'Dune Analytics',
      username: 'raphdeanalyst',
      url: 'https://dune.com/raphdeanalyst',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      color: 'gray-500',
      description: 'Blockchain analytics dashboards and queries'
    },
  ]

  const handleCopyToClipboard = async (text: string, name: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(name)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
          Connect with me <span className="text-gradient">across the Web3 ecosystem</span>
        </h3>
        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
          Follow my journey, get updates on projects, or reach out directly
        </p>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {socialLinks.map((link) => (
          <div
            key={link.name}
            className="group relative"
            onMouseEnter={() => setHoveredLink(link.name)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm transition-all duration-300 card-hover ${
                link.color === 'gray-600' ? 'hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-600/20' :
                link.color === 'gray-600' ? 'hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-600/20' :
                link.color === 'gray-700' ? 'hover:border-gray-700/50 hover:shadow-lg hover:shadow-gray-700/20' :
                link.color === 'gray-500' ? 'hover:border-gray-500/50 hover:shadow-lg hover:shadow-gray-500/20' :
                'hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-600/20'
              }`}
            >
              {/* Background glow */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                link.color === 'gray-600' ? 'bg-gray-600/5' :
                link.color === 'gray-600' ? 'bg-gray-600/5' :
                link.color === 'gray-700' ? 'bg-gray-700/5' :
                link.color === 'gray-500' ? 'bg-gray-500/5' :
                'bg-gray-600/5'
              }`}></div>
              
              {/* Content */}
              <div className="relative z-10 space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 dark:text-gray-300">
                    <div className="w-6 h-6 sm:w-8 sm:h-8">
                      {link.icon}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${
                    link.color === 'gray-600' ? 'bg-gray-600' :
                    link.color === 'gray-600' ? 'bg-gray-600' :
                    link.color === 'gray-700' ? 'bg-gray-700' :
                    link.color === 'gray-500' ? 'bg-gray-500' :
                    'bg-gray-600'
                  }`}></div>
                </div>

                {/* Platform name */}
                <div>
                  <h4 className={`text-base sm:text-lg font-bold text-foreground transition-colors duration-200 leading-tight ${
                    link.color === 'gray-600' ? 'group-hover:text-gray-600' :
                    link.color === 'gray-600' ? 'group-hover:text-gray-600' :
                    link.color === 'gray-700' ? 'group-hover:text-gray-700' :
                    link.color === 'gray-500' ? 'group-hover:text-gray-500' :
                    'group-hover:text-gray-600'
                  }`}>
                    {link.name}
                  </h4>
                  <p className={`text-xs sm:text-sm font-medium mt-1 ${
                    link.color === 'gray-600' ? 'text-gray-600/80' :
                    link.color === 'gray-600' ? 'text-gray-600/80' :
                    link.color === 'gray-700' ? 'text-gray-700/80' :
                    link.color === 'gray-500' ? 'text-gray-500/80' :
                    'text-gray-600/80'
                  }`}>
                    {link.username}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-foreground/60 leading-relaxed">
                  {link.description}
                </p>


                {/* Action buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(link.url, '_blank')
                    }}
                    className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px] ${
                      link.color === 'gray-600' ? 'bg-gray-600/10 text-gray-600 hover:bg-gray-600/20' :
                      link.color === 'gray-600' ? 'bg-gray-600/10 text-gray-600 hover:bg-gray-600/20' :
                      link.color === 'gray-700' ? 'bg-gray-700/10 text-gray-700 hover:bg-gray-700/20' :
                      link.color === 'gray-500' ? 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20' :
                      'bg-gray-600/10 text-gray-600 hover:bg-gray-600/20'
                    }`}
                  >
                    Visit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleCopyToClipboard(link.username, link.name)
                    }}
                    className="px-3 py-3 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200 min-h-[44px] min-w-[80px]"
                  >
                    {copiedItem === link.name ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Hover indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-0 ${
                hoveredLink === link.name ? 'opacity-100 animate-pulse' : ''
              } transition-opacity duration-200 ${
                link.color === 'gray-600' ? 'bg-gray-600' :
                link.color === 'gray-600' ? 'bg-gray-600' :
                link.color === 'gray-700' ? 'bg-gray-700' :
                link.color === 'gray-500' ? 'bg-gray-500' :
                'bg-gray-600'
              }`}></div>
            </a>
          </div>
        ))}
      </div>

      {/* Web3-specific features */}
      <div className="mt-8 sm:mt-12 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-cyber-500/5 to-primary-500/5 backdrop-blur-sm">
        <h4 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 text-center leading-tight">
          Web3 Native Features <span className="text-sm font-normal text-foreground/60">(Coming Soon)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-accent-blue flex items-center justify-center text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground">Web3 Messaging</h5>
              <p className="text-xs text-foreground/60">XMTP integration for decentralized messaging</p>
            </div>
          </div>

          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground">NFT Business Card</h5>
              <p className="text-xs text-foreground/60">Mint a digital business card NFT</p>
            </div>
          </div>

          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center text-white">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground">Crypto Payments</h5>
              <p className="text-xs text-foreground/60">Accept payments in ETH, USDC, and more</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="w-full sm:w-auto px-6 py-3 rounded-storj bg-storj-navy text-white font-medium hover:bg-storj-blue hover:transform hover:translate-y-[-1px] shadow-lg shadow-storj-navy/20 transition-all duration-200 min-h-[48px]">
            Connect Wallet to Unlock
          </button>
        </div>
      </div>
    </div>
  )
}