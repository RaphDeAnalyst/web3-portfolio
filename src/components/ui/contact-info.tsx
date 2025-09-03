'use client'

import { useState } from 'react'

export function ContactInfo() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

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
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.9.732-1.636 1.636-1.636h.91L12 10.545l9.455-6.724h.909c.904 0 1.636.732 1.636 1.636z"/>
        </svg>
      ),
      color: 'cyber-500',
      action: 'mailto:matthewraphael@matthewraphael.xyz'
    },
    {
      id: 'cal',
      title: 'Schedule Call',
      value: 'calendly.com/matthewraphael',
      description: '30-min strategy sessions available',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple-500',
      action: 'https://calendly.com/web3dev'
    }
  ]

  const availability = [
    {
      timezone: 'UTC',
      hours: '9:00 AM - 6:00 PM',
      status: 'Primary',
      color: 'green-500'
    },
    {
      timezone: 'EST',
      hours: '4:00 AM - 1:00 PM',
      status: 'Available',
      color: 'blue-500'
    },
    {
      timezone: 'PST',
      hours: '1:00 AM - 10:00 AM',
      status: 'Limited',
      color: 'yellow-500'
    }
  ]

  const responseTime = [
    { 
      type: 'Email', 
      time: '< 24 hours', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      type: 'Emergency', 
      time: '< 30 mins', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-8">
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
                method.color === 'cyber-500' ? 'hover:border-cyber-500/50 hover:shadow-lg hover:shadow-cyber-500/20' :
                method.color === 'sky-500' ? 'hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/20' :
                'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  method.color === 'cyber-500' ? 'bg-cyber-500/10 text-cyber-500 group-hover:bg-cyber-500/20' :
                  method.color === 'sky-500' ? 'bg-sky-500/10 text-sky-500 group-hover:bg-sky-500/20' :
                  'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20'
                }`}>
                  {method.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-semibold text-foreground transition-colors duration-200 ${
                      method.color === 'cyber-500' ? 'group-hover:text-cyber-500' :
                      method.color === 'sky-500' ? 'group-hover:text-sky-500' :
                      'group-hover:text-purple-500'
                    }`}>
                      {method.title}
                    </h4>
                    <div className={`w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${
                      method.color === 'cyber-500' ? 'bg-cyber-500' :
                      method.color === 'sky-500' ? 'bg-sky-500' :
                      'bg-purple-500'
                    }`}></div>
                  </div>
                  
                  <p className={`font-medium mb-1 ${
                    method.color === 'cyber-500' ? 'text-cyber-500' :
                    method.color === 'sky-500' ? 'text-sky-500' :
                    'text-purple-500'
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
                        method.color === 'cyber-500' ? 'bg-cyber-500/10 text-cyber-500 hover:bg-cyber-500/20' :
                        method.color === 'sky-500' ? 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20' :
                        'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
                      }`}
                    >
                      Contact
                    </button>
                    <button
                      onClick={() => handleCopy(method.value, method.id)}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200 text-sm font-medium"
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
      <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-cyber-500/5 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-6 h-6 text-primary-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-foreground">Location & Availability</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <h5 className="font-semibold text-foreground mb-3">Based in Nigeria</h5>
            <p className="text-sm text-foreground/70 mb-4">
              Working with clients globally across all time zones. Fluent in English with 
              experience in remote collaboration.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-500 font-medium">Currently Available</span>
            </div>
          </div>

          {/* Timezone Availability */}
          <div>
            <h5 className="font-semibold text-foreground mb-3">Working Hours</h5>
            <div className="space-y-2">
              {availability.map((zone, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      zone.color === 'green-500' ? 'bg-green-500' :
                      zone.color === 'blue-500' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className="text-foreground/80">{zone.timezone}: {zone.hours}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    zone.color === 'green-500' ? 'text-green-500' :
                    zone.color === 'blue-500' ? 'text-blue-500' :
                    'text-yellow-500'
                  }`}>{zone.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Time */}
      <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-6 h-6 text-cyber-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-foreground">Response Times</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {responseTime.map((item, index) => (
            <div key={index} className="text-center p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/50">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-foreground mb-1">{item.type}</div>
              <div className="text-xs text-cyber-500 font-bold">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Offer */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-cyber-500/10 to-primary-500/10 border border-gray-200/50 dark:border-gray-800/50 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
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
            onClick={() => window.open('https://calendly.com/web3dev', '_blank')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30"
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
              <summary className="cursor-pointer p-4 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-background/50 hover:border-cyber-500/50 transition-colors duration-200 font-medium text-foreground">
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