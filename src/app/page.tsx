'use client'

import { useState, useEffect } from 'react'
import { blogService, projectService, profileService } from '@/lib/service-switcher'

// Import section components
import { HeroSection } from '@/components/sections/HeroSection'
import { QuickLinksSection } from '@/components/sections/QuickLinksSection'
import { FeaturedProjectsSection } from '@/components/sections/FeaturedProjectsSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import {
  HeroErrorFallback,
  QuickLinksErrorFallback,
  FeaturedProjectsErrorFallback,
  BlogErrorFallback,
  SkillsErrorFallback
} from '@/components/error/SectionErrorFallbacks'
import { StructuredData } from '@/components/seo/StructuredData'

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

        const updatedPosts = posts.map(post => ({
          ...post,
          author: {
            name: currentAuthor.name,
            avatar: currentAuthor.avatar || post.author.avatar
          }
        }))

        setFeaturedProjects(projects)
        setFeaturedPosts(updatedPosts)
      } catch (error) {
        console.error('Error loading featured content:', error)
        // Fallback to original posts if profile loading fails
        try {
          const [projects, posts] = await Promise.all([
            projectService.getFeaturedProjects(),
            blogService.getFeaturedPosts()
          ])
          setFeaturedProjects(projects)
          setFeaturedPosts(posts)
        } catch (fallbackError) {
          console.error('Error loading fallback content:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }
    
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
        
        <ErrorBoundary section="Quick Links" fallback={<QuickLinksErrorFallback />}>
          <QuickLinksSection />
        </ErrorBoundary>
        
        <ErrorBoundary section="Featured Projects" fallback={<FeaturedProjectsErrorFallback />}>
          <FeaturedProjectsSection 
            featuredProjects={featuredProjects} 
            loading={loading} 
          />
        </ErrorBoundary>
        
        <ErrorBoundary section="Blog" fallback={<BlogErrorFallback />}>
          <BlogSection 
            featuredPosts={featuredPosts} 
            loading={loading} 
          />
        </ErrorBoundary>
        
        <ErrorBoundary section="Skills" fallback={<SkillsErrorFallback />}>
          <SkillsSection />
        </ErrorBoundary>
      </div>
    </>
  )
}