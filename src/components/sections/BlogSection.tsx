'use client'

import Link from 'next/link'
import { memo } from 'react'

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

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className={`grid gap-8 ${
            featuredPosts.length === 1 
              ? 'grid-cols-1 lg:grid-cols-6' 
              : featuredPosts.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
          }`}>
            {featuredPosts.slice(0, 3).map((post, index) => {
              return (
                <Link key={post.id || index} href={`/blog/${post.slug}`}>
                  <article className="group h-full p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 card-hover">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700">
                        {post.category}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-foreground/60">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime || '5 min read'}</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-foreground/80 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
                        {post.summary}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-foreground/60">Continue reading</span>
                        <span className="font-medium text-foreground/80 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200">
                          Read More →
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-50/50 dark:bg-gray-800/50"></div>
                  </article>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No Featured Blog Posts</h3>
            <p className="text-foreground/60 mb-6">
              Featured blog posts will appear here once they're selected in the admin panel.
            </p>
            <Link href="/blog">
              <button className="px-6 py-3 rounded-full bg-foreground hover:bg-foreground/80 text-background font-medium shadow-lg shadow-foreground/20 transition-all duration-200">
                View All Posts
              </button>
            </Link>
          </div>
        )}

        {/* View All Blog Posts CTA */}
        {featuredPosts.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/blog">
              <button className="px-10 py-4 rounded-full bg-foreground hover:bg-foreground/80 text-background font-semibold text-lg shadow-2xl shadow-foreground/20 transition-all duration-200">
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