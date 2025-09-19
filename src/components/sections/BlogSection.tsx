'use client'

import Link from 'next/link'
import { memo } from 'react'
import { EnhancedMediumBlogCard } from '@/components/ui/enhanced-medium-blog-card'

interface BlogSectionProps {
  featuredPosts?: any[]
  loading?: boolean
}

const BlogSection = memo(function BlogSection({ featuredPosts = [], loading = false }: BlogSectionProps) {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 dark:from-gray-900/30 to-background" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-foreground rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-foreground">Latest Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Featured <span className="text-gradient">Blog Posts</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Sharing my learning journey, insights, and practical knowledge in Web3 analytics
          </p>
        </div>

        {/* Featured Blog Posts */}
        {loading ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredPosts.length > 0 ? (
          <EnhancedMediumBlogCard
            posts={featuredPosts.slice(0, 3)}
            className="max-w-6xl mx-auto"
          />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No Featured Blog Posts</h3>
            <p className="text-foreground/60 mb-6">
              Featured blog posts will appear here once they&apos;re selected in the admin panel.
            </p>
            <Link href="/blog">
              <button className="px-6 py-3 bg-storj-navy text-white rounded-storj font-medium hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200">
                View All Posts
              </button>
            </Link>
          </div>
        )}

        {/* View All Blog Posts CTA */}
        {featuredPosts.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/blog">
              <button className="px-10 py-4 bg-storj-navy text-white rounded-storj font-semibold text-lg hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200 shadow-storj-lg">
                View All Posts
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
})

export { BlogSection }