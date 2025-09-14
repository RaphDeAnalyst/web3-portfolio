'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ProjectCard } from '@/components/ui/project-card'
import { FilterTabs } from '@/components/ui/filter-tabs'
import { projectCategories, Project } from '@/data/projects'
import type { Project as ServiceProject } from '@/lib/project-service-supabase'
import { projectService } from '@/lib/service-switcher'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

export default function Portfolio() {
  const [projects, setProjects] = useState<(Project | ServiceProject)[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

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
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
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
  }, [activeCategory, sortBy, searchQuery, projects])

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
    <div className="min-h-screen py-20" style={{ scrollBehavior: 'smooth' }}>
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
            Explore how I apply <span className="text-primary-600 font-medium">traditional analytics skills</span> to
            <span className="text-primary-500 font-medium"> Web3 insights</span>, bridging the gap between established data methods and
            <span className="text-primary-600 font-medium"> decentralized ecosystems</span>
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto py-4">
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 px-4 sm:px-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm sm:text-base"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40">
                <Search className="w-5 h-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <FilterTabs
            categories={projectCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            projectCounts={projectCounts}
          />

          {/* Sort Controls */}
          <div className="flex justify-center mb-2">
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
                      ? 'bg-primary-500/20 text-primary-500'
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
        <section ref={contentRef} className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Projects</h2>
            <div className={`grid gap-8 ${
              featuredProjects.length === 1 
                ? 'grid-cols-1 lg:grid-cols-6' 
                : featuredProjects.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
            }`}>
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  {...(project as any)}
                  tech={(project as any).tech || (project as any).techStack || (project as any).tech_stack || []}
                  featuredCount={featuredProjects.length}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Projects Grid */}
      <section className={`px-4 sm:px-6 lg:px-8 mb-20 ${featuredProjects.length === 0 ? '' : ''}`} ref={featuredProjects.length === 0 ? contentRef : undefined}>
        <div className="max-w-7xl mx-auto">
          {regularProjects.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {featuredProjects.length > 0 ? 'All Projects' : 'Projects'}
                <span className="text-sm font-normal text-foreground/60 ml-2">
                  ({totalFilteredProjects} project{totalFilteredProjects !== 1 ? 's' : ''} found)
                </span>
              </h2>
              {/* Equal height grid using flexbox approach */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularProjects.map((project, index) => (
                  <div key={index} className="h-full">
                    <ProjectCard
                      {...(project as any)}
                      tech={(project as any).tech || (project as any).techStack || (project as any).tech_stack || []}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          
          {totalFilteredProjects === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 text-foreground/40">
                <Search className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No projects found</h3>
              <p className="text-foreground/60 mb-8">
                {searchQuery ? (
                  <>No projects match "{searchQuery}". Try different keywords or </>
                ) : (
                  'No projects found in this category. Try '
                )}
                adjusting your filters.
              </p>
              <div className="space-x-4">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/20"
                  >
                    Clear Search
                  </button>
                )}
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-accent-blue hover:text-accent-blue hover:bg-accent-blue/5 transition-all duration-200"
                >
                  View All Projects
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-primary-300/5 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Interested in <span className="text-gradient">Collaborating?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              I'm always looking for opportunities to learn and contribute to Web3 projects. 
              Whether it's data analysis, learning collaborations, or entry-level opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/30">
                  Get In Touch
                </button>
              </Link>
              <Link href="/about">
                <button className="px-8 py-4 rounded-full border-2 border-gray-300 dark:border-gray-700 text-foreground font-semibold hover:border-accent-blue hover:text-accent-blue hover:bg-accent-blue/5 transition-all duration-200 shadow-lg shadow-accent-blue/20">
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