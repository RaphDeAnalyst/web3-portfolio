'use client'

import Link from 'next/link'
import { ParticleBackground } from '@/components/ui/particle-background'

export function HeroSection() {
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 bg-background">
      {/* Minimal Background - Clean and Professional */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-secondary" />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {/* Pre-heading */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-primary">Welcome to the Future of Web3</span>
          </div>

          {/* Main Heading with Enhanced Typography */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="block text-foreground mb-2">Matthew Raphael</span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-foreground-secondary leading-relaxed font-light">
                Transitioning from <span className="text-primary font-medium">traditional data analytics</span> to <span className="text-primary font-medium">blockchain insights</span> and Web3 analytics
              </p>
            </div>
          </div>

          {/* Enhanced CTA Buttons - Reference-based styling */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-6">
            <Link href="/portfolio">
              <button className="btn-primary w-full sm:w-auto min-w-[200px] min-h-[44px]">
                View Portfolio
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-outline w-full sm:w-auto min-w-[200px] min-h-[44px]">
                Get In Touch
              </button>
            </Link>
          </div>

          {/* Scroll Indicator - moved to better position */}
          <div className="flex flex-col items-center space-y-2 text-foreground/40 mt-8 mb-8">
            <span className="text-xs font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
              <div className="w-1 h-3 bg-current rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>

          {/* Enhanced Stats Section - Clean and minimal */}
          <div className="pt-12 sm:pt-16 lg:pt-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-20">
              {[
                { value: '5+', label: 'Tools' },
                { value: '100%', label: 'Data-Driven Approach' },
                { value: '24/7', label: 'Research' }
              ].map((stat, index) => (
                <div key={index} className="group relative p-6 sm:p-8 lg:p-10 bg-card border border-border hover:border-border-hover transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-foreground-secondary tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal floating elements */}
      <div className="hidden sm:block absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
      <div className="hidden md:block absolute top-40 right-20 w-6 h-6 bg-primary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }} />
      <div className="hidden lg:block absolute bottom-40 left-20 w-5 h-5 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }} />
    </section>
  )
}