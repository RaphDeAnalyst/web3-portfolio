import { ParticleBackground } from '@/components/ui/particle-background'
import { ActivityGraph } from '@/components/admin/activity-graph'
import TiltedCard from '@/components/ui/TiltedCard'
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
                <span className="block text-gradient mb-2">Matthew Raphael</span>
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

          {/* Enhanced Cards Grid with TiltedCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
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
                icon: '📁', 
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-6xl">{item.icon}</div>
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

      {/* Featured Projects Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/30">
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-medium text-primary-500">Featured Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Highlighted <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              From traditional analytics to Web3 insights - explore key projects showcasing my analytical journey
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "Ethereum DeFi Wallet Analysis",
                description: "Dashboard analyzing top DeFi wallets, token movements, and whale activity using Dune Analytics. Tracked 10K+ wallets across major protocols.",
                tech: ["Dune Analytics", "SQL", "Ethereum", "DeFi"],
                image: "📊",
                link: "/portfolio",
                category: "Web3 Analytics"
              },
              {
                title: "NFT Marketplace Trends",
                description: "Analyzed 200K+ marketplace transactions to reveal top collections, buyer behavior patterns, and wash trading detection.",
                tech: ["Python", "Pandas", "Web3.py", "OpenSea API"],
                image: "🖼️",
                link: "/portfolio",
                category: "Market Analysis"
              },
              {
                title: "Stablecoin Flow Tracker",
                description: "Real-time visualization of USDT/USDC flows across exchanges during high-volatility periods. Built interactive Sankey diagrams.",
                tech: ["SQL", "D3.js", "Flipside", "React"],
                image: "💰",
                link: "/portfolio",
                category: "DeFi Analytics"
              },
              {
                title: "Web2 → Web3 Transition Study",
                description: "Comprehensive case study documenting my analytical approach evolution from traditional Excel/SQL to blockchain analytics tools.",
                tech: ["Documentation", "Excel", "Dune", "Python"],
                image: "🔄",
                link: "/portfolio",
                category: "Case Study"
              }
            ].map((project, index) => (
              <Link key={index} href={project.link}>
                <div className="group relative h-full p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 card-hover">
                  {/* Project Image/Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-6xl opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                      {project.image}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-medium">
                      {project.category}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary-500 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 rounded-full bg-cyber-500/10 text-cyber-500 text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-primary-500 font-medium group-hover:text-primary-600 transition-colors duration-200">
                        View Project →
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors duration-200">
                        <span className="text-primary-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">↗</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-cyber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Projects CTA */}
          <div className="text-center mt-16">
            <Link href="/portfolio">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl shadow-primary-500/20">
                View All Projects
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 dark:from-gray-900/30 to-background" />
        
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-medium text-purple-500">Latest Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Featured <span className="text-gradient">Blog Posts</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Sharing my learning journey, insights, and practical knowledge in Web3 analytics
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "From Excel to Ethereum: My First Steps in Blockchain Analytics",
                description: "A personal journey documenting the transition from traditional spreadsheet analysis to on-chain data exploration.",
                readTime: "8 min read",
                category: "Journey",
                date: "Jan 2025",
                color: "cyber-500"
              },
              {
                title: "5 SQL Tricks Every Web3 Analyst Should Know",
                description: "Practical SQL techniques that translate perfectly from Web2 databases to blockchain query platforms like Dune.",
                readTime: "6 min read",
                category: "Tutorial",
                date: "Dec 2024",
                color: "primary-500"
              },
              {
                title: "Detecting Spam Wallets on Testnets: A Case Study",
                description: "Deep dive into identifying suspicious wallet behavior patterns using statistical analysis and on-chain forensics.",
                readTime: "12 min read",
                category: "Analysis",
                date: "Nov 2024",
                color: "purple-500"
              }
            ].map((post, index) => (
              <Link key={index} href="/blog">
                <article className="group h-full p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 card-hover">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.color === 'cyber-500' ? 'bg-cyber-500/10 text-cyber-500' :
                      post.color === 'primary-500' ? 'bg-primary-500/10 text-primary-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {post.category}
                    </div>
                    <span className="text-sm text-foreground/50">{post.date}</span>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-bold text-foreground transition-colors duration-200 ${
                      post.color === 'cyber-500' ? 'group-hover:text-cyber-500' :
                      post.color === 'primary-500' ? 'group-hover:text-primary-500' :
                      'group-hover:text-purple-500'
                    }`}>
                      {post.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
                      {post.description}
                    </p>
                    
                    {/* Read More */}
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-foreground/60">{post.readTime}</span>
                      <span className={`font-medium transition-colors duration-200 ${
                        post.color === 'cyber-500' ? 'text-cyber-500 group-hover:text-cyber-600' :
                        post.color === 'primary-500' ? 'text-primary-500 group-hover:text-primary-600' :
                        'text-purple-500 group-hover:text-purple-600'
                      }`}>
                        Read More →
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    post.color === 'cyber-500' ? 'bg-cyber-500/5' :
                    post.color === 'primary-500' ? 'bg-primary-500/5' :
                    'bg-purple-500/5'
                  }`}></div>
                </article>
              </Link>
            ))}
          </div>

          {/* View All Posts CTA */}
          <div className="text-center mt-16">
            <Link href="/blog">
              <button className="px-10 py-4 rounded-full border-2 border-purple-500/30 text-purple-500 font-semibold text-lg hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-200 backdrop-blur-sm">
                Read All Posts
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skills & Expertise Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-gray-50/30 dark:via-gray-900/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-medium text-green-500">Technical Arsenal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Skills & <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              A comprehensive toolkit built through hands-on experience in both traditional and blockchain analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Core Data Analytics",
                description: "Foundation skills from traditional analytics",
                skills: ["Python", "SQL", "Pandas", "Excel", "PowerBI", "Statistical Analysis"],
                icon: "📊",
                color: "primary-500"
              },
              {
                title: "Web3 Analytics",
                description: "Specialized blockchain and DeFi analysis tools",
                skills: ["Dune Analytics", "Flipside Crypto", "Web3.py", "Etherscan API", "DeFi Protocols"],
                icon: "⛓️",
                color: "cyber-500"
              },
              {
                title: "Visualization & Tools",
                description: "Creating compelling data stories and dashboards",
                skills: ["D3.js", "React", "Tableau", "Matplotlib", "Seaborn", "Git"],
                icon: "📈",
                color: "purple-500"
              }
            ].map((category, index) => (
              <div key={index} className="group p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {category.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                    category.color === 'primary-500' ? 'text-foreground group-hover:text-primary-500' :
                    category.color === 'cyber-500' ? 'text-foreground group-hover:text-cyber-500' :
                    'text-foreground group-hover:text-purple-500'
                  }`}>
                    {category.title}
                  </h3>
                  <p className="text-foreground/70 group-hover:text-foreground/90 transition-colors duration-200">
                    {category.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      category.color === 'primary-500' ? 'bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20' :
                      category.color === 'cyber-500' ? 'bg-cyber-500/10 text-cyber-500 group-hover:bg-cyber-500/20' :
                      'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20'
                    }`}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  category.color === 'primary-500' ? 'bg-primary-500/5' :
                  category.color === 'cyber-500' ? 'bg-cyber-500/5' :
                  'bg-purple-500/5'
                }`}></div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/about">
              <button className="px-10 py-4 rounded-full border-2 border-green-500/30 text-green-500 font-semibold text-lg hover:bg-green-500/10 hover:border-green-500 transition-all duration-200 backdrop-blur-sm">
                Learn More About My Journey
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
