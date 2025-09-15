'use client'

import Link from 'next/link'
import TiltedCard from '@/components/ui/TiltedCard'

export function QuickLinksSection() {
  const quickLinks = [
    {
      title: 'About',
      description: 'Learn about my Web2 to Web3 transition journey',
      href: '/about',
      color: 'gray-600',
      gradient: 'from-gray-200/20 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-700/5'
    },
    {
      title: 'Portfolio',
      description: 'Explore my learning projects and case studies',
      href: '/portfolio',
      color: 'gray-700',
      gradient: 'from-gray-300/20 to-gray-200/5 dark:from-gray-700/20 dark:to-gray-600/5'
    },
    {
      title: 'Blog',
      description: 'Read about my learning journey and insights',
      href: '/blog',
      color: 'gray-800',
      gradient: 'from-gray-400/20 to-gray-300/5 dark:from-gray-600/20 dark:to-gray-500/5'
    },
    {
      title: 'Contact',
      description: 'Let\'s connect and explore opportunities together',
      href: '/contact',
      color: 'gray-900',
      gradient: 'from-gray-500/20 to-gray-400/5 dark:from-gray-500/20 dark:to-gray-400/5'
    },
  ]

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50" />
      <div className="hidden sm:block absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-300/20 dark:via-gray-700/20 to-transparent" />
      <div className="hidden sm:block absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-400/20 dark:via-gray-600/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-foreground rounded-full mr-3 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-foreground">Explore My Work</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Discover the <span className="text-gradient">Possibilities</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Explore my transition from traditional data analytics to Web3 and blockchain insights
          </p>
        </div>

        {/* Enhanced Cards Grid with TiltedCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {quickLinks.map((item, index) => (
            <Link key={item.title} href={item.href}>
              <TiltedCard
                containerHeight="300px"
                containerWidth="100%"
                rotateAmplitude={6}
                scaleOnHover={1.03}
                showTooltip={false}
                displayOverlayContent={false}
                className="transition-all duration-300 w-full max-w-[280px] min-h-[300px]"
              >
                <div className={`w-full h-full bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-center space-y-3 sm:space-y-4 rounded-2xl`}>
                  {/* Content */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-end mb-2 sm:mb-4">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full opacity-60 ${
                        item.color === 'gray-600' ? 'bg-gray-600' :
                        item.color === 'gray-700' ? 'bg-gray-700' :
                        item.color === 'gray-800' ? 'bg-gray-800' :
                        'bg-gray-900'
                      }`}></div>
                    </div>

                    <div>
                      <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-200 leading-tight ${
                        item.color === 'gray-600' ? 'text-gray-600 dark:text-gray-400' :
                        item.color === 'gray-700' ? 'text-gray-700 dark:text-gray-300' :
                        item.color === 'gray-800' ? 'text-gray-800 dark:text-gray-200' :
                        'text-gray-900 dark:text-gray-100'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed text-xs sm:text-sm">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className="flex justify-end">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        item.color === 'gray-600' ? 'bg-gray-600/10 dark:bg-gray-400/10' :
                        item.color === 'gray-700' ? 'bg-gray-700/10 dark:bg-gray-300/10' :
                        item.color === 'gray-800' ? 'bg-gray-800/10 dark:bg-gray-200/10' :
                        'bg-gray-900/10 dark:bg-gray-100/10'
                      }`}>
                        <span className={`text-sm sm:text-lg transition-transform duration-200 ${
                          item.color === 'gray-600' ? 'text-gray-600 dark:text-gray-400' :
                          item.color === 'gray-700' ? 'text-gray-700 dark:text-gray-300' :
                          item.color === 'gray-800' ? 'text-gray-800 dark:text-gray-200' :
                          'text-gray-900 dark:text-gray-100'
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
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-storj-navy text-white rounded-storj font-semibold hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200 shadow-storj-lg min-h-[48px]">
                View All Projects
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 backdrop-blur-sm min-h-[48px]">
                Start a Conversation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}