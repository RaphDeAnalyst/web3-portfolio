'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const loadProject = useCallback(async () => {
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
        if (post) {
          // Show the post regardless of status (admin can see drafts)
          // In the future, add auth check here if needed
          setBlogPost(post)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadProject()
  }, [loadProject])

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
        <Link href="/work" className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground mb-8 inline-block transition-opacity rounded">
          ← Work
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {blogPost?.title || project.title}
          </h1>

          {/* Blog metadata */}
          {blogPost && (
            <div className="flex items-center gap-4 text-sm opacity-65 mb-4">
              {blogPost.date && <span>{blogPost.date}</span>}
              {blogPost.readTime && (
                <>
                  <span>•</span>
                  <span>{blogPost.readTime}</span>
                </>
              )}
              {blogPost.category && (
                <>
                  <span>•</span>
                  <span>{blogPost.category}</span>
                </>
              )}
            </div>
          )}

          {/* Summary */}
          {blogPost?.summary && (
            <p className="text-lg opacity-75 mb-6">
              {blogPost.summary}
            </p>
          )}

          {/* Featured Image */}
          {blogPost?.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={blogPost.featuredImage}
                alt={blogPost.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Tags and Links */}
          <div className="flex flex-wrap items-center gap-3">
            {((blogPost?.tags?.length ?? 0) > 0 || (project?.tech_stack?.length ?? 0) > 0) && (
              <div className="flex flex-wrap gap-2">
                {(blogPost?.tags || project?.tech_stack || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs font-medium px-2 py-1 bg-foreground/10 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {project?.file_url && (
              <a
                href={project.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity rounded"
              >
                PDF Report ↗
              </a>
            )}
            {project?.duneUrl && (
              <a
                href={project.duneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity rounded"
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
          ) : project?.file_url || project?.duneUrl ? (
            <div className="py-12">
              <p className="text-lg opacity-75 leading-relaxed">
                {project.description}
              </p>
            </div>
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
