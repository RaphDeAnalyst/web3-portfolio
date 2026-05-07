'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { projectServiceSupabase } from '@/lib/project-service-supabase'
import { blogServiceSupabase } from '@/lib/blog-service-supabase'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import type { Project } from '@/lib/project-service-supabase'
import type { BlogPostData } from '@/lib/blog-service-supabase'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProject()
  }, [params.id])

  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch project
      const projectData = await projectServiceSupabase.getProjectById(params.id)
      if (!projectData) {
        setError('Project not found')
        return
      }

      setProject(projectData)

      // If project has a blog post linked, fetch it
      if (projectData.blogPostSlug) {
        const post = await blogServiceSupabase.getPostBySlug(projectData.blogPostSlug)
        setBlogPost(post)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center opacity-50 py-12">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/work" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
            ← Work
          </Link>
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
            {error || 'Project not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href="/work" className="text-sm opacity-60 hover:opacity-100 mb-8 inline-block transition-opacity">
          ← Work
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {project.title}
          </h1>

          {/* Tags and Dune link */}
          <div className="flex flex-wrap items-center gap-3">
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs font-medium px-2 py-1 bg-foreground/10 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {project.duneUrl && (
              <a
                href={project.duneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
              >
                View on Dune ↗
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {blogPost && blogPost.content ? (
            <MarkdownRenderer content={blogPost.content} />
          ) : (
            <div className="text-center py-12 opacity-50">
              <p>No write-up yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
