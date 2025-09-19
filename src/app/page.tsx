'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { logger } from '@/lib/logger'
import { blogService, projectService, profileService } from '@/lib/service-switcher'

// Import critical above-the-fold components immediately
import { HeroSection } from '@/components/sections/HeroSection'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import {
  HeroErrorFallback,
  QuickLinksErrorFallback,
  FeaturedProjectsErrorFallback,
  BlogErrorFallback,
  SkillsErrorFallback
} from '@/components/error/SectionErrorFallbacks'

// Lazy load below-the-fold components for better performance
const QuickLinksSection = dynamic(() => import('@/components/sections/QuickLinksSection').then(mod => ({ default: mod.QuickLinksSection })), {
  loading: () => <div className="w-full h-32 bg-card animate-pulse" />,
  ssr: true
})

const FeaturedProjectsSection = dynamic(() => import('@/components/sections/FeaturedProjectsSection').then(mod => ({ default: mod.FeaturedProjectsSection })), {
  loading: () => <div className="w-full h-96 bg-card animate-pulse" />,
  ssr: true
})

const BlogSection = dynamic(() => import('@/components/sections/BlogSection').then(mod => ({ default: mod.BlogSection })), {
  loading: () => <div className="w-full h-96 bg-card animate-pulse" />,
  ssr: true
})

const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection').then(mod => ({ default: mod.SkillsSection })), {
  loading: () => <div className="w-full h-64 bg-card animate-pulse" />,
  ssr: true
})

const StructuredData = dynamic(() => import('@/components/seo/StructuredData').then(mod => ({ default: mod.StructuredData })), {
  ssr: false
})

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        const [projects, posts, profile] = await Promise.all([
          projectService.getFeaturedProjects(),
          blogService.getFeaturedPosts(),
          profileService.getProfile()
        ])

        // Update posts with current profile info
        const currentAuthor = {
          name: profile.name,
          avatar: profile.avatar
        }

        const updatedPosts = posts.map((post: any) => ({
          ...post,
          author: {
            name: currentAuthor.name,
            avatar: currentAuthor.avatar || post.author.avatar
          }
        }))

        setFeaturedProjects(projects)
        setFeaturedPosts(updatedPosts)
      } catch (error) {
        logger.error('Error loading featured content', error)
        // Fallback to original posts if profile loading fails
        try {
          const [projects, posts] = await Promise.all([
            projectService.getFeaturedProjects(),
            blogService.getFeaturedPosts()
          ])
          setFeaturedProjects(projects)
          setFeaturedPosts(posts)
        } catch (fallbackError) {
          logger.error('Error loading fallback content', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    // Load content immediately to reduce HTML fragmentation
    loadFeaturedContent()
  }, [])
  
  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData type="person" />
      <StructuredData type="website" />

      <div className="min-h-screen">
        <ErrorBoundary section="Hero" fallback={<HeroErrorFallback />}>
          <HeroSection />
        </ErrorBoundary>

        <Suspense fallback={<div className="w-full h-32 bg-card animate-pulse" />}>
          <ErrorBoundary section="Quick Links" fallback={<QuickLinksErrorFallback />}>
            <QuickLinksSection />
          </ErrorBoundary>
        </Suspense>

        <Suspense fallback={<div className="w-full h-96 bg-card animate-pulse" />}>
          <ErrorBoundary section="Featured Projects" fallback={<FeaturedProjectsErrorFallback />}>
            <FeaturedProjectsSection
              featuredProjects={featuredProjects}
              loading={loading}
            />
          </ErrorBoundary>
        </Suspense>

        <Suspense fallback={<div className="w-full h-96 bg-card animate-pulse" />}>
          <ErrorBoundary section="Blog" fallback={<BlogErrorFallback />}>
            <BlogSection
              featuredPosts={featuredPosts}
              loading={loading}
            />
          </ErrorBoundary>
        </Suspense>

        <Suspense fallback={<div className="w-full h-64 bg-card animate-pulse" />}>
          <ErrorBoundary section="Skills" fallback={<SkillsErrorFallback />}>
            <SkillsSection />
          </ErrorBoundary>
        </Suspense>
      </div>
    </>
  )
}