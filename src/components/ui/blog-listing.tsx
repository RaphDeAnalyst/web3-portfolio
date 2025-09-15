'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Eye, MessageCircle, Tag, Calendar } from 'lucide-react'

interface BlogPost {
  id?: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  date: string
  readTime: string
  status: 'draft' | 'published'
  featured?: boolean
  featuredImage?: string
  views?: number
  lastViewedAt?: string
  createdAt?: string
  updatedAt?: string
  origin?: 'default' | 'user'
}

interface BlogListingProps {
  posts: BlogPost[]
  layout?: 'single' | 'double' | 'grid'
  showDividers?: boolean
  highlightFeatured?: boolean
  className?: string
}

export function BlogListing({
  posts,
  layout = 'single',
  showDividers = true,
  highlightFeatured = false,
  className = ''
}: BlogListingProps) {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1d ago'
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`
    return `${Math.floor(diffInDays / 365)}y ago`
  }

  const getCategoryIcon = (category: string) => {
    // You can customize this based on your categories
    const categoryIcons: { [key: string]: JSX.Element } = {
      'Web3 Analytics': <Tag className="w-3 h-3" />,
      'DeFi': <Tag className="w-3 h-3" />,
      'AI': <Tag className="w-3 h-3" />,
      'Tutorial': <Tag className="w-3 h-3" />,
      'Research': <Tag className="w-3 h-3" />,
    }
    return categoryIcons[category] || <Tag className="w-3 h-3" />
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className={`grid gap-6 ${
        layout === 'double'
          ? 'lg:grid-cols-2 lg:gap-8'
          : layout === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'grid-cols-1'
      }`}>
        {posts.map((post, index) => (
          <div key={post.slug} className="relative">
            <Link href={`/blog/${post.slug}`}>
              <article
                className={`group relative p-6 sm:p-8 transition-all duration-200 cursor-pointer ${
                  hoveredPost === post.slug
                    ? 'transform -translate-y-1 shadow-lg shadow-black/10 dark:shadow-black/20'
                    : 'hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/20'
                } bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800`}
                onMouseEnter={() => setHoveredPost(post.slug)}
                onMouseLeave={() => setHoveredPost(null)}
              >

                {/* Mobile Layout: Image on top */}
                <div className="block sm:hidden mb-4">
                  {post.featuredImage && (
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                {/* Desktop Layout: Content and Image side by side */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Category */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-primary-600 dark:text-primary-400">
                        {getCategoryIcon(post.category)}
                      </span>
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                        In {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {post.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                      {post.summary}
                    </p>

                    {/* Author and Metadata */}
                    <div className="flex items-center justify-between">
                      {/* Author Info */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {post.author.avatar ? (
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {post.author.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.author.name}
                          </p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                        {post.views && (
                          <div className="hidden sm:flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{formatViews(post.views)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Image */}
                  <div className="hidden sm:block flex-shrink-0">
                    {post.featuredImage && (
                      <div className="w-32 h-24 lg:w-40 lg:h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>

            {/* Divider */}
            {showDividers && index < posts.length - 1 && (
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-6" />
            )}
          </div>
        ))}
      </div>

      {/* Load More or Pagination could go here */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <MessageCircle className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No blog posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back soon for Web3 insights and analytics content.
          </p>
        </div>
      )}
    </div>
  )
}