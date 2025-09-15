'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { BlogListing } from '@/components/ui/blog-listing'
import { MediumBlogFeed } from '@/components/ui/medium-blog-feed'
import { NewsletterSignup } from '@/components/ui/newsletter-signup'
import { blogService, profileService } from '@/lib/service-switcher'
import { BlogPostData } from '@/lib/blog-service'
import { Search, X } from 'lucide-react'

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
        const updatedPosts = publishedPosts.map(post => ({
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
        console.error('Error loading blog data:', error)
        // Fallback to original posts if profile loading fails
        try {
          const publishedPosts = await blogService.getPublishedPosts()
          setPosts(publishedPosts)
          const allCategories = ['All', ...await blogService.getCategories()]
          setCategories(allCategories)
        } catch (fallbackError) {
          console.error('Error loading fallback posts:', fallbackError)
        }
      } finally {
        setIsLoaded(true)
      }
    }

    loadData()
    
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

  return (
    <div className="min-h-screen py-20" style={{ scrollBehavior: 'smooth' }}>
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-foreground rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-foreground">Blog</span>
          </div>
          
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="text-gradient">Web3 Insights</span>
            <br />
            <span className="text-foreground">& Analysis</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Deep dives into <span className="text-foreground font-medium">blockchain analytics</span>,
            <span className="text-foreground font-medium"> AI applications</span>, and
            <span className="text-foreground font-medium"> Web3 development</span>
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto py-4">
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 px-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10 transition-all duration-200 text-sm sm:text-base min-h-[48px]"
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
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
            {categories.map((category) => {
              const isActive = selectedCategory === category
              const count = categoryCounts[category] || 0

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative group px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 min-h-[36px] ${
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
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] ${
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
        <section ref={contentRef} className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Articles</h2>
            <BlogListing
              posts={featuredPosts}
              layout={featuredPosts.length >= 3 ? "grid" : "single"}
              showDividers={false}
              highlightFeatured={true}
              className="max-w-6xl mx-auto"
            />
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
              <MediumBlogFeed
                posts={regularPosts}
                className="max-w-4xl mx-auto"
              />
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
                  className="px-6 py-3 rounded-full bg-foreground hover:bg-foreground/80 text-background font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20"
                >
                  Clear Search
                </button>
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