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
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-purple-500">Latest Insights</span>
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
              const colors = ['cyber-500', 'primary-500', 'purple-500']
              const color = colors[index % colors.length]
              return (
                <Link key={post.id || index} href={`/blog/${post.slug}`}>
                  <article className="group h-full p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 card-hover">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        color === 'cyber-500' ? 'bg-cyber-500/10 text-cyber-500' :
                        color === 'primary-500' ? 'bg-primary-500/10 text-primary-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {post.category}
                      </div>
                      <span className="text-sm text-foreground/50">{post.date}</span>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-4">
                      <h3 className={`text-xl font-bold text-foreground transition-colors duration-200 ${
                        color === 'cyber-500' ? 'group-hover:text-cyber-500' :
                        color === 'primary-500' ? 'group-hover:text-primary-500' :
                        'group-hover:text-purple-500'
                      }`}>
                        {post.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
                        {post.summary}
                      </p>
                      
                      {/* Read More */}
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-foreground/60">{post.readTime}</span>
                        <span className={`font-medium transition-colors duration-200 ${
                          color === 'cyber-500' ? 'text-cyber-500 group-hover:text-cyber-600' :
                          color === 'primary-500' ? 'text-primary-500 group-hover:text-primary-600' :
                          'text-purple-500 group-hover:text-purple-600'
                        }`}>
                          Read More →
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      color === 'cyber-500' ? 'bg-cyber-500/5' :
                      color === 'primary-500' ? 'bg-primary-500/5' :
                      'bg-purple-500/5'
                    }`}></div>
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
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-medium hover:scale-105 transition-transform duration-200">
                View All Posts
              </button>
            </Link>
          </div>
        )}

        {/* View All Blog Posts CTA */}
        {featuredPosts.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/blog">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-primary-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl shadow-purple-500/20">
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