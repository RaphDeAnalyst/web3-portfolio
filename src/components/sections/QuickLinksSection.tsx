'use client'

import Link from 'next/link'
import TiltedCard from '@/components/ui/TiltedCard'

export function QuickLinksSection() {
  const quickLinks = [
    { 
      title: 'About', 
      description: 'Learn about my Web2 to Web3 transition journey', 
      href: '/about',
      color: 'cyber-500',
      gradient: 'from-cyber-500/20 to-cyber-500/5'
    },
    { 
      title: 'Portfolio', 
      description: 'Explore my learning projects and case studies', 
      href: '/portfolio',
      color: 'primary-500',
      gradient: 'from-primary-500/20 to-primary-500/5'
    },
    { 
      title: 'Blog', 
      description: 'Read about my learning journey and insights', 
      href: '/blog',
      color: 'purple-500',
      gradient: 'from-purple-500/20 to-purple-500/5'
    },
    { 
      title: 'Contact', 
      description: 'Let\'s connect and explore opportunities together', 
      href: '/contact',
      color: 'yellow-500',
      gradient: 'from-yellow-500/20 to-yellow-500/5'
    },
  ]

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-500/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary-500/20 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-500">Explore My Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Discover the <span className="text-gradient">Possibilities</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Explore my transition from traditional data analytics to Web3 and blockchain insights
          </p>
        </div>

        {/* Enhanced Cards Grid with TiltedCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {quickLinks.map((item, index) => (
            <Link key={item.title} href={item.href}>
              <TiltedCard
                containerHeight="300px"
                containerWidth="250px"
                rotateAmplitude={8}
                scaleOnHover={1.05}
                showTooltip={false}
                displayOverlayContent={false}
                className="transition-all duration-300"
              >
                <div className={`w-full h-full bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center space-y-4`}>
                  {/* Content */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-end mb-4">
                      <div className={`w-3 h-3 rounded-full opacity-60 ${
                        item.color === 'cyber-500' ? 'bg-cyber-500' :
                        item.color === 'primary-500' ? 'bg-primary-500' :
                        item.color === 'purple-500' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`}></div>
                    </div>
                    
                    <div>
                      <h3 className={`text-2xl font-bold text-foreground mb-3 transition-colors duration-200 ${
                        item.color === 'cyber-500' ? 'text-cyber-500' :
                        item.color === 'primary-500' ? 'text-primary-500' :
                        item.color === 'purple-500' ? 'text-purple-500' :
                        'text-yellow-500'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className="flex justify-end">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        item.color === 'cyber-500' ? 'bg-cyber-500/10' :
                        item.color === 'primary-500' ? 'bg-primary-500/10' :
                        item.color === 'purple-500' ? 'bg-purple-500/10' :
                        'bg-yellow-500/10'
                      }`}>
                        <span className={`text-lg transition-transform duration-200 ${
                          item.color === 'cyber-500' ? 'text-cyber-500' :
                          item.color === 'primary-500' ? 'text-primary-500' :
                          item.color === 'purple-500' ? 'text-purple-500' :
                          'text-yellow-500'
                        }`}>
                          ↗
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltedCard>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link href="/portfolio">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30">
                View All Projects
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200 backdrop-blur-sm">
                Start a Conversation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}