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
      <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-xs font-mono uppercase tracking-wider mb-4 inline-block transition-opacity" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
            ← Admin
          </Link>
          <div className="mt-8 p-4 rounded text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'rgba(220, 38, 38, 0.3)', borderWidth: '1px', color: 'rgba(220, 38, 38, 0.9)' }}>
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
    <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Container */}
        <ToastContainer toast={toast} onDismiss={dismiss} />

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-xs font-mono uppercase tracking-wider mb-6 inline-block transition-opacity" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
            ← Admin
          </Link>
          <h1 className="text-3xl font-serif font-bold mb-3">Edit: {project.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Write a blog-style extended write-up for this project. Add markdown, images, and more.
          </p>
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
          <div className="p-6 rounded" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '0.5px' }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-4">Current Content</h2>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Status:</strong> <span style={{ color: linkedPost.status === 'published' ? 'rgba(100, 200, 100, 0.9)' : 'rgba(200, 150, 50, 0.9)', fontWeight: 500 }}>
                      {linkedPost.status === 'published' ? '✓ Published' : '⚠ Draft (Hidden)'}
                    </span>
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}><strong>Last Updated:</strong> {linkedPost.updatedAt ? new Date(linkedPost.updatedAt).toLocaleDateString() : 'Never'}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}><strong>Title:</strong> {linkedPost.title}</p>
                  {linkedPost.content && (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}><strong>Content:</strong> {linkedPost.content.split('\n').length} lines, {linkedPost.content.split(/\s+/).length} words</p>
                  )}
                </div>
              </div>
            </div>
            {!showEditor && (
              <button
                onClick={() => setShowEditor(true)}
                className="mt-4 px-4 py-2 rounded text-sm font-medium transition-opacity"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#1a1a1a',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.88'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                Edit Content
              </button>
            )}
          </div>
        )}

        {!showEditor && !linkedPost && (
          <div className="text-center py-12">
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>No content yet for this project.</p>
            <button
              onClick={() => setShowEditor(true)}
              className="px-5 py-2 rounded text-sm font-medium transition-all"
              style={{
                borderColor: 'var(--accent)',
                borderWidth: '1px',
                color: 'var(--accent)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(196, 147, 63, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              + Add Content
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
