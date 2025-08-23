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
          📧
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
              icon: '⚡', 
              title: 'Weekly Insights', 
              description: 'Deep dives into Web3 trends and opportunities' 
            },
            { 
              icon: '📊', 
              title: 'Market Analysis', 
              description: 'Data-driven insights on crypto and DeFi markets' 
            },
            { 
              icon: '🤖', 
              title: 'AI + Web3', 
              description: 'Latest developments in AI-powered blockchain tools' 
            }
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-2xl">{feature.icon}</div>
              <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
              <p className="text-xs text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-foreground/50 mt-6">
          No spam, ever. Unsubscribe at any time. Read our{' '}
          <a href="#" className="text-cyber-500 hover:underline">privacy policy</a>.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-cyber-500 opacity-40 animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-primary-500 opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  )
}