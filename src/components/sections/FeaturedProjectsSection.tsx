'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { ProjectCard } from '@/components/ui/project-card'
import { projectService } from '@/lib/service-switcher'
import { Construction } from 'lucide-react'

interface FeaturedProjectsSectionProps {
  featuredProjects?: any[]
  loading?: boolean
}

const FeaturedProjectsSection = memo(function FeaturedProjectsSection({ featuredProjects = [], loading = false }: FeaturedProjectsSectionProps) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/30">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-accent-blue/30 bg-accent-blue/5 backdrop-blur-sm mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-accent-blue rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-accent-blue">Featured Work</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Highlighted <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto px-4">
            From traditional analytics to Web3 insights - explore key projects showcasing my analytical journey
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-80 sm:h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className={`grid gap-6 sm:gap-8 ${
            featuredProjects.length === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : featuredProjects.length === 2
              ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto'
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
          <div className="text-center py-16 sm:py-20">
            <div className="mb-4 flex justify-center">
              <Construction className="w-16 h-16 sm:w-24 sm:h-24 text-foreground/40" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">No Featured Projects</h3>
            <p className="text-sm sm:text-base text-foreground/60 mb-6 px-4">
              Featured projects will appear here once they&apos;re selected in the admin panel.
            </p>
            <Link href="/portfolio">
              <button className="px-6 py-3 bg-storj-navy text-white rounded-storj font-medium hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200 text-sm sm:text-base">
                View All Projects
              </button>
            </Link>
          </div>
        )}

        {/* View All Projects CTA */}
        {featuredProjects.length > 0 && (
          <div className="text-center mt-12 sm:mt-16">
            <Link href="/portfolio">
              <button className="px-8 sm:px-10 py-3 sm:py-4 bg-storj-navy text-white rounded-storj font-semibold text-base sm:text-lg hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200 shadow-storj-lg">
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