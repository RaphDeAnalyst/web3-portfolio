'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { EnhancedMediumBlogCard } from '@/components/ui/enhanced-medium-blog-card'
import { MediumBlogFeed } from '@/components/ui/medium-blog-feed'
import { NewsletterSignup } from '@/components/ui/newsletter-signup'
import { blogService, profileService } from '@/lib/service-switcher'
import { BlogPostData } from '@/types/shared'
import { Search, X } from 'lucide-react'
import { logger } from '@/lib/logger'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [posts, setPosts] = useState<BlogPostData[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [isLoaded, setIsLoaded] = useState(false)
  const [authorInfo, setAuthorInfo] = useState<{ name: string; avatar: string } | null>(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profile info for author data
        const profile = await profileService.getProfile()
        const currentAuthor = {
          name: profile.name,
          avatar: profile.avatar
        }
        setAuthorInfo(currentAuthor)

        // Load blog posts
        const publishedPosts = await blogService.getPublishedPosts()

        // Update posts with current profile info if needed
        const updatedPosts = publishedPosts.map((post: any) => ({
          ...post,
          author: {
            name: currentAuthor.name,
            avatar: currentAuthor.avatar || post.author.avatar
          }
        }))

        setPosts(updatedPosts)

        const allCategories = ['All', ...await blogService.getCategories()]
        setCategories(allCategories)
      } catch (error) {
        logger.error('Error loading blog data:', error)
        // Fallback to original posts if profile loading fails
        try {
          const publishedPosts = await blogService.getPublishedPosts()
          setPosts(publishedPosts)
          const allCategories = ['All', ...await blogService.getCategories()]
          setCategories(allCategories)
        } catch (fallbackError) {
          logger.error('Error loading fallback posts:', fallbackError)
        }
      } finally {
        setIsLoaded(true)
      }
    }

    // Use requestIdleCallback to defer heavy loading after initial render
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        loadData()
      }, { timeout: 3000 })

      // Store the callback for cleanup
      const cleanup = () => {
        if (idleCallback) {
          window.cancelIdleCallback(idleCallback)
        }
      }

      return cleanup
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(loadData, 50)
      return () => clearTimeout(timeoutId)
    }
    
    // Listen for storage changes
    const handleStorageChange = async () => {
      await loadData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])


  // Filter and separate featured and regular posts
  const { featuredPosts, regularPosts } = useMemo(() => {
    let filtered = selectedCategory === 'All' 
      ? posts 
      : posts.filter(post => post.category === selectedCategory)

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort posts
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'newest') return 0 // Keep original order
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

    // Separate featured and regular posts
    const featured = sorted.filter(post => post.featured).slice(0, 3) // Max 3 featured
    const regular = sorted.filter(post => !post.featured)

    return {
      featuredPosts: featured,
      regularPosts: regular
    }
  }, [selectedCategory, searchQuery, sortBy, posts])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { 'All': posts.length }
    categories.forEach(category => {
      if (category !== 'All') {
        counts[category] = posts.filter(p => p.category === category).length
      }
    })
    return counts
  }, [posts, categories])

  // Total filtered posts for display
  const totalFilteredPosts = featuredPosts.length + regularPosts.length

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen py-16 sm:py-20">
        {/* Hero Section Loading */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-20 mx-auto mb-8 animate-pulse"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
        </section>

        {/* Controls Loading */}
        <section className="px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 lg:mb-16">
          <div className="max-w-7xl mx-auto py-4">
            <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 lg:mb-12">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Loading */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-foreground/60 text-lg">Loading articles...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20" style={{ scrollBehavior: 'smooth' }}>
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-orange-500">Blog</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
            <span className="text-gradient">Web3 Insights</span>
            <br />
            <span className="text-foreground">& Analysis</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Deep dives into <span className="text-foreground font-medium">blockchain analytics</span>,
            <span className="text-foreground font-medium"> AI applications</span>, and
            <span className="text-foreground font-medium"> Web3 development</span>
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 lg:mb-16">
        <div className="max-w-7xl mx-auto py-4">
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4 sm:mb-6 px-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
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

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 lg:mb-12">
            {categories.map((category) => {
              const isActive = selectedCategory === category
              const count = categoryCounts[category] || 0

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative group px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] ${
                    isActive
                      ? 'bg-transparent text-black dark:text-white border-2 border-black dark:border-white font-bold'
                      : 'bg-background/50 text-black/70 dark:text-white/70 border-2 border-border'
                  } backdrop-blur-sm`}
                >

                  {/* Content */}
                  <div className="relative z-10 flex items-center space-x-2">
                    <span>{category}</span>

                    {/* Count badge */}
                    <div className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                        : 'bg-muted text-black/60 dark:text-white/60'
                    } transition-colors duration-300`}>
                      {count}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground animate-pulse"></div>
                  )}

                </button>
              )
            })}
          </div>

          {/* Sort Controls */}
          <div className="flex justify-center mb-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-2 sm:p-1 rounded-2xl sm:rounded-full bg-background/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-foreground/60 px-2 sm:px-3">Sort by:</span>
              {[
                { label: 'Newest', value: 'newest' },
                { label: 'Featured', value: 'featured' },
                { label: 'Title', value: 'title' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    sortBy === option.value
                      ? 'bg-foreground/10 text-foreground'
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

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section ref={contentRef} className="px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 lg:mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Articles</h2>
            <EnhancedMediumBlogCard
              posts={featuredPosts}
              className="max-w-6xl mx-auto"
            />
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className={`px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20 ${featuredPosts.length === 0 ? '' : ''}`} ref={featuredPosts.length === 0 ? contentRef : undefined}>
        <div className="max-w-7xl mx-auto">
          {regularPosts.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {featuredPosts.length > 0 ? 'All Articles' : 'Articles'}
              </h2>
              <MediumBlogFeed
                posts={regularPosts}
                className="max-w-4xl mx-auto"
              />
            </>
          )}

          {totalFilteredPosts === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 text-foreground/40">
                <Search className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No articles found</h3>
              <p className="text-foreground/60 mb-6">
                {searchQuery ? (
                  <>No articles match "{searchQuery}". Try different keywords or </>
                ) : (
                  'No articles found in this category. Try '
                )}
                adjusting your search or category filter.
              </p>
              <div className="space-x-4">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 rounded-full bg-foreground hover:bg-foreground/80 text-background font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200 shadow-lg shadow-foreground/20"
                >
                  View All Articles
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Tags */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Popular <span className="text-gradient">Topics</span>
            </h2>
            <p className="text-foreground/70">
              Explore articles by the most discussed topics in Web3
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'DeFi', 'Analytics', 'Smart-Contracts', 'AI', 'Machine-Learning',
              'Security', 'DAO', 'Cross-Chain', 'MEV', 'Governance', 'Tutorial'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag.toLowerCase())}
                className="px-4 py-2 rounded-full bg-background/80 border border-gray-200/50 dark:border-gray-800/50 text-foreground/70 hover:border-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 backdrop-blur-sm text-sm"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  )
}