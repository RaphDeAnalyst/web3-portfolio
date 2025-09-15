'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Github, ExternalLink, BarChart3, FileText } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  tech: string[]
  category: string
  status: 'Live' | 'Development' | 'Beta' | 'Completed' | 'Learning' | 'Complete'
  demoUrl?: string
  githubUrl?: string
  duneUrl?: string
  blogPostSlug?: string
  metrics?: Record<string, string>
  features?: string[]
  challenges?: string
  learnings?: string
  featured?: boolean
  timeline?: '2022-2023' | '2024' | '2025'
  phase?: 'Traditional Analytics' | 'Exploratory Phase' | 'Web3 Analytics'
  featuredCount?: number
}

export function ProjectCard({
  title,
  description,
  image,
  tech,
  category,
  status,
  demoUrl,
  githubUrl,
  duneUrl,
  blogPostSlug,
  metrics,
  features,
  challenges,
  learnings,
  featured = false,
  timeline,
  phase,
  featuredCount = 0
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Debug: Log the tech array to see what's being passed
  console.log('ProjectCard tech:', tech, 'Type:', typeof tech, 'Array?', Array.isArray(tech))

  const statusColors = {
    'Live': 'bg-accent-green/10 text-accent-green border-accent-green/20',
    'Development': 'bg-storj-navy/10 text-storj-navy border-storj-navy/20',
    'Beta': 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
    'Completed': 'bg-accent-green/10 text-accent-green border-accent-green/20',
    'Learning': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    'Complete': 'bg-accent-green/10 text-accent-green border-accent-green/20'
  }

  const phaseColors = {
    'Traditional Analytics': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    'Exploratory Phase': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    'Web3 Analytics': 'bg-primary-500/10 text-primary-500'
  }

  // Validate URLs
  const hasValidUrl = (url?: string) => url && url !== '#' && url.trim() !== ''

  return (
    <article
      className="group relative h-full rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">FEATURED</span>
          </div>
        </div>
      )}

      {/* Project thumbnail/hero visual */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {image ? (
          <>
            <img
              src={image}
              alt={`${title} project screenshot`}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-primary-600/10" />
            <div className="relative text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Preview Coming Soon</div>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="relative flex-1 p-6 flex flex-col">
        {/* Header section */}
        <div className="mb-4">
          {/* Status badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
              {category}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[status]}`}>
              {status}
            </span>
            {timeline && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {timeline}
              </span>
            )}
          </div>

          {/* Phase badge */}
          {phase && (
            <div className="mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${phaseColors[phase as keyof typeof phaseColors]}`}>
                {phase}
              </span>
            </div>
          )}

          {/* Project title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {title}
          </h3>
        </div>

        {/* Description (2-3 lines max) */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        {/* Metrics section (if provided) */}
        {metrics && Object.keys(metrics).length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(metrics).slice(0, 4).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges & Solutions (if provided) */}
        {(challenges || learnings) && (
          <div className="mb-6 space-y-4">
            {challenges && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Challenges</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{challenges}</p>
              </div>
            )}
            {learnings && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Solutions & Learnings</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{learnings}</p>
              </div>
            )}
          </div>
        )}

        {/* Tech stack badges */}
        {tech && tech.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-1.5">
              {tech.slice(0, 6).map((technology, index) => (
                <span
                  key={index}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  {technology}
                </span>
              ))}
              {tech.length > 6 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500">
                  +{tech.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto space-y-3">
          {/* Primary buttons row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Read More button */}
            {hasValidUrl(demoUrl) ? (
              <Link href={demoUrl!} target="_blank" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-sm transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg min-h-[44px]">
                  <ExternalLink className="w-4 h-4" />
                  <span>Read More</span>
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-400 rounded-xl font-medium text-sm cursor-not-allowed opacity-60 min-h-[44px]"
                title="Demo URL not available"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Read More</span>
              </button>
            )}

            {/* GitHub button */}
            {hasValidUrl(githubUrl) ? (
              <Link href={githubUrl!} target="_blank" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-300 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium text-sm transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg min-h-[44px]">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-400 rounded-xl font-medium text-sm cursor-not-allowed opacity-60 min-h-[44px]"
                title="GitHub URL not available"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            )}
          </div>

          {/* Secondary buttons row (conditional) */}
          {(hasValidUrl(duneUrl) || hasValidUrl(blogPostSlug)) && (
            <div className="grid grid-cols-2 gap-3">
              {hasValidUrl(duneUrl) && (
                <Link href={duneUrl!} target="_blank" className="w-full">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl font-medium text-sm transition-all duration-200 hover:transform hover:scale-105 min-h-[44px]">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                </Link>
              )}
              {hasValidUrl(blogPostSlug) && (
                <Link href={`/blog/${blogPostSlug}`} className="w-full">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-accent-blue/30 dark:border-accent-blue/60 text-accent-blue hover:bg-accent-blue/10 dark:hover:bg-accent-blue/20 rounded-xl font-medium text-sm transition-all duration-200 hover:transform hover:scale-105 min-h-[44px]">
                    <FileText className="w-4 h-4" />
                    <span>Read Blog</span>
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}