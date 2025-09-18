'use client'

import Link from 'next/link'
import { ContactForm } from '@/components/ui/contact-form'
import { ContactInfo } from '@/components/ui/contact-info'
import { SocialLinks } from '@/components/ui/social-links'
import { AvailabilityCalendar } from '@/components/ui/availability-calendar'
import { StructuredData } from '@/components/seo/StructuredData'
import { Send } from 'lucide-react'

export default function Contact() {
  return (
    <>
      <StructuredData type="localbusiness" />
    <div className="min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm mb-8" style={{ border: '1px solid #8b5cf6', backgroundColor: '#8b5cf630' }}>
            <span className="w-2 h-2 rounded-full mr-3 animate-pulse" style={{ backgroundColor: '#8b5cf6' }}></span>
            <span className="text-sm font-medium" style={{ color: '#8b5cf6' }}>Let's Collaborate</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8">
            <span className="text-gradient">Ready to Build</span>
            <br />
            <span className="text-foreground">Something Amazing?</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Whether you need <span className="text-foreground font-semibold">analytics dashboards</span>,
            <span className="text-foreground font-semibold"> smart contracts</span>, or
            <span className="text-foreground font-semibold"> AI-powered solutions</span>,
            let's bring your Web3 vision to life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-card-light dark:bg-card-dark border border-gray-200/30 dark:border-card-border shadow-card-light dark:shadow-card-dark">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    Start Your Project
                  </h2>
                  <p className="text-foreground/70 leading-relaxed">
                    Tell me about your Web3 project and I'll get back to you with a detailed proposal. 
                    The more information you provide, the better I can help you achieve your goals.
                  </p>
                </div>
                <ContactForm />
              </div>

              {/* Availability Calendar Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card-light dark:bg-card-dark border border-gray-200/30 dark:border-card-border shadow-card-light dark:shadow-card-dark">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    Check My <span className="text-gradient">Availability</span>
                  </h2>
                  <p className="text-foreground/70 leading-relaxed">
                    See my real-time availability and book a consultation call. 
                    <span className="text-foreground font-semibold"> Hover over any date</span> to see available time slots,
                    or <span className="text-foreground font-semibold"> click to book</span> directly.
                  </p>
                </div>
                <AvailabilityCalendar />
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
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-card-light/30 dark:bg-card-dark/30">
        <div className="max-w-6xl mx-auto py-20">
          <SocialLinks />
        </div>
      </section>

      {/* Learning & Growth Focus */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              My <span className="text-gradient">Approach</span>
            </h2>
            <p className="text-xl text-foreground/70">
              How I approach projects and collaborations in Web3 analytics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: null,
                title: "Data-Driven Analysis",
                description: "I bring rigorous statistical methods from traditional analytics to Web3 data, ensuring insights are backed by solid methodology.",
                approach: "Statistical rigor meets blockchain transparency",
                example: "Gas price analysis with 50K+ data points"
              },
              {
                icon: null,
                title: "Visual Storytelling",
                description: "Complex blockchain data becomes accessible through clear visualizations and interactive dashboards that stakeholders can understand.",
                approach: "Transform complexity into clarity",
                example: "Dune dashboards with 500+ community views"
              },
              {
                icon: null,
                title: "Continuous Learning",
                description: "I'm actively expanding my Web3 knowledge while leveraging existing analytics expertise, documenting the learning journey transparently.",
                approach: "Traditional skills + Web3 innovation",
                example: "Building portfolio while mastering Solidity"
              }
            ].map((item, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-card-light dark:bg-card-dark border border-gray-200/30 dark:border-card-border shadow-card-light dark:shadow-card-dark hover:shadow-card-light-hover dark:hover:shadow-card-dark-hover hover:scale-105 transition-all duration-300 card-hover">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-foreground/80 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-sm mb-4">
                    {item.description}
                  </p>
                </div>
                

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-12 rounded-3xl bg-card-light dark:bg-card-dark border border-gray-200/30 dark:border-card-border shadow-card-light dark:shadow-card-dark">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-foreground flex items-center justify-center text-background">
              <Send className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Let's Build the Future Together
            </h2>
            
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Ready to transform your Web3 idea into reality? I'm here to help you navigate
              the technical challenges and build something extraordinary.
              <Link href="/about" className="text-primary-600 hover:text-primary-700 underline">
                Learn more about my background
              </Link> or
              <Link href="/portfolio" className="text-primary-600 hover:text-primary-700 underline">
                view my recent projects
              </Link>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-storj bg-storj-blue hover:bg-storj-navy text-white font-semibold text-base sm:text-lg hover:transform hover:translate-y-[-2px] transition-all duration-200 shadow-storj-lg min-h-[44px]"
              >
                Start Your Project
              </button>
              <button
                onClick={() => window.open('https://calendly.com/your-link', '_blank')}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-storj border border-gray-300 text-gray-700 font-semibold text-base sm:text-lg hover:border-storj-blue hover:text-storj-blue hover:bg-storj-blue/5 transition-all duration-200 min-h-[44px]"
              >
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}