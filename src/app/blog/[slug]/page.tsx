'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { UtterancesComments, UtterancesSetupInstructions } from '@/components/ui/utterances-comments'
import Link from 'next/link'
import { blogService } from '@/lib/service-switcher'
import { viewTracker } from '@/lib/view-tracking'

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // All hooks at the top
  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await blogService.getPostBySlug(params.slug)
        setPost(postData)
      } catch (error) {
        console.error('Error loading post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [params.slug])

  useEffect(() => {
    if (post) {
      setIsClient(true)
      viewTracker.incrementView(params.slug)
    }
  }, [params.slug, post])

  // Render logic after all hooks
  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-foreground/60 mb-8">
            <Link href="/blog" className="hover:text-cyber-500 transition-colors duration-200">
              Blog
            </Link>
            <span>›</span>
            <span className="text-foreground/80">{post.title}</span>
          </nav>

          {/* Article Header */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-foreground/60">
                  {post.date} • {post.readTime}
                </span>
              </div>
              {isClient && (
                <div className="flex items-center space-x-2 text-sm text-foreground/60">
                  <span>👁️</span>
                  <span>{viewTracker.getFormattedViewCount(params.slug)} views</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary */}
            <p className="text-xl text-foreground/70 leading-relaxed max-w-3xl">
              {post.summary}
            </p>

            {/* Author */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200/30 dark:border-gray-800/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white font-bold">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-foreground">{post.author.name}</div>
                <div className="text-sm text-foreground/60">Web3 Data & AI Specialist</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog?search=${tag.toLowerCase()}`}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-cyber-500/10 hover:text-cyber-500 transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto">
          {/* Setup Instructions (remove this after setting up utterances) */}
          <UtterancesSetupInstructions />
          
          {/* Utterances Comments */}
          <UtterancesComments slug={params.slug} title={post.title} />
        </div>
      </section>

      {/* Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm space-y-4 sm:space-y-0">
            <Link 
              href="/blog"
              className="flex items-center space-x-2 text-foreground/70 hover:text-cyber-500 transition-colors duration-200"
            >
              <span>←</span>
              <span>Back to Blog</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-medium hover:scale-105 transition-transform duration-200"
              >
                Share Article
              </button>
              <Link href="/contact">
                <button className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 transition-colors duration-200">
                  Subscribe
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}