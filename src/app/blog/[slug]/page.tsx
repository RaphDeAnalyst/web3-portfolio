import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { BlogPostClient } from '@/components/blog/BlogPostClient'
import { StructuredData } from '@/components/seo/StructuredData'
import { blogService, profileService } from '@/lib/service-switcher'
import { calculateReadingTime } from '@/lib/reading-time'
import Link from 'next/link'
import { logger } from '@/lib/logger'

// Generate metadata for dynamic blog posts
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const post = await blogService.getPostBySlug(params.slug)

    if (!post) {
      return {
        title: 'Post Not Found | Matthew Raphael Web3 Blog',
        description: 'The requested blog post could not be found.',
      }
    }

    const title = `${post.title} | Matthew Raphael Web3 Data Analytics Blog`
    const description = post.summary || `${post.title} - Web3 data analytics insights and blockchain research by Matthew Raphael`
    const keywords = [
      ...post.tags.map(tag => `${tag} Web3`),
      `${post.category} Analytics`,
      'Matthew Raphael Blog',
      'Web3 Data Analysis',
      'Blockchain Analytics',
      'DeFi Research',
      'On-chain Data',
      'Cryptocurrency Analysis'
    ]

    return {
      title,
      description,
      keywords,
      authors: [{ name: post.author?.name || 'Matthew Raphael', url: 'https://matthewraphael.xyz' }],
      openGraph: {
        title,
        description,
        url: `https://matthewraphael.xyz/blog/${params.slug}`,
        type: 'article',
        publishedTime: post.date || post.createdAt || new Date().toISOString(),
        modifiedTime: post.updatedAt || post.date || post.createdAt || new Date().toISOString(),
        authors: [post.author?.name || 'Matthew Raphael'],
        tags: post.tags,
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: `${post.title} - Web3 ${post.category} analysis by Matthew Raphael`,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@matthew_nnamani',
        images: post.featuredImage ? [post.featuredImage] : undefined,
      },
      alternates: {
        canonical: `https://matthewraphael.xyz/blog/${params.slug}`,
      },
      other: {
        'article:author': post.author?.name || 'Matthew Raphael',
        'article:published_time': post.date || post.createdAt || new Date().toISOString(),
        'article:modified_time': post.updatedAt || post.date || post.createdAt || new Date().toISOString(),
        'article:section': post.category,
        'article:tag': post.tags.join(', '),
      },
    }
  } catch (error) {
    logger.error('Error generating blog post metadata:', error)
    return {
      title: 'Blog Post | Matthew Raphael Web3 Analytics',
      description: 'Web3 data analytics insights and blockchain research.',
    }
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  let post, profile

  try {
    [post, profile] = await Promise.all([
      blogService.getPostBySlug(params.slug),
      profileService.getProfile()
    ])
  } catch (error) {
    logger.error('Error loading blog post or profile:', error)
    return notFound()
  }

  if (!post) {
    return notFound()
  }

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData type="blog" data={post} />

      <div className="min-h-screen py-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-foreground/60 mb-8">
              <Link href="/blog" className="hover:text-foreground transition-colors duration-200">
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
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground text-sm font-medium border border-gray-200 dark:border-gray-700">
                    {post.category}
                  </span>
                  <span className="text-sm text-foreground/60">
                    {post.date} • {post.readTime || calculateReadingTime(post.content || '')}
                  </span>
                </div>
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
                    alt={`${post.title} - Web3 ${post.category} analysis by Matthew Raphael covering ${post.tags.slice(0, 3).join(', ')} blockchain analytics topics`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Summary */}
              <p className="text-xl text-foreground/70 leading-relaxed max-w-3xl">
                {post.summary}
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 pt-6 border-t border-text-light-primary/10 dark:border-text-dark-primary/10">
                {profile?.avatar && profile.avatar !== '/avatar.jpg' && profile.avatar.startsWith('http') ? (
                  <img
                    src={profile.avatar}
                    alt={`${post.author.name} - Web3 Data Analyst and Blockchain Analytics Expert profile picture`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30 shadow-lg shadow-primary-500/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-foreground">{post.author.name}</div>
                  <div className="text-sm text-foreground/60">
                    {profile?.title || 'Web3 Data & AI Specialist'}
                  </div>
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
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Client-side components for interactions */}
        <BlogPostClient slug={params.slug} title={post.title} />

        {/* Navigation */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm space-y-4 sm:space-y-0">
              <Link
                href="/blog"
                className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                <span>←</span>
                <span>Back to Blog</span>
              </Link>

              <div className="flex items-center space-x-4">
                <Link href="/contact">
                  <button className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-foreground hover:border-foreground hover:bg-foreground/5 transition-colors duration-200">
                    Subscribe
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}