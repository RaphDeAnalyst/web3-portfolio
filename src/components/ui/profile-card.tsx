'use client'

import { useState } from 'react'

export function ProfileCard() {
  const [isFlipped, setIsFlipped] = useState(false)

  const achievements = [
    { icon: '🏆', label: 'Web3 Projects', value: '50+' },
    { icon: '📊', label: 'Data Analyzed', value: '$2M+' },
    { icon: '🤖', label: 'AI Models', value: '10+' },
    { icon: '⚡', label: 'Years Experience', value: '5+' }
  ]

  const socialLinks = [
    { icon: '⚡', label: 'GitHub', href: '#', color: 'gray-600' },
    { icon: '🐦', label: 'Twitter', href: '#', color: 'blue-500' },
    { icon: '💼', label: 'LinkedIn', href: '#', color: 'blue-600' },
    { icon: '🌐', label: 'ENS', href: '#', color: 'purple-500' }
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
                  <span className="text-lg">🌍</span>
                  <span>Nigeria • Working Globally</span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-3">
                  <button className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white text-sm font-medium hover:scale-105 transition-transform duration-200">
                    Hire Me
                  </button>
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
            <div className="relative z-10 h-full flex flex-col space-y-6">
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
              <div className="grid grid-cols-2 gap-4 flex-1">
                {achievements.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30 text-center space-y-2 hover:bg-background/50 transition-colors duration-200"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div className="text-lg font-bold text-foreground">{item.value}</div>
                    <div className="text-xs text-foreground/60">{item.label}</div>
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
                      className={`flex items-center space-x-3 p-3 rounded-lg border border-gray-200/30 dark:border-gray-800/30 bg-background/30 transition-all duration-200 text-sm ${
                        link.color === 'gray-600' ? 'hover:bg-gray-600/10 hover:border-gray-600/30' :
                        link.color === 'blue-500' ? 'hover:bg-blue-500/10 hover:border-blue-500/30' :
                        link.color === 'blue-600' ? 'hover:bg-blue-600/10 hover:border-blue-600/30' :
                        'hover:bg-purple-500/10 hover:border-purple-500/30'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="text-foreground/80">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div className="pt-4 border-t border-gray-200/30 dark:border-gray-800/30">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Core Values</h4>
                <div className="flex flex-wrap gap-2">
                  {['Transparency', 'Decentralization', 'Innovation'].map((value) => (
                    <span 
                      key={value} 
                      className="px-3 py-1 rounded-full bg-cyber-500/10 text-cyber-500 text-xs font-medium"
                    >
                      {value}
                    </span>
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