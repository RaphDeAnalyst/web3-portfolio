'use client'

import { useState, useEffect } from 'react'
import { profileService } from '@/lib/service-switcher'
import { logger } from '@/lib/logger'
import { Mail } from 'lucide-react'

export function ProfileCard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsHydrated(true)
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        logger.error('Error loading profile in ProfileCard:', error)
      } finally {
        setLoading(false)
      }
    }

    // Use requestIdleCallback to defer profile loading
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        loadProfile()
      }, { timeout: 2000 })

      return () => {
        if (idleCallback) {
          window.cancelIdleCallback(idleCallback)
        }
      }
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(loadProfile, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  const aboutInfo = {
    whoIAm: [
      'Matthew Raphael - Web3 Data Analyst since 2022',
      'Skills: SQL · Python · Dune · Smart Contracts',
      'Open to remote projects, working globally'
    ],
    vision: '"Every block has a story. I specialize in uncovering it."'
  }

  const [socialLinks, setSocialLinks] = useState<any[]>([])

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const links = await profileService.getSocialLinks()
        const formattedLinks = links.map((link: any) => {
          let color = 'gray-600'
          let icon = null

          switch (link.name) {
            case 'GitHub':
              color = 'gray-600'
              icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              )
              break
            case 'Twitter':
              color = 'gray-600'
              icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              )
              break
            case 'LinkedIn':
              color = 'gray-700'
              icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              )
              break
            case 'Dune':
              color = 'gray-500'
              icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              )
              break
          }

          return {
            label: link.name,
            href: link.url,
            color,
            icon
          }
        })
        setSocialLinks(formattedLinks)
      } catch (error) {
        logger.error('Error loading social links:', error)
      }
    }

    // Use requestIdleCallback to defer social links loading
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        loadSocialLinks()
      }, { timeout: 3000 })

      return () => {
        if (idleCallback) {
          window.cancelIdleCallback(idleCallback)
        }
      }
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(loadSocialLinks, 200)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="relative h-[500px] sm:h-[600px] perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-gray-500/10 via-gray-400/5 to-gray-600/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 cyber-grid opacity-10"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-8">
              {/* Profile Image */}
              <div className="relative">
                {loading ? (
                  <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                ) : isHydrated && profile?.avatar && profile.avatar !== '/avatar.jpg' && profile.avatar.startsWith('http') ? (
                  <img
                    src={profile.avatar}
                    alt={`${profile?.name || 'Matthew Raphael'} - Web3 Data Analyst specializing in blockchain analytics, DeFi research, and on-chain data analysis`}
                    loading="lazy"
                    className="w-40 h-40 rounded-full object-cover shadow-2xl shadow-primary-500/30 border-4 border-gradient-to-r border-transparent bg-gradient-to-r from-primary-500 to-cyber-500"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-accent-blue flex items-center justify-center text-white text-6xl font-bold shadow-2xl shadow-accent-blue/30">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'MR'}
                  </div>
                )}
                
                {/* Status Indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyber-500 rounded-full border-4 border-background flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  {loading ? (
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto"></div>
                  ) : (
                    profile?.name || 'Matthew Raphael'
                  )}
                </h2>
                <p className="text-xl text-gradient font-medium">
                  {loading ? (
                    <div className="h-6 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto"></div>
                  ) : (
                    profile?.title || 'Web3 Data & AI Specialist'
                  )}
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
                  <span>{profile?.location || 'Remote'} • Working Globally</span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-3">
                  <a href="/contact">
                    <button className="px-6 py-2 rounded-storj bg-storj-navy text-white text-sm font-medium hover:bg-storj-blue hover:transform hover:translate-y-[-1px] shadow-lg shadow-storj-navy/20 transition-all duration-200">
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
              <span>Click &quot;More Info&quot; to flip</span>
              <span className="text-cyber-500">↻</span>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-gray-600/10 via-gray-500/5 to-gray-400/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 cyber-grid opacity-10"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">About Me</h3>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-foreground hover:border-cyber-500 transition-colors duration-200"
                >
                  ←
                </button>
              </div>

              {/* Who I Am Section */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Who I Am</h4>
                <div className="space-y-1 sm:space-y-2">
                  {aboutInfo.whoIAm.map((item, index) => (
                    <div key={index} className="text-sm sm:text-sm text-foreground/80 leading-relaxed">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* My Vision Section */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">My Vision</h4>
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-cyber-500/10 border border-primary-500/20">
                  <p className="text-xs sm:text-sm text-foreground/90 italic text-center leading-relaxed">
                    {aboutInfo.vision}
                  </p>
                </div>
              </div>

              {/* Social Links & Contact */}
              <div className="space-y-3 sm:space-y-4">
                {/* Social Links */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Connect</h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg border border-gray-200/30 dark:border-gray-800/30 bg-background/30 transition-all duration-200 text-xs ${
                          link.color === 'gray-600' ? 'hover:bg-gray-600/10 hover:border-gray-600/30 text-gray-600' :
                          link.color === 'gray-700' ? 'hover:bg-gray-700/10 hover:border-gray-700/30 text-gray-700' :
                          link.color === 'gray-500' ? 'hover:bg-gray-500/10 hover:border-gray-500/30 text-gray-500' :
                          'hover:bg-gray-500/10 hover:border-gray-500/30 text-gray-500'
                        }`}
                      >
                        {link.icon}
                        <span className="text-foreground/80 font-medium text-xs">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="pt-1">
                  <a
                    href={`mailto:${profile?.email || 'matthewraphael@matthewraphael.xyz'}`}
                    className="w-full flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-storj bg-storj-navy text-white font-semibold hover:bg-storj-blue hover:transform hover:translate-y-[-1px] shadow-lg shadow-storj-navy/20 transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Hire Me</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}