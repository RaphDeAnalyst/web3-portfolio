'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { projectServiceSupabase } from '@/lib/project-service-supabase'
import { blogServiceSupabase, type BlogPostData } from '@/lib/blog-service-supabase'
import { BlogPostEditor } from '@/components/admin/blog-post-editor'
import type { Project } from '@/lib/project-service-supabase'

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [linkedPost, setLinkedPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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
        setLinkedPost(post)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, isDraft: boolean) => {
    if (!project) return

    try {
      setSaving(true)
      setError(null)

      // Save or update blog post
      const savedPost = await blogServiceSupabase.savePost(
        postData,
        linkedPost?.id // Pass existing ID if updating
      )

      if (!savedPost) {
        setError('Failed to save post')
        return
      }

      // If this is a new link (project doesn't have blog_post_slug yet), link them
      if (!project.blogPostSlug) {
        await projectServiceSupabase.updateProject(project.id || params.id, {
          blogPostSlug: savedPost.slug,
        })
      }

      // Update local state
      setLinkedPost(savedPost)
      setProject({
        ...project,
        blogPostSlug: savedPost.slug,
      })

      // Show success message (in a real app, would be a toast)
      alert('Content saved successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center opacity-50 py-12">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
            ← Admin
          </Link>
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
            {error || 'Project not found'}
          </div>
        </div>
      </div>
    )
  }

  // Prepare initial data for the editor
  const initialEditorData: Partial<BlogPostData> = linkedPost || {
    title: project.title,
    slug: undefined,
    summary: project.description,
    content: '',
    category: 'Data Analytics',
    tags: project.tech_stack || [],
    featured: false,
    status: 'draft',
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link href="/admin" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
          ← Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Edit Content: {project.title}</h1>
          <p className="text-sm opacity-60 mt-2">
            Write a blog-style write-up for this project. Add markdown, images, and more.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Blog post editor */}
        <BlogPostEditor
          initialData={initialEditorData}
          onSave={handleSave}
        />

        {/* Saving indicator */}
        {saving && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-foreground text-background rounded text-sm">
            Saving...
          </div>
        )}
      </div>
    </div>
  )
}
