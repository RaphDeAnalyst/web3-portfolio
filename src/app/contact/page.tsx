'use client'

import { ContactForm } from '@/components/ui/contact-form'
import { ContactInfo } from '@/components/ui/contact-info'
import { SocialLinks } from '@/components/ui/social-links'

export default function Contact() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-yellow-500">Let's Collaborate</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Ready to Build</span>
            <br />
            <span className="text-foreground">Something Amazing?</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Whether you need <span className="text-primary-500 font-medium">analytics dashboards</span>, 
            <span className="text-cyber-500 font-medium"> smart contracts</span>, or 
            <span className="text-purple-500 font-medium"> AI-powered solutions</span>, 
            let's bring your Web3 vision to life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Start Your Project
                  </h2>
                  <p className="text-foreground/70 leading-relaxed">
                    Tell me about your Web3 project and I'll get back to you with a detailed proposal. 
                    The more information you provide, the better I can help you achieve your goals.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info - Takes 1 column */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto py-20">
          <SocialLinks />
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              What Clients <span className="text-gradient">Say</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Success stories from Web3 projects I've helped build
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "DeFi Protocol Founder",
                company: "LiquidityDAO",
                testimonial: "The analytics dashboard completely transformed how we understand our users. ROI was visible within the first month.",
                project: "DeFi Analytics Platform",
                result: "300% increase in user insights"
              },
              {
                name: "Marcus Rodriguez",
                role: "CTO",
                company: "BlockVentures",
                testimonial: "Smart contract security audit caught 3 critical vulnerabilities that could have cost us millions. Exceptional attention to detail.",
                project: "Smart Contract Audit",
                result: "Prevented $2M+ in potential losses"
              },
              {
                name: "Elena Kowalski",
                role: "Head of Data",
                company: "CryptoAnalytica",
                testimonial: "AI prediction models achieved 78% accuracy on price movements. The technical implementation was flawless.",
                project: "AI Price Prediction System", 
                result: "78% prediction accuracy"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm">
                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                  </div>
                  <p className="text-foreground/80 italic leading-relaxed text-sm">
                    "{testimonial.testimonial}"
                  </p>
                </div>
                
                <div className="border-t border-gray-200/30 dark:border-gray-800/30 pt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                      <div className="text-xs text-foreground/60">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-primary-500 font-medium">{testimonial.project}</div>
                    <div className="text-xs text-cyber-500 font-bold">{testimonial.result}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary-500/10 via-cyber-500/10 to-purple-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white text-3xl">
              🚀
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Let's Build the Future Together
            </h2>
            
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Ready to transform your Web3 idea into reality? I'm here to help you navigate 
              the technical challenges and build something extraordinary.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30"
              >
                Start Your Project
              </button>
              <button 
                onClick={() => window.open('https://calendly.com/web3dev', '_blank')}
                className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground font-semibold text-lg hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200"
              >
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}