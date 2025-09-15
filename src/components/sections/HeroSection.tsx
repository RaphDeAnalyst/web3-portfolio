'use client'

import Link from 'next/link'
import { ParticleBackground } from '@/components/ui/particle-background'

export function HeroSection() {
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-20">
      {/* Background Layers */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-400/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {/* Pre-heading */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-500">Welcome to the Future of Web3</span>
          </div>

          {/* Main Heading with Enhanced Typography */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="block text-gradient mb-2">Matthew Raphael</span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-foreground/70 leading-relaxed font-light">
                Transitioning from <span className="text-primary-600 font-medium">traditional data analytics</span> to <span className="text-primary-500 font-medium">blockchain insights</span> and Web3 analytics
              </p>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-6">
            <Link href="/portfolio">
              <button className="group relative w-full sm:w-auto min-w-[200px] min-h-[44px] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-storj bg-storj-navy text-white font-semibold text-sm sm:text-base lg:text-lg hover:bg-storj-blue hover:transform hover:translate-y-[-2px] transition-all duration-200 shadow-storj-lg">
                <span className="relative z-10">View Portfolio</span>
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto min-w-[200px] min-h-[44px] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-storj border-2 border-gray-300 text-gray-700 text-sm sm:text-base lg:text-lg font-semibold hover:border-storj-blue hover:text-storj-blue hover:bg-storj-blue/5 transition-all duration-200">
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

          {/* Enhanced Stats Section */}
          <div className="pt-8 sm:pt-12 lg:pt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">
              {[
                { value: '15+', label: 'Analysis Projects', color: 'primary-600' },
                { value: '500K+', label: 'Records Analyzed', color: 'primary-500' },
                { value: '5+', label: 'Statistical Models', color: 'primary-400' }
              ].map((stat, index) => (
                <div key={index} className="group relative p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-300">
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ${
                      stat.color === 'primary-600' ? 'text-primary-600' :
                      stat.color === 'primary-500' ? 'text-primary-500' :
                      'text-primary-400'
                    }`}>
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-foreground/60 font-medium">
                      {stat.label}
                    </div>
                  </div>
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    stat.color === 'primary-600' ? 'bg-primary-600/5' :
                    stat.color === 'primary-500' ? 'bg-primary-500/5' :
                    'bg-primary-400/5'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements - Hidden on mobile to avoid overlap */}
      <div className="hidden sm:block absolute top-20 left-10 w-4 h-4 bg-primary-600 rounded-full animate-float opacity-60 shadow-lg shadow-primary-600/50" />
      <div className="hidden md:block absolute top-40 right-20 w-6 h-6 bg-primary-500 rounded-full animate-float opacity-40 shadow-lg shadow-primary-500/50" style={{ animationDelay: '1s' }} />
      <div className="hidden lg:block absolute bottom-40 left-20 w-5 h-5 bg-primary-400 rounded-full animate-float opacity-50 shadow-lg shadow-primary-400/50" style={{ animationDelay: '2s' }} />
      <div className="hidden xl:block absolute top-1/2 right-10 w-3 h-3 bg-primary-300 rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }} />
      <div className="hidden lg:block absolute bottom-20 right-1/4 w-2 h-2 bg-primary-500 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }} />
    </section>
  )
}