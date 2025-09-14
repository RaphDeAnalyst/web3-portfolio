'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { profileService } from '@/lib/service-switcher'
import { viewTracker } from '@/lib/view-tracking'

interface BlogCardProps {
  title: string
  summary: string
  date: string
  readTime: string
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
  featuredCount = 0
}: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    // Set hydrated state and update profile data when component mounts
    setIsHydrated(true)
    
    const updateProfile = async () => {
      try {
        const profile = await profileService.getProfile()
        setProfileData(profile)
      } catch (error) {
        console.error('Error loading profile:', error)
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
    'Web3': 'cyber-500',
    'AI': 'purple-500',
    'Analytics': 'primary-500',
    'DeFi': 'green-500',
    'Tutorial': 'yellow-500',
    'Research': 'blue-500'
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
    <Link href={`/blog/${slug}`} className={`${cardSize}`}>
      <div 
        className={`group relative rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm card-hover overflow-hidden ${
          featured ? 'p-4 sm:p-8 min-h-[500px] sm:min-h-[600px]' : 'p-4 sm:p-6 min-h-[400px] sm:min-h-[500px]'
        } flex flex-col cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyber-500 to-primary-500 text-white text-xs font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>Featured</span>
            </div>
          </div>
        )}

        {/* Article Image */}
        {(featuredImage || image || featured) && (
          <div className={`relative ${featured ? 'h-48 sm:h-64 mb-4 sm:mb-6' : 'h-40 sm:h-48 mb-4'} rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}>
            {(featuredImage || image) ? (
              <>
                <img
                  src={featuredImage || image}
                  alt={`${title} - Web3 ${category} article by Matthew Raphael covering ${tags.slice(0, 3).join(', ')} blockchain analytics topics`}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } ${isHovered ? 'scale-110' : ''}`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} to-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/70 flex items-center justify-center text-white text-sm font-bold`}>
                    {category.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="text-sm text-foreground/60">Blog Post</div>
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
              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/10 text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}`}>
                {category}
              </span>
              <div className="flex items-center space-x-2 text-xs text-foreground/60">
                <span>{date}</span>
                <span>•</span>
                <span>{readTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`${featured ? 'text-lg sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'} font-bold text-foreground group-hover:text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} transition-colors duration-200 leading-tight`}>
            {title}
          </h3>

          {/* Summary */}
          <p className={`text-foreground/70 leading-relaxed ${featured ? 'text-sm sm:text-base' : 'text-sm'} line-clamp-3`}>
            {summary}
          </p>

          {/* Author */}
          {author && (
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200/30 dark:border-gray-800/30 mt-auto">
              {isHydrated && profileData?.avatar && profileData.avatar !== '/avatar.jpg' && profileData.avatar.startsWith('http') ? (
                <img
                  src={profileData.avatar}
                  alt={`${author.name} - Web3 Data Analyst and Blockchain Analytics Expert profile picture`}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white font-bold text-sm">
                  {author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-foreground">{author.name}</div>
                <div className="text-xs text-foreground/60">
                  {author.name === 'Matthew Raphael' ? 'RaphdeAnalyst • Web3 Data & AI Specialist' : 
                   (isHydrated && profileData ? profileData.title : 'Web3 Data & AI Specialist')}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
            {tags.slice(0, featured ? 6 : 4).map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/60 hover:bg-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/10 hover:text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} transition-colors duration-200`}
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

          {/* Read More Indicator */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-sm text-foreground/60">
              <span>Continue reading</span>
              <span className={`text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} group-hover:translate-x-1 transition-transform duration-200`}>
                →
              </span>
            </div>
            
            {/* Engagement metrics */}
            <div className="flex items-center space-x-4 text-xs text-foreground/50">
              <div className="flex items-center space-x-1">
                <span className="text-sm">Views</span>
                <span>{viewTracker.getFormattedViewCount(slug)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Accent */}
        <div className={`absolute top-4 left-4 w-2 h-2 rounded-full bg-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} opacity-60 group-hover:opacity-100 transition-opacity duration-200`}></div>
      </div>
    </Link>
  )
}