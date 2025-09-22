import { Suspense } from 'react'
import { ProjectCard } from '@/components/ui/project-card'
import { FilterTabs } from '@/components/ui/filter-tabs'
import { projectCategories, Project } from '@/data/projects'
import type { Project as ServiceProject } from '@/types/shared'
import { projectService } from '@/lib/service-switcher'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { logger } from '@/lib/logger'
import { PortfolioClient } from './portfolio-client'
import { StructuredData } from '@/components/seo/structured-data'

// Export metadata for SEO
export const metadata = {
  title: 'Portfolio | Matthew Raphael - Web3 Analytics & Data Science',
  description: 'Explore how I apply traditional analytics skills to Web3 insights, bridging the gap between established data methods and decentralized ecosystems.',
  openGraph: {
    title: 'Portfolio | Matthew Raphael - Web3 Analytics & Data Science',
    description: 'Explore how I apply traditional analytics skills to Web3 insights, bridging the gap between established data methods and decentralized ecosystems.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Matthew Raphael - Web3 Analytics & Data Science',
    description: 'Explore how I apply traditional analytics skills to Web3 insights, bridging the gap between established data methods and decentralized ecosystems.',
  },
}

// Server component that fetches data at build time
export default async function Portfolio() {
  let projects: (Project | ServiceProject)[] = []

  try {
    projects = await projectService.getAllProjects()
  } catch (error) {
    logger.error('Error loading projects:', error)
    // Fallback to empty array for better UX
  }

  return (
    <>
      <StructuredData projects={projects} type="portfolio" />
      <div className="min-h-screen pt-28 pb-20 sm:pt-32" style={{ scrollBehavior: 'smooth' }}>
        {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-green-500">Portfolio</span>
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="text-gradient">Learning Projects</span>
            <br />
            <span className="text-foreground">& Case Studies</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Explore how I apply <span className="text-foreground font-medium">traditional analytics skills</span> to
            <span className="text-foreground font-medium"> Web3 insights</span>, bridging the gap between established data methods and
            <span className="text-foreground font-medium"> decentralized ecosystems</span>
          </p>
        </div>
      </section>

      {/* Client-side interactive components */}
      <Suspense fallback={
        <div className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            {/* Controls skeleton */}
            <div className="py-4 mb-16">
              <div className="max-w-2xl mx-auto mb-6">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
              </div>
              <div className="flex justify-center mb-8">
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project cards skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-full" style={{ minHeight: '600px' }}>
                  <div className="h-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse">
                    <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <PortfolioClient initialProjects={projects} />
      </Suspense>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-primary-300/5 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Interested in <span className="text-gradient">Collaborating?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              I&apos;m always looking for opportunities to learn and contribute to Web3 projects.
              Whether it&apos;s data analysis, learning collaborations, or entry-level opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" aria-label="Contact Matthew Raphael for collaboration opportunities">
                <button className="w-full sm:w-auto min-w-[160px] min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 rounded-storj bg-storj-navy text-white font-semibold hover:bg-storj-blue hover:transform hover:translate-y-[-2px] transition-all duration-200 shadow-storj-lg">
                  Get In Touch
                </button>
              </Link>
              <Link href="/about" aria-label="Learn more about Matthew Raphael's background and skills">
                <button className="w-full sm:w-auto min-w-[160px] min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 rounded-storj border-2 border-gray-300 text-gray-700 font-semibold hover:border-storj-blue hover:text-storj-blue hover:bg-storj-blue/5 transition-all duration-200 shadow-storj">
                  Learn About Me
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}