import { ParticleBackground } from '@/components/ui/particle-background'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-cyber-500/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {/* Pre-heading */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyber-500/30 bg-cyber-500/5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-cyber-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-medium text-cyber-500">Welcome to the Future of Web3</span>
            </div>

            {/* Main Heading with Enhanced Typography */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block text-gradient mb-2">Data Analyst</span>
                <span className="block text-foreground">Web2 → Web3</span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl sm:text-2xl lg:text-3xl text-foreground/70 leading-relaxed font-light">
                  Transitioning from <span className="text-primary-500 font-medium">traditional data analytics</span> to <span className="text-cyber-500 font-medium">blockchain insights</span> and Web3 analytics
                </p>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/portfolio">
                <button className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl shadow-primary-500/30">
                  <span className="relative z-10">View Portfolio</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-cyber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-10 py-4 rounded-full border-2 border-gray-300 dark:border-gray-700 text-foreground text-lg font-semibold hover:border-cyber-500 hover:text-cyber-500 hover:bg-cyber-500/5 transition-all duration-200 backdrop-blur-sm">
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
            <div className="pt-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16">
                {[
                  { value: '15+', label: 'Analysis Projects', color: 'cyber-500', icon: '📊' },
                  { value: '500K+', label: 'Records Analyzed', color: 'primary-500', icon: '📈' },
                  { value: '5+', label: 'Statistical Models', color: 'purple-500', icon: '🔬' }
                ].map((stat, index) => (
                  <div key={index} className="group relative p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="text-3xl">{stat.icon}</div>
                      <div className={`text-4xl lg:text-5xl font-bold ${
                        stat.color === 'cyber-500' ? 'text-cyber-500' :
                        stat.color === 'primary-500' ? 'text-primary-500' :
                        'text-purple-500'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-foreground/60 font-medium">
                        {stat.label}
                      </div>
                    </div>
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      stat.color === 'cyber-500' ? 'bg-cyber-500/5' :
                      stat.color === 'primary-500' ? 'bg-primary-500/5' :
                      'bg-purple-500/5'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-cyber-500 rounded-full animate-float opacity-60 shadow-lg shadow-cyber-500/50" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-primary-500 rounded-full animate-float opacity-40 shadow-lg shadow-primary-500/50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-purple-500 rounded-full animate-float opacity-50 shadow-lg shadow-purple-500/50" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-yellow-400 rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-pink-500 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }} />
      </section>


      {/* Enhanced Quick Links Section */}
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

          {/* Enhanced Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: 'About', 
                description: 'Learn about my Web2 to Web3 transition journey', 
                icon: '👤', 
                href: '/about',
                color: 'cyber-500',
                gradient: 'from-cyber-500/20 to-cyber-500/5'
              },
              { 
                title: 'Portfolio', 
                description: 'Explore my learning projects and case studies', 
                icon: '💼', 
                href: '/portfolio',
                color: 'primary-500',
                gradient: 'from-primary-500/20 to-primary-500/5'
              },
              { 
                title: 'Blog', 
                description: 'Read about my learning journey and insights', 
                icon: '📝', 
                href: '/blog',
                color: 'purple-500',
                gradient: 'from-purple-500/20 to-purple-500/5'
              },
              { 
                title: 'Contact', 
                description: 'Let\'s connect and explore opportunities together', 
                icon: '🤝', 
                href: '/contact',
                color: 'yellow-500',
                gradient: 'from-yellow-500/20 to-yellow-500/5'
              },
            ].map((item, index) => (
              <Link key={item.title} href={item.href}>
                <div className={`group relative p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br ${item.gradient} card-hover backdrop-blur-sm`}>
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    item.color === 'cyber-500' ? 'bg-cyber-500/10' :
                    item.color === 'primary-500' ? 'bg-primary-500/10' :
                    item.color === 'purple-500' ? 'bg-purple-500/10' :
                    'bg-yellow-500/10'
                  }`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{item.icon}</div>
                      <div className={`w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${
                        item.color === 'cyber-500' ? 'bg-cyber-500' :
                        item.color === 'primary-500' ? 'bg-primary-500' :
                        item.color === 'purple-500' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`}></div>
                    </div>
                    
                    <div>
                      <h3 className={`text-2xl font-bold text-foreground mb-3 transition-colors duration-200 ${
                        'group-hover:' + (
                          item.color === 'cyber-500' ? 'text-cyber-500' :
                          item.color === 'primary-500' ? 'text-primary-500' :
                          item.color === 'purple-500' ? 'text-purple-500' :
                          'text-yellow-500'
                        )
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className="flex justify-end">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        item.color === 'cyber-500' ? 'bg-cyber-500/10 group-hover:bg-cyber-500/20' :
                        item.color === 'primary-500' ? 'bg-primary-500/10 group-hover:bg-primary-500/20' :
                        item.color === 'purple-500' ? 'bg-purple-500/10 group-hover:bg-purple-500/20' :
                        'bg-yellow-500/10 group-hover:bg-yellow-500/20'
                      }`}>
                        <span className={`text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 ${
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

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-transparent group-hover:via-current group-hover:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
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
    </div>
  )
}
