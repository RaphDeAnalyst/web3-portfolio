'use client'

import { useState } from 'react'

interface SocialLink {
  name: string
  username: string
  url: string
  icon: string
  color: string
  description: string
  stats?: {
    followers?: string
    repositories?: string
    contributions?: string
    posts?: string
  }
}

export function SocialLinks() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      username: 'web3-developer',
      url: '#',
      icon: '⚡',
      color: 'gray-600',
      description: 'Open source projects and contributions',
      stats: {
        repositories: '25+',
        contributions: '500+',
      }
    },
    {
      name: 'Twitter',
      username: '@web3_developer',
      url: '#',
      icon: '🐦',
      color: 'blue-500',
      description: 'Web3 insights and market analysis',
      stats: {
        followers: '2.5K+',
        posts: '1.2K+',
      }
    },
    {
      name: 'LinkedIn',
      username: 'web3-data-ai-specialist',
      url: '#',
      icon: '💼',
      color: 'blue-600',
      description: 'Professional network and career updates',
      stats: {
        followers: '1.8K+',
      }
    },
    {
      name: 'ENS Domain',
      username: 'web3dev.eth',
      url: '#',
      icon: '🌐',
      color: 'purple-500',
      description: 'Ethereum Name Service profile',
    },
    {
      name: 'Telegram',
      username: '@web3_developer',
      url: '#',
      icon: '✈️',
      color: 'sky-500',
      description: 'Direct messaging and updates',
    },
    {
      name: 'Discord',
      username: 'web3dev#1234',
      url: '#',
      icon: '🎮',
      color: 'indigo-500',
      description: 'Community discussions and support',
    },
    {
      name: 'Medium',
      username: '@web3developer',
      url: '#',
      icon: '✍️',
      color: 'green-600',
      description: 'Technical articles and tutorials',
      stats: {
        followers: '500+',
      }
    },
    {
      name: 'YouTube',
      username: 'Web3 Developer',
      url: '#',
      icon: '📺',
      color: 'red-500',
      description: 'Educational content and project walkthroughs',
      stats: {
        followers: '1.2K+',
      }
    }
  ]

  const handleCopyToClipboard = async (text: string, name: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      console.log(`Copied ${name}: ${text}`)
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
                  <div className="text-3xl">{link.icon}</div>
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

                {/* Stats */}
                {link.stats && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/30 dark:border-gray-800/30">
                    {Object.entries(link.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className={`text-sm font-bold ${
                          link.color === 'gray-600' ? 'text-gray-600' :
                          link.color === 'blue-500' ? 'text-blue-500' :
                          link.color === 'blue-600' ? 'text-blue-600' :
                          link.color === 'purple-500' ? 'text-purple-500' :
                          link.color === 'sky-500' ? 'text-sky-500' :
                          link.color === 'indigo-500' ? 'text-indigo-500' :
                          link.color === 'green-600' ? 'text-green-600' :
                          'text-red-500'
                        }`}>{value}</div>
                        <div className="text-xs text-foreground/60 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                )}

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
                    Copy
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
          🔗 Web3 Native Features <span className="text-sm font-normal text-foreground/60">(Coming Soon)</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white text-xl">
              💬
            </div>
            <div>
              <h5 className="font-semibold text-foreground">Web3 Messaging</h5>
              <p className="text-xs text-foreground/60">XMTP integration for decentralized messaging</p>
            </div>
          </div>

          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-cyber-500 to-purple-500 flex items-center justify-center text-white text-xl">
              🎁
            </div>
            <div>
              <h5 className="font-semibold text-foreground">NFT Business Card</h5>
              <p className="text-xs text-foreground/60">Mint a digital business card NFT</p>
            </div>
          </div>

          <div className="text-center space-y-3 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-primary-500 flex items-center justify-center text-white text-xl">
              💰
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