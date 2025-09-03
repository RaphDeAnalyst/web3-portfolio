'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/10 via-cyber-500/10 to-purple-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-5"></div>
      
      {/* Content */}
      <div className="relative z-10 p-12 text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white text-2xl">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Stay Updated with <span className="text-gradient">Web3 Insights</span>
        </h3>
        
        <p className="text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get the latest insights on Web3, AI, and blockchain analytics delivered to your inbox. 
          Join <span className="text-cyber-500 font-medium">2,500+</span> developers and analysts who trust our content.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background/80 backdrop-blur-sm text-foreground focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 transition-all duration-200"
                disabled={isSubmitting || isSubmitted}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isSubmitted 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-primary-500 to-cyber-500 text-white hover:scale-105 shadow-lg shadow-primary-500/30'
              } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
              )}
              {isSubmitted ? '✓ Subscribed!' : isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200/30 dark:border-gray-800/30">
          {[
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ), 
              title: 'Weekly Insights', 
              description: 'Deep dives into Web3 trends and opportunities' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ), 
              title: 'Market Analysis', 
              description: 'Data-driven insights on crypto and DeFi markets' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ), 
              title: 'AI + Web3', 
              description: 'Latest developments in AI-powered blockchain tools' 
            }
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-primary-500">{feature.icon}</div>
              <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
              <p className="text-xs text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-foreground/50 mt-6">
          No spam, ever. Unsubscribe at any time. Read our{' '}
          <a href="/privacy" className="text-cyber-500 hover:underline">privacy policy</a>.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-cyber-500 opacity-40 animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-primary-500 opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  )
}