'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { projectServiceSupabase } from '@/lib/project-service-supabase'
import { blogServiceSupabase, type BlogPostData } from '@/lib/blog-service-supabase'
import { BlogPostEditor } from '@/components/admin/blog-post-editor'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import type { Project } from '@/lib/project-service-supabase'

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const { toast, showSuccess, showError, dismiss } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [linkedPost, setLinkedPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const loadProject = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch project
      const projectData = await projectServiceSupabase.getProjectById(params.id)
      if (!projectData) {
        return
      }

      setProject(projectData)

      // If project has a blog post linked, fetch it
      if (projectData.blogPostSlug) {
        const post = await blogServiceSupabase.getPostBySlug(projectData.blogPostSlug)
        setLinkedPost(post)
      }
    } catch {
      // Error handling via fallback UI
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  const handleSave = async (postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, isDraft: boolean) => {
    if (!project) return

    try {
      setSaving(true)

      // Always use the linked post ID if it exists (we're updating, not creating)
      const existingPostId = linkedPost?.id

      // Save or update blog post with the correct ID
      const savedPost = await blogServiceSupabase.savePost(
        postData,
        existingPostId // Pass existing ID if updating
      )

      if (!savedPost) {
        showError('Failed to save post. Please ensure the post content and title are valid.', () => handleSave(postData, isDraft))
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

      // Show success and close editor
      showSuccess(isDraft ? 'Draft saved ✓' : 'Post published ✓')
      setTimeout(() => setShowEditor(false), 500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save content'

      // Provide more helpful error message for 409 conflicts
      if (errorMsg.includes('409') || errorMsg.includes('Conflict')) {
        showError(
          'Slug conflict: Another post has this URL. Try changing the post title slightly to generate a unique slug.',
          () => handleSave(postData, isDraft)
        )
      } else {
        showError(errorMsg, () => handleSave(postData, isDraft))
      }
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

  if (!project) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
            ← Admin
          </Link>
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
            Project not found
          </div>
        </div>
      </div>
    )
  }

  // Prepare initial data for the editor
  // Always ensure new blog posts for projects default to 'published'
  const initialEditorData: Partial<BlogPostData> = linkedPost ? {
    ...linkedPost,
    // Ensure linked posts maintain their status
  } : {
    title: project.title,
    slug: undefined,
    summary: project.description,
    content: '',
    category: 'Data Analytics',
    tags: project.tech_stack || [],
    featured: false,
    status: 'published' as const, // New posts default to published
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Container */}
        <ToastContainer toast={toast} onDismiss={dismiss} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
              ← Admin
            </Link>
            <h1 className="text-2xl font-bold">Edit Content: {project.title}</h1>
            <p className="text-sm opacity-60 mt-2">
              Write a blog-style write-up for this project. Add markdown, images, and more.
            </p>
          </div>
          {!showEditor && (
            <button
              onClick={() => setShowEditor(true)}
              className="px-6 py-3 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              Edit Content
            </button>
          )}
        </div>

        {/* Blog post editor */}
        {showEditor && (
          <div className="mb-8">
            <BlogPostEditor
              initialData={initialEditorData}
              onSave={handleSave}
            />
          </div>
        )}

        {!showEditor && linkedPost && (
          <div className={`p-6 border rounded-lg ${
            linkedPost.status === 'published'
              ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
              : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-4">Current Content</h2>
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70">
                    <strong>Status:</strong> <span className={`font-medium ${
                      linkedPost.status === 'published'
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {linkedPost.status === 'published' ? '✓ Published' : '⚠ Draft (Hidden)'}
                    </span>
                  </p>
                  <p className="text-sm text-foreground/70"><strong>Last Updated:</strong> {linkedPost.updatedAt ? new Date(linkedPost.updatedAt).toLocaleDateString() : 'Never'}</p>
                  <p className="text-sm text-foreground/70"><strong>Title:</strong> {linkedPost.title}</p>
                  {linkedPost.content && (
                    <p className="text-sm text-foreground/70"><strong>Content:</strong> {linkedPost.content.split('\n').length} lines, {linkedPost.content.split(/\s+/).length} words</p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Edit Content
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
