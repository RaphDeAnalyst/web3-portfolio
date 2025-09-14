'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'

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

  const statusColors = {
    'Live': 'bg-primary-600/20 text-primary-600 border-primary-600/30',
    'Development': 'bg-primary-500/20 text-primary-500 border-primary-500/30',
    'Beta': 'bg-primary-400/20 text-primary-400 border-primary-400/30',
    'Completed': 'bg-primary-600/20 text-primary-600 border-primary-600/30',
    'Learning': 'bg-primary-400/20 text-primary-400 border-primary-400/30',
    'Complete': 'bg-primary-600/20 text-primary-600 border-primary-600/30'
  }

  const phaseColors = {
    'Traditional Analytics': 'bg-primary-500/10 text-primary-500',
    'Exploratory Phase': 'bg-primary-400/10 text-primary-400',
    'Web3 Analytics': 'bg-primary-600/10 text-primary-600'
  }

  const categoryColors = {
    'Analytics': 'primary-600',
    'Smart Contracts': 'primary-500',
    'Dashboards': 'primary-400',
    'AI x Web3': 'primary-600',
    'DeFi': 'primary-500',
    'Learning': 'primary-400',
    'Infrastructure': 'primary-600'
  }

  // Dynamic sizing based on featured status and count
  const getCardSize = () => {
    if (!featured) return ''
    
    if (featuredCount === 1) {
      // Single featured project: spans 4 of 6 columns (2x width), centered
      return 'lg:col-span-4 lg:col-start-2'
    } else if (featuredCount === 2) {
      // Two featured projects: each gets 1.5x width (achieved through container max-width and equal columns)
      return 'col-span-1'
    } else if (featuredCount === 3) {
      // Three featured projects: each gets equal width in a 3-column grid
      return 'col-span-1'
    }
    
    return ''
  }
  
  const cardSize = getCardSize()

  return (
    <div 
      className={`group relative ${cardSize} rounded-2xl border border-gray-200/50 dark:border-gray-800/50 hover:border-accent-blue/50 hover:shadow-lg hover:shadow-accent-blue/20 bg-background/50 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
        featured ? 'p-4 sm:p-8 min-h-[500px] sm:min-h-[600px]' : 'p-4 sm:p-6 min-h-[500px] sm:min-h-[600px]'
      } flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 text-white text-xs font-medium">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Project Image/Preview */}
      <div className={`relative ${featured ? 'h-48 sm:h-64 mb-4 sm:mb-6' : 'h-40 sm:h-48 mb-4'} rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}>
        {image ? (
          <>
            <img
              src={image}
              alt={`${title} - Web3 ${category} project by Matthew Raphael featuring ${tech.slice(0, 3).join(', ')} technology stack`}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-600 to-transparent transform skew-x-12 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent"></div>
            </div>
            
            {/* Content */}
            <div className="relative text-center space-y-4 z-10">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary-500/20 animate-ping"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-primary-500/30"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-500/10 text-primary-500">
                {category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status]}`}>
                {status}
              </span>
              {timeline && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-foreground-secondary">
                  {timeline}
                </span>
              )}
            </div>
            {phase && (
              <div className="mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${phaseColors[phase as keyof typeof phaseColors]}`}>
                  {phase}
                </span>
              </div>
            )}
            <h3 className={`${featured ? 'text-lg sm:text-2xl' : 'text-lg sm:text-xl'} font-bold text-foreground group-hover:text-primary-500 transition-colors duration-200`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className={`text-foreground/70 leading-relaxed ${featured ? 'text-sm sm:text-base' : 'text-sm'}`}>
            {description}
          </p>
        </div>

        {/* Bottom Section - Metrics, Tech Stack, and Action Buttons */}
        <div className="mt-auto space-y-4">
          {/* Metrics (if provided) */}
          {metrics && (
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200/30 dark:border-gray-800/30">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="text-center space-y-1">
                  <div className="text-primary-500 font-bold text-lg">
                    {value}
                  </div>
                  <div className="text-xs text-foreground/60 capitalize">{key}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tech && tech.map((technology, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-muted text-foreground/70 hover:bg-primary-500/10 hover:text-primary-500 transition-colors duration-200 cursor-default"
              >
                {technology}
              </span>
            ))}
          </div>

          {/* Project Details - Two Row Layout */}
          {(features && features.length > 0) || (challenges && challenges.trim()) || (learnings && learnings.trim()) ? (
            <div className="space-y-3">
              {/* Top Row - Key Features and Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Features */}
                {features && features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Key Features</h4>
                    <div className="space-y-1">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                          <span className="text-xs text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenges */}
                {challenges && challenges.trim() && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Challenges</h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">{challenges}</p>
                  </div>
                )}
              </div>

              {/* Bottom Row - Key Learnings */}
              {learnings && learnings.trim() && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Key Learnings</h4>
                  <p className="text-xs text-foreground/70 leading-relaxed">{learnings}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* Action Buttons - Two Row Layout */}
          <div className="space-y-3">
            {/* Top Row - Always show Read More and GitHub buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Read More button */}
              {demoUrl && demoUrl !== '#' && demoUrl.trim() !== '' ? (
                <Link href={demoUrl} target="_blank" className="w-full">
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-accent-blue hover:bg-accent-blue-light text-white font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/20 text-center text-sm">
                    Read More
                  </button>
                </Link>
              ) : (
                <button 
                  disabled 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed opacity-60 text-center text-sm"
                  title="Demo URL not provided"
                >
                  Read More
                </button>
              )}
              
              {/* GitHub button */}
              {githubUrl && githubUrl !== '#' && githubUrl.trim() !== '' ? (
                <Link href={githubUrl} target="_blank" className="w-full">
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-accent-blue hover:text-accent-blue transition-colors duration-200 flex items-center justify-center text-sm">
                    <Github className="w-5 h-5" />
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60 flex items-center justify-center text-sm"
                  title="GitHub URL not provided"
                >
                  <Github className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Bottom Row - Additional buttons when provided */}
            {(duneUrl && duneUrl !== '#' && duneUrl.trim() !== '') || (blogPostSlug && blogPostSlug.trim() !== '') ? (
              <div className="grid grid-cols-2 gap-3">
                {duneUrl && duneUrl !== '#' && duneUrl.trim() !== '' && (
                  <Link href={duneUrl} target="_blank" className="w-full">
                    <button className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-accent-blue hover:text-accent-blue transition-colors duration-200 text-sm font-medium text-center">
                      Dashboard
                    </button>
                  </Link>
                )}
                {blogPostSlug && blogPostSlug.trim() !== '' && (
                  <Link href={`/blog/${blogPostSlug}`} className="w-full">
                    <button className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-accent-blue hover:text-accent-blue transition-colors duration-200 text-sm font-medium text-center">
                      Read Blog Post
                    </button>
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  )
}