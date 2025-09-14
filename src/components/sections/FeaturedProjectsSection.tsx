'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { ProjectCard } from '@/components/ui/project-card'
import { projectService } from '@/lib/service-switcher'

interface FeaturedProjectsSectionProps {
  featuredProjects?: any[]
  loading?: boolean
}

const FeaturedProjectsSection = memo(function FeaturedProjectsSection({ featuredProjects = [], loading = false }: FeaturedProjectsSectionProps) {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/30">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-accent-blue/30 bg-accent-blue/5 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-accent-blue rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-accent-blue">Featured Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Highlighted <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            From traditional analytics to Web3 insights - explore key projects showcasing my analytical journey
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
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
                {...project} 
                featuredCount={featuredProjects.length}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No Featured Projects</h3>
            <p className="text-foreground/60 mb-6">
              Featured projects will appear here once they're selected in the admin panel.
            </p>
            <Link href="/portfolio">
              <button className="px-6 py-3 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-medium shadow-lg shadow-accent-blue/20 transition-all duration-200">
                View All Projects
              </button>
            </Link>
          </div>
        )}

        {/* View All Projects CTA */}
        {featuredProjects.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/portfolio">
              <button className="px-10 py-4 rounded-full bg-accent-blue hover:bg-accent-blue-light text-white font-semibold text-lg shadow-2xl shadow-accent-blue/20 transition-all duration-200">
                View All Projects
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
})

export { FeaturedProjectsSection }