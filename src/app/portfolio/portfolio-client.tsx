'use client'

import { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'

// Lazy load ProjectCard for non-featured projects
const ProjectCard = dynamic(() => import('@/components/ui/project-card').then(mod => ({ default: mod.ProjectCard })), {
  loading: () => (
    <div className="h-full rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ minHeight: '600px' }}>
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false
})

// Import eager loading for featured projects
import { ProjectCard as ProjectCardEager } from '@/components/ui/project-card'
import { FilterTabs } from '@/components/ui/filter-tabs'
import { projectCategories, Project } from '@/data/projects'
import type { Project as ServiceProject } from '@/types/shared'
import { Search, X } from 'lucide-react'

interface PortfolioClientProps {
  initialProjects: (Project | ServiceProject)[]
}

export function PortfolioClient({ initialProjects }: PortfolioClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  // Filter and separate featured and regular projects
  const { featuredProjects, regularProjects } = useMemo(() => {
    let filtered = activeCategory === 'All'
      ? initialProjects
      : initialProjects.filter(project => project.category === activeCategory)

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
  }, [activeCategory, sortBy, searchQuery, initialProjects])

  // Calculate project counts for each category
  const projectCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      'All': initialProjects.length
    }

    projectCategories.forEach(category => {
      if (category !== 'All') {
        counts[category] = initialProjects.filter(p => p.category === category).length
      }
    })

    return counts
  }, [initialProjects])

  // Total filtered projects for display
  const totalFilteredProjects = featuredProjects.length + regularProjects.length

  return (
    <>
      {/* Controls Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto py-4">

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 px-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm sm:text-base min-h-[48px]"
                aria-label="Search projects by title, description, or technology"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40">
                <Search className="w-5 h-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors duration-200"
                  aria-label="Clear search"
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-2 sm:p-1 rounded-2xl sm:rounded-full bg-background/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-foreground/60 px-2 sm:px-3">Sort by:</span>
              {[
                { label: 'Newest', value: 'newest' },
                { label: 'Featured', value: 'featured' },
                { label: 'Name', value: 'name' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] ${
                    sortBy === option.value
                      ? 'bg-primary-500/20 text-primary-500'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  aria-label={`Sort projects by ${option.label}`}
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
            <div className={`grid gap-6 sm:gap-8 ${
              featuredProjects.length === 1
                ? 'grid-cols-1 max-w-2xl mx-auto'
                : featuredProjects.length === 2
                ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto'
            }`}>
              {featuredProjects.map((project, index) => (
                <ProjectCardEager
                  key={`featured-${index}`}
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
              {/* Dynamic grid layout for regular projects */}
              <div className={`grid gap-6 sm:gap-8 ${
                regularProjects.length === 1
                  ? 'grid-cols-1 max-w-2xl mx-auto'
                  : regularProjects.length === 2
                  ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto'
                  : regularProjects.length === 3
                  ? 'grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto'
                  : regularProjects.length <= 4
                  ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto'
                  : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto'
              }`}>
                {regularProjects.map((project, index) => (
                  <ProjectCard
                    key={`regular-${index}`}
                    {...(project as any)}
                    tech={(project as any).tech || (project as any).techStack || (project as any).tech_stack || []}
                  />
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
                  <>No projects match &quot;{searchQuery}&quot;. Try different keywords or </>
                ) : (
                  'No projects found in this category. Try '
                )}
                adjusting your filters.
              </p>
              <div className="space-x-4">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 rounded-storj bg-storj-navy text-white font-medium hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200 shadow-storj"
                    aria-label="Clear search and show all projects"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => setActiveCategory('All')}
                  className="px-6 py-3 rounded-storj border border-gray-300 text-gray-700 hover:border-storj-blue hover:text-storj-blue hover:bg-storj-blue/5 transition-all duration-200"
                  aria-label="View all projects without category filter"
                >
                  View All Projects
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}