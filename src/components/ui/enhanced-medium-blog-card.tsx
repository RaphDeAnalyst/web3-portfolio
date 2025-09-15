'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Eye, Calendar, Tag } from 'lucide-react'

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

interface EnhancedMediumBlogCardProps {
  posts: BlogPost[]
  className?: string
}

export function EnhancedMediumBlogCard({ posts, className = '' }: EnhancedMediumBlogCardProps) {
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
    const categoryIcons: { [key: string]: JSX.Element } = {
      'Web3': <Tag className="w-3 h-3" />,
      'Web3 Analytics': <Tag className="w-3 h-3" />,
      'DeFi': <Tag className="w-3 h-3" />,
      'AI': <Tag className="w-3 h-3" />,
      'Tutorial': <Tag className="w-3 h-3" />,
      'Research': <Tag className="w-3 h-3" />,
    }
    return categoryIcons[category] || <Tag className="w-3 h-3" />
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 ${className}`}>
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`}>
          <article
            className={`group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-200 cursor-pointer h-full flex flex-col min-h-[320px] sm:min-h-[360px] ${
              hoveredPost === post.slug
                ? 'transform -translate-y-1 shadow-lg shadow-black/10 dark:shadow-black/20'
                : 'hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/20'
            }`}
            onMouseEnter={() => setHoveredPost(post.slug)}
            onMouseLeave={() => setHoveredPost(null)}
          >

            {/* Featured Image */}
            {post.featuredImage ? (
              <div className="w-full h-36 sm:h-44 md:h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-36 sm:h-44 md:h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">{getCategoryIcon(post.category)}</div>
                  <p className="text-sm font-medium opacity-90">{post.category}</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 sm:mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                {post.title}
              </h2>

              {/* Summary */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6 line-clamp-3 flex-1">
                {post.summary}
              </p>

              {/* Author and Metadata */}
              <div className="mt-auto">
                {/* Author Info */}
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="flex-shrink-0">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {post.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.author.name}
                    </p>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                      {post.views && (
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatViews(post.views)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}