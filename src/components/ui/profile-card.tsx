'use client'

import { useState } from 'react'

export function ProfileCard() {
  const [isFlipped, setIsFlipped] = useState(false)

  const achievements = [
    { label: 'Dune Dashboards Created', value: '8+' },
    { label: 'DeFi Volume Tracked', value: '$100M+' },
    { label: 'Data Analytics Experience', value: '3+ Years' },
    { label: 'Web3 Projects Completed', value: '15+' }
  ]

  const socialLinks = [
    { 
      label: 'GitHub', 
      href: 'https://github.com', 
      color: 'gray-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: 'Twitter', 
      href: 'https://twitter.com', 
      color: 'blue-500',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    { 
      label: 'LinkedIn', 
      href: 'https://linkedin.com', 
      color: 'blue-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: 'Telegram', 
      href: 'https://t.me/web3_analyst', 
      color: 'blue-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.567 6.812l-1.773 8.367c-.133.593-.48.74-.973.46l-2.687-1.98-1.297 1.247c-.143.143-.263.263-.54.263l.193-2.74L14.856 6.8c.214-.19-.047-.297-.333-.107l-6.823 4.297L5.063 9.977c-.58-.18-.59-.58.12-.86l10.697-4.123c.483-.177.907.107.75.818z"/>
        </svg>
      )
    }
  ]

  return (
    <div className="relative h-[600px] perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-primary-500/10 via-cyber-500/5 to-purple-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 cyber-grid opacity-10"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-8">
              {/* Profile Image Placeholder */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white text-6xl font-bold shadow-2xl shadow-primary-500/30">
                  W3
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-cyber-500 rounded-full blur opacity-20 animate-pulse"></div>
                
                {/* Status Indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyber-500 rounded-full border-4 border-background flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  Web3 Developer
                </h2>
                <p className="text-xl text-gradient font-medium">
                  Data & AI Specialist
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
                  <div className="w-2 h-2 bg-cyber-500 rounded-full animate-pulse"></div>
                  <span>Available for Projects</span>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-foreground/70">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Nigeria • Working Globally</span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-3">
                  <a href="/contact">
                    <button className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white text-sm font-medium hover:scale-105 transition-transform duration-200">
                      Hire Me
                    </button>
                  </a>
                  <button 
                    onClick={() => setIsFlipped(true)}
                    className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-foreground text-sm font-medium hover:border-cyber-500 transition-colors duration-200"
                  >
                    More Info
                  </button>
                </div>
              </div>
            </div>

            {/* Flip Indicator */}
            <div className="absolute bottom-4 right-4 text-foreground/40 text-xs flex items-center space-x-1">
              <span>Click "More Info" to flip</span>
              <span className="text-cyber-500">↻</span>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-primary-500/5 to-cyber-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 cyber-grid opacity-10"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Achievements</h3>
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-foreground hover:border-cyber-500 transition-colors duration-200"
                >
                  ←
                </button>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 gap-4 flex-1">
                {achievements.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30 hover:bg-background/50 transition-colors duration-200"
                  >
                    <div className="text-sm text-foreground/70">{item.label}</div>
                    <div className="text-lg font-bold text-primary-500">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Connect</h4>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 p-3 rounded-lg border border-gray-200/30 dark:border-gray-800/30 bg-background/30 transition-all duration-200 text-sm ${
                        link.color === 'gray-600' ? 'hover:bg-gray-600/10 hover:border-gray-600/30 text-gray-600' :
                        link.color === 'blue-500' ? 'hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-500' :
                        link.color === 'blue-600' ? 'hover:bg-blue-600/10 hover:border-blue-600/30 text-blue-600' :
                        'hover:bg-blue-400/10 hover:border-blue-400/30 text-blue-400'
                      }`}
                    >
                      {link.icon}
                      <span className="text-foreground/80 font-medium">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}