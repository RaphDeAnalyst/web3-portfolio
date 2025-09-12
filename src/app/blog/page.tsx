'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { BlogCard } from '@/components/ui/blog-card'
import { NewsletterSignup } from '@/components/ui/newsletter-signup'
import { blogService } from '@/lib/service-switcher'
import { BlogPostData } from '@/lib/blog-service'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [posts, setPosts] = useState<BlogPostData[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFilterBarSticky, setIsFilterBarSticky] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const filterBarPlaceholderRef = useRef<HTMLDivElement>(null)
  const [stickyBarHeight, setStickyBarHeight] = useState(64)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const publishedPosts = await blogService.getPublishedPosts()
        setPosts(publishedPosts)
        
        const allCategories = ['All', ...await blogService.getCategories()]
        setCategories(allCategories)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadPosts()
    
    // Listen for storage changes
    const handleStorageChange = async () => {
      await loadPosts()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Handle sticky filter bar with Intersection Observer (Facebook/Meta approach)
  useEffect(() => {
    if (!filterBarPlaceholderRef.current || !filterBarRef.current || !isLoaded) return

    // Measure actual sticky bar height dynamically
    const measureHeight = () => {
      if (filterBarRef.current) {
        const height = filterBarRef.current.getBoundingClientRect().height
        setStickyBarHeight(height)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the placeholder is not visible, the filter bar should be sticky
        const shouldBeSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0
        
        // Measure height before switching to sticky to prevent flash
        if (shouldBeSticky && !isFilterBarSticky) {
          measureHeight()
        }
        
        // Small delay to prevent flicker
        requestAnimationFrame(() => {
          setIsFilterBarSticky(shouldBeSticky)
        })
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px' // Slightly offset to prevent flickering
      }
    )

    // Initial height measurement
    measureHeight()
    
    // Re-measure on window resize
    const handleResize = () => measureHeight()
    window.addEventListener('resize', handleResize)

    observer.observe(filterBarPlaceholderRef.current)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [isLoaded, isFilterBarSticky])

  // Smooth scroll when filter changes (prevents jarring content jumps)
  useEffect(() => {
    if (isFilterBarSticky && contentRef.current) {
      // Small delay to ensure DOM has updated after filter change
      const timer = setTimeout(() => {
        const stickyBarBottom = stickyBarHeight + 16 // Add small buffer
        window.scrollTo({
          top: Math.max(0, contentRef.current!.getBoundingClientRect().top + window.pageYOffset - stickyBarBottom),
          behavior: 'smooth'
        })
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [selectedCategory, searchQuery, isFilterBarSticky, stickyBarHeight])

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

  return (
    <div className="min-h-screen py-20" style={{ scrollBehavior: 'smooth' }}>
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-purple-500">Blog</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Web3 Insights</span>
            <br />
            <span className="text-foreground">& Analysis</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Deep dives into <span className="text-primary-500 font-medium">blockchain analytics</span>, 
            <span className="text-cyber-500 font-medium"> AI applications</span>, and 
            <span className="text-purple-500 font-medium"> Web3 development</span>
          </p>
        </div>
      </section>

      {/* Controls Section */}
      {/* Intersection Observer Target - positioned above the actual filter bar */}
      <div ref={filterBarPlaceholderRef} className="h-px -mb-px"></div>
      
      {/* Dynamic Spacer - maintains exact space when filter bar goes sticky */}
      {isFilterBarSticky && (
        <div 
          className="w-full transition-all duration-200"
          style={{ 
            height: `${stickyBarHeight}px`,
            marginBottom: '4rem'
          }}
        ></div>
      )}
      
      <section 
        ref={filterBarRef}
        className={`px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isFilterBarSticky 
            ? 'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg' 
            : 'mb-16'
        }`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-200 ${
          isFilterBarSticky ? 'py-2' : 'py-4'
        }`}>
          
          {!isFilterBarSticky ? (
            /* Regular (Non-Sticky) Layout */
            <>
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-6 px-4 sm:px-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm sm:text-base"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors duration-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                        : 'bg-background/50 text-foreground/70 border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500/30'
                    } backdrop-blur-sm`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category 
                          ? 'bg-purple-500/30 text-purple-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-foreground/60'
                      }`}>
                        {categoryCounts[category] || 0}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Sort Controls */}
              <div className="flex justify-center mb-2">
                <div className="flex items-center space-x-4 p-1 rounded-full bg-background/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
                  <span className="text-sm text-foreground/60 px-3">Sort by:</span>
                  {[
                    { label: 'Newest', value: 'newest' },
                    { label: 'Featured', value: 'featured' },
                    { label: 'Title', value: 'title' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        sortBy === option.value
                          ? 'bg-purple-500/20 text-purple-500'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Compact Sticky Layout */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              {/* Left: Filter Categories */}
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto w-full sm:w-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                        : 'bg-background/50 text-foreground/70 border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500/30'
                    }`}
                  >
                    {category}
                    {categoryCounts[category] > 0 && (
                      <span className="ml-1 text-xs opacity-60">
                        {categoryCounts[category]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Right: Search + Sort */}
              <div className="flex items-center gap-2">
                {/* Collapsible Search */}
                <div className="relative">
                  {isSearchExpanded ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 px-3 py-1.5 pl-8 text-xs rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-background/80 text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-purple-500"
                        onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setIsSearchExpanded(false)
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-1.5 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-background/50 text-foreground/60 hover:text-purple-500 hover:border-purple-500/30 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Compact Sort */}
                <div className="flex items-center gap-1">
                  {[
                    { label: 'New', value: 'newest' },
                    { label: 'Featured', value: 'featured' },
                    { label: 'Title', value: 'title' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                        sortBy === option.value
                          ? 'bg-purple-500/20 text-purple-500'
                          : 'text-foreground/60 hover:text-foreground hover:bg-background/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section ref={contentRef} className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Articles</h2>
            <div className={`grid gap-8 ${
              featuredPosts.length === 1 
                ? 'grid-cols-1 lg:grid-cols-6' 
                : featuredPosts.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
            }`}>
              {featuredPosts.map((post) => (
                <BlogCard 
                  key={post.id || post.slug} 
                  {...post} 
                  featuredCount={featuredPosts.length}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className={`px-4 sm:px-6 lg:px-8 mb-20 ${featuredPosts.length === 0 ? '' : ''}`} ref={featuredPosts.length === 0 ? contentRef : undefined}>
        <div className="max-w-7xl mx-auto">
          {regularPosts.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {featuredPosts.length > 0 ? 'All Articles' : 'Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <BlogCard key={post.id || post.slug} {...post} />
                ))}
              </div>
            </>
          )}
          
          {totalFilteredPosts === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No articles found</h3>
              <p className="text-foreground/60 mb-6">
                No articles match your search criteria. Try adjusting your search or category filter.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-medium hover:scale-105 transition-transform duration-200"
                >
                  Clear Search
                </button>
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 transition-colors duration-200"
                >
                  View All Articles
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Tags */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Popular <span className="text-gradient">Topics</span>
            </h2>
            <p className="text-foreground/70">
              Explore articles by the most discussed topics in Web3
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'DeFi', 'Analytics', 'Smart-Contracts', 'AI', 'Machine-Learning',
              'Security', 'DAO', 'Cross-Chain', 'MEV', 'Governance', 'Tutorial'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag.toLowerCase())}
                className="px-4 py-2 rounded-full bg-background/80 border border-gray-200/50 dark:border-gray-800/50 text-foreground/70 hover:border-cyber-500 hover:text-cyber-500 transition-all duration-200 backdrop-blur-sm text-sm"
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