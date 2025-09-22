'use client'

import { useState, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Github, ExternalLink, BarChart3, FileText, Eye, Star, TrendingUp, Wrench, Sparkles, Target, Lightbulb } from 'lucide-react'
import { ImageViewer } from '@/components/ui/image-viewer'
import { logger } from '@/lib/logger'

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  imageAlt?: string
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
  onImageClick?: () => void
}

export const ProjectCard = memo(function ProjectCard({
  title,
  description,
  image,
  imageAlt,
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
  const [imageError, setImageError] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)


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
    <div style={{ minHeight: '600px' }}>
      <article
        className="group relative h-full rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ minHeight: '580px' }}
      >
      {/* Project thumbnail/hero visual */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden" style={{ minHeight: '200px' }}>
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">
                  Click to explore live data
                </span>
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )}

        {image && !imageError ? (
          <>
            <Image
              src={image}
              alt={imageAlt || `${title} project screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 cursor-pointer ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true)
                setImageLoaded(false)
                logger.warn('Failed to load project image', { image, title })
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowImageViewer(true)
              }}
              priority={featured}
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5N4ck+gdMOOAcI8tR8v9fNaXlEZdJvSVcxEV8lNgKdGh+GXPwP1cVpqJYqcvjc3LHhbJ8Cp5gM1Nt1tN7rvrsxvGc=" />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="text-white text-2xl w-8 h-8" />
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/80 rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Featured Badge */}
        {featured && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              <Star className="w-3 h-3 text-primary" />
              Featured
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Key Insight Preview */}
            <div className="p-3 bg-primary/5 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">Summary</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Tech Stack */}
            {tech && tech.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-foreground/60" />
                  <span className="text-xs font-medium text-foreground/60">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tech.slice(0, 4).map((technology, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                    >
                      {technology}
                    </span>
                  ))}
                  {tech.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs rounded-md">
                      +{tech.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Metrics */}
            {metrics && Object.keys(metrics).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-foreground/60" />
                  <span className="text-xs font-medium text-foreground/60">Key Metrics</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(metrics).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-sm font-bold text-primary">{value}</div>
                      <div className="text-xs text-foreground/60 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Features */}
            {features && features.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-foreground/60" />
                  <span className="text-xs font-medium text-foreground/60">Key Features</span>
                </div>
                <div className="space-y-1">
                  {features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="text-xs text-foreground/70 flex items-start gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {features.length > 3 && (
                    <div className="text-xs text-foreground/50">
                      +{features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Challenges */}
            {challenges && challenges.trim() && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-foreground/60" />
                  <span className="text-xs font-medium text-foreground/60">Challenges</span>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {challenges.length > 120 ? `${challenges.substring(0, 120)}...` : challenges}
                </p>
              </div>
            )}

            {/* Learnings */}
            {learnings && learnings.trim() && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-foreground/60" />
                  <span className="text-xs font-medium text-foreground/60">Key Learnings</span>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {learnings.length > 120 ? `${learnings.substring(0, 120)}...` : learnings}
                </p>
              </div>
            )}
          </div>
        </div>


        {/* Strategic Action Buttons */}
        <div className="space-y-3 mt-auto pt-4">
          {/* Primary button - Read More (blog post or external link) */}
          {blogPostSlug && blogPostSlug.trim() ? (
            (() => {
              const trimmedSlug = blogPostSlug.trim()
              const isExternalUrl = trimmedSlug.startsWith('http://') || trimmedSlug.startsWith('https://')

              // Debug logging
              logger.info('Blog post slug processing', {
                original: blogPostSlug,
                trimmed: trimmedSlug,
                isExternal: isExternalUrl,
                title: title
              })

              return isExternalUrl ? (
                <a
                  href={trimmedSlug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-primary/90 min-h-[44px]"
                  onClick={(e) => {
                    logger.info('External blog link clicked', { url: trimmedSlug, title })
                  }}
                  aria-label={`Read more about ${title} project`}
                >
                  <FileText className="w-4 h-4" />
                  <span>READ MORE</span>
                </a>
              ) : (
                <Link
                  href={`/blog/${trimmedSlug}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-primary/90 min-h-[44px]"
                  onClick={(e) => {
                    logger.info('Internal blog link clicked', { slug: trimmedSlug, title })
                  }}
                  aria-label={`Read detailed blog post about ${title} project`}
                >
                  <FileText className="w-4 h-4" />
                  <span>READ MORE</span>
                </Link>
              )
            })()
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed min-h-[44px]"
              title="No blog post available"
            >
              <FileText className="w-4 h-4" />
              <span>READ MORE</span>
            </button>
          )}

          {/* Secondary buttons - grid layout */}
          <div className="grid grid-cols-2 gap-3">
            {/* GitHub button */}
            {hasValidUrl(githubUrl) ? (
              <a
                href={githubUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[44px]"
                aria-label={`View ${title} source code on GitHub`}
              >
                <Github className="w-4 h-4" />
                <span>GITHUB</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed opacity-50 min-h-[44px]"
                title="GitHub URL not available"
              >
                <Github className="w-4 h-4" />
                <span>GITHUB</span>
              </button>
            )}

            {/* Dune button */}
            {hasValidUrl(duneUrl) ? (
              <a
                href={duneUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[44px]"
                aria-label={`Open ${title} dashboard in Dune Analytics`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>DUNE</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed opacity-50 min-h-[44px]"
                title="Dune URL not available"
              >
                <ExternalLink className="w-4 h-4" />
                <span>DUNE</span>
              </button>
            )}
          </div>
        </div>

      </div>
      </article>

      {/* Image Viewer Modal */}
      {image && (
        <ImageViewer
          src={image}
          alt={imageAlt || `${title} project screenshot`}
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  )
})