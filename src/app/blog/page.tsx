'use client'

import { useState, useMemo } from 'react'
import { BlogCard } from '@/components/ui/blog-card'
import { NewsletterSignup } from '@/components/ui/newsletter-signup'
import { blogPosts, blogCategories } from '@/data/blog-posts'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Posts are now imported from /src/data/blog-posts.ts
  const posts = blogPosts

  const categories = blogCategories

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
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

    return filtered
  }, [selectedCategory, searchQuery])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { 'All': posts.length }
    categories.forEach(category => {
      if (category !== 'All') {
        counts[category] = posts.filter(p => p.category === category).length
      }
    })
    return counts
  }, [])

  return (
    <div className="min-h-screen py-20">
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

      {/* Search and Filters */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40">
                🔍
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
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-500/20 text-purple-500 border-2 border-purple-500/40'
                    : 'bg-background/50 text-foreground/70 border-2 border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700'
                } backdrop-blur-sm`}
              >
                <span className="flex items-center space-x-2">
                  <span>{category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedCategory === category 
                      ? 'bg-purple-500/30 text-purple-500'
                      : 'bg-gray-200/80 dark:bg-gray-700/80 text-foreground/60'
                  }`}>
                    {categoryCounts[category] || 0}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <BlogCard key={index} {...post} />
              ))}
            </div>
          ) : (
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
            <h2 className="text-3xl font-bold text-foreground mb-4">
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