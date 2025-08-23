'use client'

import { useState, useMemo } from 'react'
import { ProjectCard } from '@/components/ui/project-card'
import { FilterTabs } from '@/components/ui/filter-tabs'
import { projects, projectCategories } from '@/data/projects'
import Link from 'next/link'

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const projects = [
    {
      title: "Ethereum Gas Price Analysis Dashboard",
      description: "Interactive dashboard analyzing Ethereum gas prices over time using Python and Matplotlib. Explored correlations between network congestion, transaction volume, and gas costs to identify optimal transaction timing patterns.",
      tech: ["Python", "Pandas", "Matplotlib", "Web3.py", "Jupyter"],
      category: "Analytics",
      status: "Live" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        timeframe: "6 months",
        datapoints: "50K+",
        insights: "5 key findings"
      },
      featured: true
    },
    {
      title: "Smart Contract Security Auditor",
      description: "AI-powered smart contract analysis tool that identifies potential vulnerabilities, gas optimization opportunities, and security best practices. Uses machine learning models trained on thousands of audited contracts.",
      tech: ["Solidity", "Python", "TensorFlow", "Node.js", "MongoDB"],
      category: "Smart Contracts",
      status: "Development" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        contracts: "500+",
        users: "150+",
        performance: "95.2%"
      }
    },
    {
      title: "Cross-Chain Bridge Monitor",
      description: "Real-time monitoring system tracking bridge transactions and detecting anomalies across different blockchain networks. Provides alerts for unusual activity and transaction failures.",
      tech: ["TypeScript", "Node.js", "PostgreSQL", "Web3", "Redis"],
      category: "Infrastructure",
      status: "Live" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        volume: "$2.5B+",
        users: "10K+",
        contracts: "25+"
      }
    },
    {
      title: "NFT Market Intelligence",
      description: "Advanced machine learning model predicting NFT floor prices based on market sentiment, on-chain metrics, and social media trends. Includes collection ranking and rarity analysis.",
      tech: ["Python", "TensorFlow", "FastAPI", "React", "PostgreSQL"],
      category: "AI x Web3",
      status: "Beta" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        users: "1,200+",
        performance: "87.3%"
      }
    },
    {
      title: "Yield Farming Optimizer",
      description: "Automated yield farming strategy optimizer that finds the best opportunities across DeFi protocols. Features risk assessment, gas cost optimization, and automated portfolio rebalancing.",
      tech: ["Solidity", "Python", "Web3.py", "Celery", "Redis"],
      category: "DeFi",
      status: "Live" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        volume: "$15M+",
        users: "800+",
        performance: "12.5%"
      }
    },
    {
      title: "DAO Governance Dashboard",
      description: "Comprehensive governance analytics platform for DAOs, tracking proposal success rates, voting patterns, and member engagement metrics. Features predictive voting outcome models.",
      tech: ["React", "TypeScript", "The Graph", "IPFS", "PostgreSQL"],
      category: "Dashboards",
      status: "Live" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        users: "5,000+",
        contracts: "200+"
      }
    },
    {
      title: "Blockchain Data Pipeline",
      description: "High-performance data pipeline processing millions of blockchain transactions daily. Provides real-time indexing, data validation, and API endpoints for Web3 applications.",
      tech: ["Python", "Apache Kafka", "PostgreSQL", "Redis", "Docker"],
      category: "Infrastructure",
      status: "Live" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        volume: "100M+",
        performance: "99.9%"
      }
    },
    {
      title: "Token Price Prediction Model",
      description: "Advanced AI model for cryptocurrency price prediction using technical analysis, on-chain metrics, and sentiment analysis. Achieves 78% accuracy for 24-hour price movements.",
      tech: ["Python", "TensorFlow", "Pandas", "Scikit-learn", "FastAPI"],
      category: "AI x Web3",
      status: "Beta" as const,
      demoUrl: "#",
      githubUrl: "#",
      metrics: {
        performance: "78.5%",
        users: "300+"
      }
    }
  ]

  // Categories are now imported from /src/data/projects.ts
  const categories = projectCategories

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    let filtered = activeCategory === 'All' 
      ? projects 
      : projects.filter(project => project.category === activeCategory)
    
    // Sort projects
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return 0 // Keep original order
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return a.title.localeCompare(b.title)
    })
  }, [activeCategory, sortBy])

  // Calculate project counts for each category
  const projectCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      'All': projects.length
    }
    
    categories.forEach(category => {
      if (category !== 'All') {
        counts[category] = projects.filter(p => p.category === category).length
      }
    })
    
    return counts
  }, [projects])

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-500">Portfolio</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Featured Projects</span>
            <br />
            <span className="text-foreground">& Case Studies</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Explore my latest Web3 projects spanning <span className="text-primary-500 font-medium">analytics platforms</span>, 
            <span className="text-cyber-500 font-medium"> smart contracts</span>, and 
            <span className="text-purple-500 font-medium"> AI-driven solutions</span>
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <FilterTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            projectCounts={projectCounts}
          />
          
          {/* Sort Controls */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 p-1 rounded-full bg-background/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
              <span className="text-sm text-foreground/60 px-3">Sort by:</span>
              {[
                { label: 'Newest', value: 'newest' },
                { label: 'Featured', value: 'featured' },
                { label: 'Name', value: 'name' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    sortBy === option.value
                      ? 'bg-cyber-500/20 text-cyber-500'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No projects found</h3>
              <p className="text-foreground/60 mb-6">
                No projects match the selected category. Try selecting a different filter.
              </p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-medium hover:scale-105 transition-transform duration-200"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Impact <span className="text-gradient">Metrics</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Real numbers from projects that are making a difference in Web3
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$118M+', label: 'Total Volume Processed', icon: '💰', color: 'cyber-500' },
              { value: '20,000+', label: 'Active Users', icon: '👥', color: 'primary-500' },
              { value: '1,000+', label: 'Smart Contracts', icon: '⚡', color: 'purple-500' },
              { value: '99.8%', label: 'Uptime Average', icon: '🚀', color: 'yellow-500' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className={`text-2xl lg:text-3xl font-bold text-${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary-500/10 via-cyber-500/10 to-purple-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Have a Web3 project in mind? Let's collaborate and create the next generation of decentralized solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30">
                  Start a Project
                </button>
              </Link>
              <button className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground font-semibold text-lg hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200">
                Download Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}