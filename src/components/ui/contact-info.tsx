'use client'

import { useState, useEffect } from 'react'
import { profileService } from '@/lib/service-switcher'
import type { ProfileData } from '@/lib/profile-service-supabase'
import { ContactAvatar } from '@/components/ui/profile-avatar'
import { Mail, Calendar, Globe, Zap, CheckCircle } from 'lucide-react'

export function ContactInfo() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const loadProfile = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [])

  const handleCopy = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(item)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const contactMethods = [
    {
      id: 'email',
      title: 'Email',
      value: 'matthewraphael@matthewraphael.xyz',
      description: 'Preferred for business inquiries',
      icon: <Mail className="w-5 h-5" />,
      color: 'primary-500',
      action: 'mailto:matthewraphael@matthewraphael.xyz'
    },
    {
      id: 'cal',
      title: 'Schedule Call',
      value: 'calendly.com/matthewraphael-matthewraphael/30min',
      description: '30-min strategy sessions available',
      icon: <Calendar className="w-5 h-5" />,
      color: 'primary-600',
      action: 'https://calendly.com/matthewraphael-matthewraphael/30min'
    }
  ]

  const availability = [
    {
      timezone: 'WAT (West Africa)',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      status: 'Primary',
      color: 'primary-600'
    },
    {
      timezone: 'Saturday',
      hours: '10:00 AM - 1:00 PM',
      status: 'Limited',
      color: 'primary-400'
    },
    {
      timezone: 'Sunday',
      hours: 'Unavailable',
      status: 'Closed',
      color: 'primary-300'
    }
  ]

  const responseTime = [
    {
      type: 'Email',
      time: '< 24 hours',
      icon: <Mail className="w-4 h-4" />
    },
    {
      type: 'Emergency',
      time: '< 30 mins',
      icon: <Zap className="w-4 h-4" />
    }
  ]

  return (
    <div className="space-y-8">
      {/* Profile Introduction */}
      <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
          {/* Professional Profile Avatar */}
          <ContactAvatar />
          
        </div>
        
        {/* Quick Bio */}
        <p className="text-sm text-foreground/70 leading-relaxed border-t border-gray-200/30 dark:border-gray-800/30 pt-4">
          {profile?.bio || 'Transitioning from traditional data analytics to blockchain insights and Web3 analytics. Known as RaphdeAnalyst, I am passionate about decentralized data and AI-powered blockchain analysis, building the future of Web3 analytics.'}
        </p>
      </div>

      {/* Direct Contact Methods */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-foreground">
          Get in Touch Directly
        </h3>
        
        <div className="space-y-4">
          {contactMethods.map((method) => (
            <div
              key={method.id}
              className={`group p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm transition-all duration-300 ${
                method.color === 'primary-500' ? 'hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20' :
                method.color === 'primary-400' ? 'hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-400/20' :
                'hover:border-primary-600/50 hover:shadow-lg hover:shadow-primary-600/20'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  method.color === 'primary-500' ? 'bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20' :
                  method.color === 'primary-400' ? 'bg-primary-400/10 text-primary-400 group-hover:bg-primary-400/20' :
                  'bg-primary-600/10 text-primary-600 group-hover:bg-primary-600/20'
                }`}>
                  {method.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-semibold text-foreground transition-colors duration-200 ${
                      method.color === 'primary-500' ? 'group-hover:text-primary-500' :
                      method.color === 'primary-400' ? 'group-hover:text-primary-400' :
                      'group-hover:text-primary-600'
                    }`}>
                      {method.title}
                    </h4>
                    <div className={`w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${
                      method.color === 'primary-500' ? 'bg-primary-500' :
                      method.color === 'primary-400' ? 'bg-primary-400' :
                      'bg-primary-600'
                    }`}></div>
                  </div>
                  
                  <p className={`font-medium mb-1 ${
                    method.color === 'primary-500' ? 'text-primary-500' :
                    method.color === 'primary-400' ? 'text-primary-400' :
                    'text-primary-600'
                  }`}>
                    {method.value}
                  </p>
                  
                  <p className="text-sm text-foreground/60 mb-4">
                    {method.description}
                  </p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => window.open(method.action, '_blank')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        method.color === 'primary-500' ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20' :
                        method.color === 'primary-400' ? 'bg-primary-400/10 text-primary-400 hover:bg-primary-400/20' :
                        'bg-primary-600/10 text-primary-600 hover:bg-primary-600/20'
                      }`}
                    >
                      Contact
                    </button>
                    <button
                      onClick={() => handleCopy(method.value, method.id)}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-accent-blue hover:text-accent-blue hover:bg-accent-blue/5 transition-all duration-200 text-sm font-medium shadow-lg shadow-accent-blue/20"
                    >
                      {copiedItem === method.id ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location & Availability */}
      <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-primary-500/5 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-6 h-6 text-primary-500">
            <Globe className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-foreground">Location & Availability</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <h5 className="font-semibold text-foreground mb-3">Working Globally</h5>
            <p className="text-sm text-foreground/70 mb-4">
              Collaborating with clients worldwide across all time zones. Fluent in English with 
              extensive experience in remote Web3 project delivery.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              {(() => {
                const now = new Date()
                const dayOfWeek = now.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
                const currentHour = now.getHours()
                const currentMinute = now.getMinutes()
                const currentTime = currentHour * 60 + currentMinute // Convert to minutes
                
                let status = 'Unavailable'
                let color = 'primary-300'
                let animate = false
                
                if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                  // Monday-Friday: 9:00 AM - 5:00 PM (540-1020 minutes)
                  if (currentTime >= 540 && currentTime <= 1020) {
                    status = 'Currently Available'
                    color = 'primary-600'
                    animate = true
                  } else {
                    status = 'Available Today (9 AM - 5 PM)'
                    color = 'primary-600'
                  }
                } else if (dayOfWeek === 6) {
                  // Saturday: 10:00 AM - 1:00 PM (600-780 minutes)
                  if (currentTime >= 600 && currentTime <= 780) {
                    status = 'Currently Available'
                    color = 'primary-400'
                    animate = true
                  } else {
                    status = 'Limited Today (10 AM - 1 PM)'
                    color = 'primary-400'
                  }
                } else {
                  // Sunday
                  status = 'Unavailable Today'
                  color = 'primary-300'
                }
                
                return (
                  <>
                    <div className={`w-2 h-2 rounded-full bg-${color} ${animate ? 'animate-pulse' : ''}`}></div>
                    <span className={`text-${color} font-medium`}>{status}</span>
                  </>
                )
              })()}
            </div>
          </div>

          {/* Timezone Availability */}
          <div>
            <h5 className="font-semibold text-foreground mb-3">Working Hours</h5>
            <div className="space-y-2">
              {availability.map((zone, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      zone.color === 'primary-600' ? 'bg-primary-600' :
                      zone.color === 'primary-400' ? 'bg-primary-400' :
                      zone.color === 'primary-300' ? 'bg-primary-300' :
                      'bg-primary-400'
                    }`}></div>
                    <span className="text-foreground/80">{zone.timezone}: {zone.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Time */}
      <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-6 h-6 text-primary-500">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-foreground">Response Times</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {responseTime.map((item, index) => (
            <div key={index} className="text-center p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/50">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-foreground mb-1">{item.type}</div>
              <div className="text-xs text-primary-500 font-bold">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Offer */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-500/10 border border-gray-200/50 dark:border-gray-800/50 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-primary-500 flex items-center justify-center text-white">
          <CheckCircle className="w-8 h-8" />
        </div>
        
        <h4 className="text-xl font-bold text-foreground mb-4">
          Free 30-Minute Consultation
        </h4>
        
        <p className="text-foreground/70 mb-6 max-w-md mx-auto">
          Not sure where to start? Book a free consultation call to discuss your Web3 project 
          and get expert guidance on the best approach.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.open('https://calendly.com/matthewraphael-matthewraphael/30min', '_blank')}
            className="px-6 py-3 rounded-lg bg-accent-blue hover:bg-accent-blue-light text-white font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/30"
          >
            Schedule Free Call
          </button>
          
          <div className="text-xs text-foreground/60">
            No strings attached • Perfect for project scoping • Available this week
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-foreground">Common Questions</h4>
        
        <div className="space-y-3">
          {[
            {
              q: "What's your typical project timeline?",
              a: "Most analytics dashboards: 2-4 weeks. Smart contracts: 3-6 weeks. Custom solutions: 1-3 months depending on complexity."
            },
            {
              q: "Do you work with startups?",
              a: "Yes! I offer flexible pricing for early-stage projects and can work with equity arrangements for promising ventures."
            },
            {
              q: "Can you help with ongoing maintenance?",
              a: "Absolutely. I provide maintenance packages and ongoing support for all projects I build."
            }
          ].map((faq, index) => (
            <details key={index} className="group">
              <summary className="cursor-pointer p-4 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-background/50 hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all duration-200 font-medium text-foreground">
                {faq.q}
              </summary>
              <div className="mt-2 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/20 text-sm text-foreground/70">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}