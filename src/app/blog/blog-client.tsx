'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { BlogPostData } from '@/types/shared'
import { Search, X } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic imports to reduce initial bundle size
const EnhancedMediumBlogCard = dynamic(() =>
  import('@/components/ui/enhanced-medium-blog-card').then(m => ({ default: m.EnhancedMediumBlogCard })),
  {
    loading: () => (
      <div className="max-w-6xl mx-auto min-h-[400px] flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }
)

const MediumBlogFeed = dynamic(() =>
  import('@/components/ui/medium-blog-feed').then(m => ({ default: m.MediumBlogFeed })),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto space-y-6 min-h-[600px]">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }
)

const NewsletterSignup = dynamic(() =>
  import('@/components/ui/newsletter-signup').then(m => ({ default: m.NewsletterSignup })),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto min-h-[300px] flex items-center">
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }
)

interface BlogClientProps {
  initialPosts: BlogPostData[]
  initialCategories: string[]
  initialProfile: {
    name: string
    avatar: string
  }
}

export function BlogClient({ initialPosts, initialCategories, initialProfile }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const contentRef = useRef<HTMLDivElement>(null)

  // Use pre-loaded data - no API calls needed
  const posts = initialPosts.map(post => ({
    ...post,
    author: {
      name: initialProfile.name,
      avatar: initialProfile.avatar || post.author.avatar
    }
  }))

  // Memoize categories array to prevent dependency changes
  const categories = useMemo(() => ['All', ...initialCategories], [initialCategories])

  // Filter and separate featured and regular posts
  const { featuredPosts, regularPosts } = useMemo(() => {
    let filtered = selectedCategory === 'All'
      ? posts
      : posts.filter(post => post.category === selectedCategory)

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.summary.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
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

  // Memoized handlers to prevent forced reflows
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
  }, [])

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(tag.toLowerCase())
  }, [])

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
                onChange={handleSearchChange}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40">
                <Search className="w-5 h-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
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
                  onClick={() => handleCategorySelect(category)}
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
                  onClick={() => handleSortChange(option.value)}
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
                  <>No articles match &quot;{searchQuery}&quot;. Try different keywords or </>
                ) : (
                  'No articles found in this category. Try '
                )}
                adjusting your search or category filter.
              </p>
              <div className="space-x-4">
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-3 rounded-full bg-foreground hover:bg-foreground/80 text-background font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => handleCategorySelect('All')}
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
                onClick={() => handleTagClick(tag)}
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