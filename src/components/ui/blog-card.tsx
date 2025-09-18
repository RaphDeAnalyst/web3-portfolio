'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { profileService } from '@/lib/service-switcher'
import { viewTracker } from '@/lib/view-tracking'
import { calculateReadingTime } from '@/lib/reading-time'
import { ImageViewer } from '@/components/ui/image-viewer'
import { logger } from '@/lib/logger'

interface BlogCardProps {
  title: string
  summary: string
  date: string
  readTime?: string
  tags: string[]
  slug: string
  featured?: boolean
  author?: {
    name: string
    avatar?: string
  }
  featuredImage?: string
  image?: string
  category: string
  featuredCount?: number
  content?: string
}

export function BlogCard({
  title,
  summary,
  date,
  readTime,
  tags,
  slug,
  featured = false,
  author,
  featuredImage,
  image,
  category,
  featuredCount = 0,
  content = ''
}: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [showImageViewer, setShowImageViewer] = useState(false)

  // Calculate reading time if not provided
  const calculatedReadTime = readTime || (content ? calculateReadingTime(content) : '5 min read')

  useEffect(() => {
    // Set hydrated state and update profile data when component mounts
    setIsHydrated(true)
    
    const updateProfile = async () => {
      try {
        const profile = await profileService.getProfile()
        setProfileData(profile)
      } catch (error) {
        logger.error('Error loading profile:', error)
      }
    }
    
    updateProfile()
    
    // Get view count for this post
    setViewCount(viewTracker.getViewCount(slug))
    
    // Listen for storage changes to update profile in real-time
    const handleStorageChange = () => updateProfile()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('profileUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileUpdated', handleStorageChange)
    }
  }, [slug])

  const categoryColors = {
    'Web3': 'primary-600',
    'AI': 'primary-500',
    'Analytics': 'primary-500',
    'DeFi': 'primary-600',
    'Tutorial': 'primary-400',
    'Research': 'primary-500'
  }

  // Dynamic sizing based on featured status and count
  const getCardSize = () => {
    if (!featured) return ''
    
    if (featuredCount === 1) {
      // Single featured post: spans 4 of 6 columns (2x width), centered
      return 'lg:col-span-4 lg:col-start-2'
    } else if (featuredCount === 2) {
      // Two featured posts: each gets 1.5x width (achieved through container max-width and equal columns)
      return 'col-span-1'
    } else if (featuredCount === 3) {
      // Three featured posts: each gets equal width in a 3-column grid
      return 'col-span-1'
    }
    
    return ''
  }
  
  const cardSize = getCardSize()

  return (
    <Fragment>
    <Link href={`/blog/${slug}`} className={`${cardSize}`}>
      <article
        className="group h-full p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 card-hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-50/50 dark:bg-gray-800/50"></div>
        

        {/* Article Image */}
        {(featuredImage || image || featured) && (
          <div className={`relative ${featured ? 'h-32 sm:h-48 md:h-64 mb-3 sm:mb-4 md:mb-6' : 'h-28 sm:h-40 md:h-48 mb-3 sm:mb-4'} rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}>
            {(featuredImage || image) ? (
              <>
                <img
                  src={featuredImage || image}
                  alt={`${title} - Web3 ${category} article by Matthew Raphael covering ${tags.slice(0, 3).join(', ')} blockchain analytics topics`}
                  className={`w-full h-full object-contain transition-all duration-300 cursor-pointer ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } ${isHovered ? 'scale-105' : ''}`}
                  onLoad={() => setImageLoaded(true)}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowImageViewer(true)
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4" style={{ backgroundColor: '#2a7fc9' }}>
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight text-center break-words max-w-full">
                    {title}
                  </h3>
                </div>
              </div>
            )}
            
            {/* Read overlay */}
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="px-6 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium">
                Read Article
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 space-y-4 flex-grow flex flex-col">
          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-500/10 text-primary-500">
                {category}
              </span>
              <div className="flex items-center space-x-2 text-xs text-foreground/60">
                <span>{date}</span>
                <span>•</span>
                <span>{calculatedReadTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`${featured ? 'text-lg sm:text-2xl lg:text-3xl' : 'text-xl'} font-bold text-foreground group-hover:text-foreground/80 transition-colors duration-200`}>
            {title}
          </h3>

          {/* Summary */}
          <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
            {summary}
          </p>

          {/* Author */}
          {author && (
            <div className="flex items-center space-x-3 pt-4 border-t border-text-light-primary/10 dark:border-text-dark-primary/10 mt-auto">
              {isHydrated && profileData?.avatar && profileData.avatar !== '/avatar.jpg' && profileData.avatar.startsWith('http') ? (
                <img
                  src={profileData.avatar}
                  alt={`${author.name} - Web3 Data Analyst and Blockchain Analytics Expert profile picture`}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-sm">
                  {author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-foreground">{author.name}</div>
                <div className="text-xs text-foreground/60 truncate">
                  <span className="sm:hidden">
                    {author.name === 'Matthew Raphael' ? 'RaphdeAnalyst • Web3 Data & AI' :
                     (isHydrated && profileData ? profileData.title : 'Web3 Data & AI Specialist')}
                  </span>
                  <span className="hidden sm:inline">
                    {author.name === 'Matthew Raphael' ? 'RaphdeAnalyst • Web3 Data & AI Specialist' :
                     (isHydrated && profileData ? profileData.title : 'Web3 Data & AI Specialist')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
            {tags.slice(0, featured ? 6 : 4).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/60 hover:bg-primary-500/10 hover:text-primary-500 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {tags.length > (featured ? 6 : 4) && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/60">
                +{tags.length - (featured ? 6 : 4)} more
              </span>
            )}
          </div>

          {/* Read More */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-foreground/60">Continue reading</span>
            <span className="font-medium text-foreground/80 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200">
              Read More →
            </span>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
      </article>
    </Link>

    {/* Image Viewer Modal */}
    {(featuredImage || image) && (
      <ImageViewer
        src={featuredImage || image!}
        alt={`${title} - Web3 ${category} article`}
        isOpen={showImageViewer}
        onClose={() => setShowImageViewer(false)}
      />
    )}
  </Fragment>
  )
}