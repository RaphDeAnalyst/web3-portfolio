'use client'

export function HeroErrorFallback() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-primary-50/30 dark:via-primary-900/10 to-background">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          <span className="text-sm font-medium text-red-500">Hero Section Unavailable</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Welcome to My <span className="text-gradient">Portfolio</span>
        </h1>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
          The main hero section is temporarily unavailable. Please refresh the page or continue exploring below.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-medium shadow-lg shadow-accent-blue/20 transition-all duration-200"
        >
          Refresh Page
        </button>
      </div>
    </section>
  )
}

export function QuickLinksErrorFallback() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          <span className="text-sm font-medium text-red-500">Navigation Links Unavailable</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Navigation</h2>
        <p className="text-foreground/70 mb-8">
          The navigation section is temporarily unavailable. You can still access pages directly:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/about" className="px-6 py-2 rounded-lg border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/10 transition-all duration-200 shadow-lg shadow-accent-blue/20">
            About
          </a>
          <a href="/portfolio" className="px-6 py-2 rounded-lg border border-cyber-500/30 text-cyber-500 hover:bg-cyber-500/10 transition-colors">
            Portfolio
          </a>
          <a href="/blog" className="px-6 py-2 rounded-lg border border-purple-500/30 text-purple-500 hover:bg-purple-500/10 transition-colors">
            Blog
          </a>
          <a href="/contact" className="px-6 py-2 rounded-lg border border-green-500/30 text-green-500 hover:bg-green-500/10 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </section>
  )
}

export function FeaturedProjectsErrorFallback() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-gray-50/30 dark:via-gray-900/20 to-background">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          <span className="text-sm font-medium text-red-500">Featured Projects Unavailable</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
          The featured projects section is temporarily unavailable. View all projects instead.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
        <a href="/portfolio" className="px-8 py-3 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-medium shadow-lg shadow-accent-blue/20 transition-all duration-200">
          View All Projects
        </a>
      </div>
    </section>
  )
}

export function BlogErrorFallback() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          <span className="text-sm font-medium text-red-500">Blog Section Unavailable</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Latest <span className="text-gradient">Insights</span>
        </h2>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
          The blog section is temporarily unavailable. Check back soon for the latest posts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80">
              <div className="flex justify-between items-center mb-4">
                <div className="w-16 h-6 bg-purple-200 dark:bg-purple-800 rounded-full"></div>
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="w-16 h-4 bg-gray-100 dark:bg-gray-800 rounded"></div>
                <div className="w-20 h-4 bg-purple-200 dark:bg-purple-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <a href="/blog" className="px-8 py-3 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-medium shadow-lg shadow-accent-blue/20 transition-all duration-200">
          View All Posts
        </a>
      </div>
    </section>
  )
}

export function SkillsErrorFallback() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-gray-50/30 dark:via-gray-900/20 to-background">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          <span className="text-sm font-medium text-red-500">Skills Section Unavailable</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Skills & <span className="text-gradient">Expertise</span>
        </h2>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
          The skills section is temporarily unavailable. Here&apos;s a brief overview of my expertise:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="p-6 rounded-2xl border border-primary-200/50 dark:border-primary-800/50 bg-primary-50/30 dark:bg-primary-900/10">
            <h3 className="text-xl font-bold text-primary-500 mb-2">Data Analytics</h3>
            <p className="text-foreground/70">Python, SQL, Pandas, Statistical Analysis</p>
          </div>
          <div className="p-6 rounded-2xl border border-cyber-200/50 dark:border-cyber-800/50 bg-cyber-50/30 dark:bg-cyber-900/10">
            <h3 className="text-xl font-bold text-cyber-500 mb-2">Web3 Analytics</h3>
            <p className="text-foreground/70">Dune Analytics, Flipside Crypto, DeFi Protocols</p>
          </div>
          <div className="p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-900/10">
            <h3 className="text-xl font-bold text-purple-500 mb-2">Visualization</h3>
            <p className="text-foreground/70">D3.js, React, Tableau, PowerBI</p>
          </div>
        </div>
        <a href="/about" className="px-8 py-3 rounded-full border-2 border-green-500/30 text-green-500 font-medium hover:bg-green-500/10 transition-colors duration-200">
          Learn More About My Journey
        </a>
      </div>
    </section>
  )
}