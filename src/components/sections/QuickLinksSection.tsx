'use client'

import Link from 'next/link'
import TiltedCard from '@/components/ui/TiltedCard'
import { ArrowUpRight } from 'lucide-react'
import { getAllNavigationItems } from '@/lib/color-system'

export function QuickLinksSection() {
  // Get navigation items from shared color system
  const quickLinks = getAllNavigationItems().map(item => ({
    title: item.name,
    description: item.name === 'About' ? 'Learn about my Web2 to Web3 transition journey' :
                item.name === 'Portfolio' ? 'Explore my learning projects and case studies' :
                item.name === 'Blog' ? 'Read about my learning journey and insights' :
                'Let\'s connect and explore opportunities together',
    href: item.href,
    icon: item.icon,
    color: item.cardGradient,
    gradient: item.gradient,
    hoverGradient: item.hoverGradient,
    iconColor: item.textClass,
    primary: item.primary
  }))

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50" />
      <div className="hidden sm:block absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-300/20 dark:via-gray-700/20 to-transparent" />
      <div className="hidden sm:block absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-400/20 dark:via-gray-600/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 border border-primary/30 bg-primary/5 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-primary">Explore My Work</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Discover the <span className="text-primary">Possibilities</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            Explore my transition from traditional data analytics to Web3 and blockchain insights
          </p>
        </div>

        {/* Enhanced Cards Grid with Vibrant Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {quickLinks.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Link key={item.title} href={item.href}>
                <TiltedCard
                  containerHeight="320px"
                  containerWidth="100%"
                  rotateAmplitude={15}
                  scaleOnHover={1.08}
                  showTooltip={false}
                  displayOverlayContent={false}
                  className="w-full max-w-[280px] min-h-[320px] group"
                >
                  <div className={`relative w-full h-full bg-gradient-to-br ${item.gradient} hover:bg-gradient-to-br hover:${item.hoverGradient} backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-between rounded-2xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-${item.iconColor.split('-')[1]}-500/20`}>

                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${item.color} rounded-full blur-xl`}></div>
                      <div className={`absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br ${item.color} rounded-full blur-xl`}></div>
                    </div>

                    {/* Header with Icon */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 rounded-xl flex items-center justify-center">
                          <IconComponent className={`w-6 h-6 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:bg-white/20 dark:group-hover:bg-black/20 group-hover:scale-110 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 text-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-foreground transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-foreground/70 text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full h-1 bg-white/10 dark:bg-black/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${item.color} w-0 group-hover:w-full transition-all duration-700 delay-200 rounded-full`}></div>
                      </div>
                    </div>

                    {/* Floating Orbs for extra visual interest */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-br ${item.color} rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-pulse transition-all duration-500 delay-300`}></div>
                      <div className={`absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-gradient-to-br ${item.color} rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-pulse transition-all duration-500 delay-500`}></div>
                    </div>
                  </div>
                </TiltedCard>
              </Link>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <button className="btn-primary w-full sm:w-auto min-h-[48px]">
                View All Projects
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-outline w-full sm:w-auto min-h-[48px]">
                Start a Conversation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}