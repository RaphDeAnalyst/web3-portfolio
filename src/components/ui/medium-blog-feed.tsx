'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Bookmark, Check } from 'lucide-react'

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

interface MediumBlogFeedProps {
  posts: BlogPost[]
  className?: string
}

export function MediumBlogFeed({ posts, className = '' }: MediumBlogFeedProps) {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const toggleBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(slug)) {
        newSet.delete(slug)
      } else {
        newSet.add(slug)
      }
      return newSet
    })
  }

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Handle more options menu
  }

  return (
    <div className={`max-w-3xl mx-auto px-4 sm:px-0 ${className}`}>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {posts.map((post, index) => (
          <article key={post.slug} className="py-6 sm:py-8 first:pt-0 last:pb-0">
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Author and Date */}
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2">
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {post.author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {post.author.name}
                      </span>
                    </div>
                    <span className="text-gray-400">·</span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  {/* Category */}
                  {post.category && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-150">
                    {post.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors duration-150">
                    {post.summary}
                  </p>

                  {/* Bottom metadata and actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {post.readTime}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={(e) => toggleBookmark(post.slug, e)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Save"
                      >
                        {bookmarkedPosts.has(post.slug) ? (
                          <div className="relative">
                            <Bookmark className="w-5 h-5 text-green-600 fill-current" />
                            <Check className="w-3 h-3 text-white absolute top-1 left-1" />
                          </div>
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={handleMoreClick}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="More options"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image */}
                {post.featuredImage ? (
                  <div className="w-full h-36 sm:w-24 sm:h-24 md:w-28 md:h-20 lg:w-32 lg:h-24 xl:w-40 xl:h-28 flex-shrink-0 order-first sm:order-last">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-sm"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 sm:w-24 sm:h-24 md:w-28 md:h-20 lg:w-32 lg:h-24 xl:w-40 xl:h-28 flex items-center justify-center flex-shrink-0 order-first sm:order-last rounded-sm p-2" style={{ backgroundColor: '#2a7fc9' }}>
                    <div className="text-center">
                      <h3 className="text-white font-bold text-xs sm:text-xs md:text-sm leading-tight text-center break-words max-w-full">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3v8m-4-4h8" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No stories yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back soon for new Web3 insights and analytics content.
          </p>
        </div>
      )}
    </div>
  )
}