'use client'

import { useState } from 'react'

interface SocialLink {
  name: string
  username: string
  url: string
  icon: string
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
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      color: 'gray-600',
      description: 'Open source projects and contributions'
    },
    {
      name: 'Twitter',
      username: '@matthew_nnamani',
      url: 'https://twitter.com/matthew_nnamani',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      color: 'blue-500',
      description: 'Web3 insights and market analysis'
    },
    {
      name: 'LinkedIn',
      username: 'matthew-nnamani',
      url: 'https://www.linkedin.com/in/matthew-nnamani',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'blue-600',
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
      color: 'orange-500',
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
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Connect with me <span className="text-gradient">across the Web3 ecosystem</span>
        </h3>
        <p className="text-foreground/70">
          Follow my journey, get updates on projects, or reach out directly
        </p>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              className={`block p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm transition-all duration-300 card-hover ${
                link.color === 'gray-600' ? 'hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-600/20' :
                link.color === 'blue-500' ? 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20' :
                link.color === 'blue-600' ? 'hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/20' :
                link.color === 'purple-500' ? 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20' :
                link.color === 'sky-500' ? 'hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/20' :
                link.color === 'indigo-500' ? 'hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20' :
                link.color === 'green-600' ? 'hover:border-green-600/50 hover:shadow-lg hover:shadow-green-600/20' :
                'hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20'
              }`}
            >
              {/* Background glow */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                link.color === 'gray-600' ? 'bg-gray-600/5' :
                link.color === 'blue-500' ? 'bg-blue-500/5' :
                link.color === 'blue-600' ? 'bg-blue-600/5' :
                link.color === 'purple-500' ? 'bg-purple-500/5' :
                link.color === 'sky-500' ? 'bg-sky-500/5' :
                link.color === 'indigo-500' ? 'bg-indigo-500/5' :
                link.color === 'green-600' ? 'bg-green-600/5' :
                'bg-red-500/5'
              }`}></div>
              
              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 dark:text-gray-300">{link.icon}</div>
                  <div className={`w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${
                    link.color === 'gray-600' ? 'bg-gray-600' :
                    link.color === 'blue-500' ? 'bg-blue-500' :
                    link.color === 'blue-600' ? 'bg-blue-600' :
                    link.color === 'purple-500' ? 'bg-purple-500' :
                    link.color === 'sky-500' ? 'bg-sky-500' :
                    link.color === 'indigo-500' ? 'bg-indigo-500' :
                    link.color === 'green-600' ? 'bg-green-600' :
                    'bg-red-500'
                  }`}></div>
                </div>

                {/* Platform name */}
                <div>
                  <h4 className={`text-lg font-bold text-foreground transition-colors duration-200 ${
                    link.color === 'gray-600' ? 'group-hover:text-gray-600' :
                    link.color === 'blue-500' ? 'group-hover:text-blue-500' :
                    link.color === 'blue-600' ? 'group-hover:text-blue-600' :
                    link.color === 'purple-500' ? 'group-hover:text-purple-500' :
                    link.color === 'sky-500' ? 'group-hover:text-sky-500' :
                    link.color === 'indigo-500' ? 'group-hover:text-indigo-500' :
                    link.color === 'green-600' ? 'group-hover:text-green-600' :
                    'group-hover:text-red-500'
                  }`}>
                    {link.name}
                  </h4>
                  <p className={`text-sm font-medium mt-1 ${
                    link.color === 'gray-600' ? 'text-gray-600/80' :
                    link.color === 'blue-500' ? 'text-blue-500/80' :
                    link.color === 'blue-600' ? 'text-blue-600/80' :
                    link.color === 'purple-500' ? 'text-purple-500/80' :
                    link.color === 'sky-500' ? 'text-sky-500/80' :
                    link.color === 'indigo-500' ? 'text-indigo-500/80' :
                    link.color === 'green-600' ? 'text-green-600/80' :
                    'text-red-500/80'
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
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 ${
                      link.color === 'gray-600' ? 'bg-gray-600/10 text-gray-600 hover:bg-gray-600/20' :
                      link.color === 'blue-500' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' :
                      link.color === 'blue-600' ? 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/20' :
                      link.color === 'purple-500' ? 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' :
                      link.color === 'sky-500' ? 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20' :
                      link.color === 'indigo-500' ? 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20' :
                      link.color === 'green-600' ? 'bg-green-600/10 text-green-600 hover:bg-green-600/20' :
                      'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    }`}
                  >
                    Visit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      handleCopyToClipboard(link.username, link.name)
                    }}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200"
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
                link.color === 'blue-500' ? 'bg-blue-500' :
                link.color === 'blue-600' ? 'bg-blue-600' :
                link.color === 'purple-500' ? 'bg-purple-500' :
                link.color === 'sky-500' ? 'bg-sky-500' :
                link.color === 'indigo-500' ? 'bg-indigo-500' :
                link.color === 'green-600' ? 'bg-green-600' :
                'bg-red-500'
              }`}></div>
            </a>
          </div>
        ))}
      </div>

      {/* Web3-specific features */}
      <div className="mt-12 p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-cyber-500/5 to-primary-500/5 backdrop-blur-sm">
        <h4 className="text-lg font-bold text-foreground mb-6 text-center">
          Web3 Native Features <span className="text-sm font-normal text-foreground/60">(Coming Soon)</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white text-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-foreground">Web3 Messaging</h5>
              <p className="text-xs text-foreground/60">XMTP integration for decentralized messaging</p>
            </div>
          </div>

          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-cyber-500 to-purple-500 flex items-center justify-center text-white text-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512-1.024 1.388-2 3-2s2.488.976 3 2h5l-1 6-1.5 8H8.5L7 9l-1-6z" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-foreground">NFT Business Card</h5>
              <p className="text-xs text-foreground/60">Mint a digital business card NFT</p>
            </div>
          </div>

          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-primary-500 flex items-center justify-center text-white text-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-foreground">Crypto Payments</h5>
              <p className="text-xs text-foreground/60">Accept payments in ETH, USDC, and more</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30">
            Connect Wallet to Unlock
          </button>
        </div>
      </div>
    </div>
  )
}