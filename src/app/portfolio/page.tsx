'use client'

import { useState, useMemo, useEffect } from 'react'
import { ProjectCard } from '@/components/ui/project-card'
import { FilterTabs } from '@/components/ui/filter-tabs'
import { projectCategories, Project } from '@/data/projects'
import { projectService } from '@/lib/service-switcher'
import Link from 'next/link'

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await projectService.getAllProjects()
        setProjects(allProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadProjects()
  }, [])

  // Filter and separate featured and regular projects
  const { featuredProjects, regularProjects } = useMemo(() => {
    let filtered = activeCategory === 'All' 
      ? projects 
      : projects.filter(project => project.category === activeCategory)
    
    // Sort projects
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'newest') return 0 // Keep original order
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return a.title.localeCompare(b.title)
    })

    // Separate featured and regular projects
    const featured = sorted.filter(project => project.featured).slice(0, 3) // Max 3 featured
    const regular = sorted.filter(project => !project.featured)

    return {
      featuredProjects: featured,
      regularProjects: regular
    }
  }, [activeCategory, sortBy, projects])

  // Calculate project counts for each category
  const projectCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      'All': projects.length
    }
    
    projectCategories.forEach(category => {
      if (category !== 'All') {
        counts[category] = projects.filter(p => p.category === category).length
      }
    })
    
    return counts
  }, [projects])

  // Total filtered projects for display
  const totalFilteredProjects = featuredProjects.length + regularProjects.length

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen py-20">
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24 mx-auto mb-8 animate-pulse"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

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
            <span className="text-gradient">Learning Projects</span>
            <br />
            <span className="text-foreground">& Case Studies</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Explore my journey from <span className="text-primary-500 font-medium">traditional analytics</span> to 
            <span className="text-cyber-500 font-medium"> Web3 insights</span>, including 
            <span className="text-purple-500 font-medium"> learning projects</span> and practical applications
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <FilterTabs 
            categories={projectCategories}
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

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Projects</h2>
            <div className={`grid gap-8 ${
              featuredProjects.length === 1 
                ? 'grid-cols-1 lg:grid-cols-6' 
                : featuredProjects.length === 2
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto'
            }`}>
              {featuredProjects.map((project, index) => (
                <ProjectCard 
                  key={index} 
                  {...project} 
                  featuredCount={featuredProjects.length}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Projects Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          {regularProjects.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {featuredProjects.length > 0 ? 'All Projects' : 'Projects'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularProjects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </>
          )}
          
          {totalFilteredProjects === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 text-foreground/40">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No projects found</h3>
              <p className="text-foreground/60 mb-8">Try selecting a different category or adjusting your search.</p>
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

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-cyber-500/5 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Interested in <span className="text-gradient">Collaborating?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              I'm always looking for opportunities to learn and contribute to Web3 projects. 
              Whether it's data analysis, learning collaborations, or entry-level opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30">
                  Get In Touch
                </button>
              </Link>
              <Link href="/about">
                <button className="px-8 py-4 rounded-full border-2 border-gray-300 dark:border-gray-700 text-foreground font-semibold hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200">
                  Learn About Me
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}