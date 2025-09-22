'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { logger } from '@/lib/logger'

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

interface HomeClientProps {
  initialFeaturedProjects: any[]
  initialFeaturedPosts: any[]
  profile: any
}

export function HomeClient({ initialFeaturedProjects, initialFeaturedPosts, profile }: HomeClientProps) {
  // Update posts with current profile info
  const currentAuthor = {
    name: profile.name,
    avatar: profile.avatar
  }

  const updatedPosts = initialFeaturedPosts.map((post: any) => ({
    ...post,
    author: {
      name: currentAuthor.name,
      avatar: currentAuthor.avatar || post.author.avatar
    }
  }))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Critical for LCP */}
      <ErrorBoundary fallback={<HeroErrorFallback />}>
        <HeroSection />
      </ErrorBoundary>

      {/* Quick Links - Above the fold */}
      <ErrorBoundary fallback={<QuickLinksErrorFallback />}>
        <QuickLinksSection />
      </ErrorBoundary>

      {/* Featured Projects */}
      <ErrorBoundary fallback={<FeaturedProjectsErrorFallback />}>
        <Suspense fallback={<div className="w-full h-96 bg-card animate-pulse" />}>
          <FeaturedProjectsSection featuredProjects={initialFeaturedProjects} />
        </Suspense>
      </ErrorBoundary>

      {/* Blog Section */}
      <ErrorBoundary fallback={<BlogErrorFallback />}>
        <Suspense fallback={<div className="w-full h-96 bg-card animate-pulse" />}>
          <BlogSection featuredPosts={updatedPosts} />
        </Suspense>
      </ErrorBoundary>

      {/* Skills Section */}
      <ErrorBoundary fallback={<SkillsErrorFallback />}>
        <Suspense fallback={<div className="w-full h-64 bg-card animate-pulse" />}>
          <SkillsSection />
        </Suspense>
      </ErrorBoundary>

      {/* Structured Data - Non-critical */}
      <StructuredData type="person" />
      <StructuredData type="website" />
    </div>
  )
}