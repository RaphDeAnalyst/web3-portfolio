'use client'

import { useState, useEffect, useCallback } from 'react'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'
import { blogServiceSupabase, type BlogPostData } from '@/lib/blog-service-supabase'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FormData {
  // Project fields
  name: string
  description: string
  tags: string
  duneUrl: string

  // Blog content fields
  blogTitle: string
  blogContent: string
  blogSummary: string
  blogCategory: string
  blogTags: string
  blogFeaturedImage: string
  blogFeatured: boolean
}

export default function AdminPage() {
  const { toast, showSuccess, showError, showLoading, dismiss } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showContentSection, setShowContentSection] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // Project
    name: '',
    description: '',
    tags: '',
    duneUrl: '',

    // Blog
    blogTitle: '',
    blogContent: '',
    blogSummary: '',
    blogCategory: 'Data Analytics',
    blogTags: '',
    blogFeaturedImage: '',
    blogFeatured: false,
  })

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      const data = await projectServiceSupabase.getAllProjects()
      setProjects(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects'
      showError(message, () => loadProjects())
    } finally {
      setLoading(false)
    }
  }, [showError])

  // Check authentication and load projects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth')
        if (res.ok) {
          setIsAuthenticated(true)
          loadProjects()
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [loadProjects])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginPassword) {
      setLoginError('Password is required')
      return
    }

    try {
      setLoginLoading(true)
      setLoginError(null)

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      })

      if (!res.ok) {
        const data = await res.json()
        setLoginError(data.error || 'Login failed')
        return
      }

      // Login successful, set authenticated and load projects
      setIsAuthenticated(true)
      setLoginPassword('')
      await loadProjects()
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.duneUrl) {
      showError('Please fill in all required fields')
      return
    }

    // If blog content is provided, validate required fields
    if (formData.blogContent && (!formData.blogTitle || !formData.blogSummary)) {
      showError('If adding blog content, please provide a title and summary')
      return
    }

    try {
      setSaving(true)
      showLoading('Saving project...')

      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t)

      // Create project
      const projectId = await projectServiceSupabase.addProject({
        title: formData.name,
        description: formData.description,
        category: 'DeFi',
        status: 'active',
        duneUrl: formData.duneUrl,
        tech_stack: tags,
      })

      // If blog content provided, create blog post and link it
      if (formData.blogTitle || formData.blogContent) {
        const blogTags = formData.blogTags
          .split(',')
          .map(t => t.trim())
          .filter(t => t)

        const blogSlug = formData.blogTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        const blogPostData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'> = {
          title: formData.blogTitle || formData.name,
          slug: blogSlug,
          summary: formData.blogSummary || formData.description,
          content: formData.blogContent,
          category: formData.blogCategory,
          tags: blogTags.length > 0 ? blogTags : tags,
          author: {
            name: 'Matthew Raphael',
            avatar: '/avatar.jpg'
          },
          date: new Date().toISOString().split('T')[0],
          readTime: '5 min read',
          featured: formData.blogFeatured,
          status: 'published' as const, // Always publish new blog posts created with projects
          featuredImage: formData.blogFeaturedImage,
        }

        const savedPost = await blogServiceSupabase.savePost(blogPostData)

        if (savedPost) {
          // Link blog post to project
          await projectServiceSupabase.updateProject(projectId, {
            blogPostSlug: savedPost.slug,
          })
        }
      }

      setFormData({
        name: '',
        description: '',
        tags: '',
        duneUrl: '',
        blogTitle: '',
        blogContent: '',
        blogSummary: '',
        blogCategory: 'Data Analytics',
        blogTags: '',
        blogFeaturedImage: '',
        blogFeatured: false,
      })
      setShowForm(false)
      setShowContentSection(false)
      showSuccess('Project saved ✓')
      await loadProjects()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save project'
      showError(message, () => handleAddProject(e))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async (id: string | undefined) => {
    if (!id) return

    try {
      showLoading('Deleting...')
      await projectServiceSupabase.deleteProject(id)
      showSuccess('Project deleted ✓')
      await loadProjects()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed. Check your connection.'
      showError(message, () => handleDeleteProject(id))
    }
  }

  // Show login form if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground mb-8 inline-block rounded">
            ← Back
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-sm opacity-60">Enter your admin password to continue</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="p-6 border border-border rounded">
            <div className="space-y-4">
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium mb-2">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  placeholder="Enter admin password"
                  disabled={loginLoading}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-3 h-11 flex items-center justify-center bg-foreground text-background rounded hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background transition-opacity font-medium disabled:opacity-50"
              >
                {loginLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center opacity-50 py-12">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground mb-4 inline-block rounded">
            ← Back
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Admin</h1>
          <p className="text-sm opacity-60 mt-2">Manage your work projects</p>
        </div>

        {/* Toast Container */}
        <ToastContainer toast={toast} onDismiss={dismiss} />

        {/* Add Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 h-11 flex items-center justify-center bg-foreground text-background rounded hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background transition-opacity font-medium text-sm"
          >
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <form onSubmit={handleAddProject} className="mb-12 p-6 border border-border rounded">
            <div className="space-y-6">
              {/* Project Details Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium mb-2">Project Name *</label>
                    <input
                      id="project-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                      placeholder="e.g., Base Network Activity Dashboard"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      id="project-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                      placeholder="What does this project measure? What did you find?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label htmlFor="project-tags" className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                      id="project-tags"
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                      placeholder="e.g., Base, L2 Activity"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-dune-url" className="block text-sm font-medium mb-2">Dune URL *</label>
                    <input
                      id="project-dune-url"
                      type="url"
                      value={formData.duneUrl}
                      onChange={(e) => setFormData({ ...formData, duneUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                      placeholder="https://dune.com/your-username/dashboard-name"
                    />
                  </div>
                </div>
              </div>

              {/* Blog Content Section */}
              <div className="border-t border-border pt-6">
                <button
                  type="button"
                  onClick={() => setShowContentSection(!showContentSection)}
                  className="flex items-center justify-between w-full mb-4 hover:opacity-70 transition-opacity"
                >
                  <h3 className="text-lg font-semibold">Blog Content (Optional)</h3>
                  {showContentSection ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {showContentSection && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="blog-title" className="block text-sm font-medium mb-2">Blog Title</label>
                      <input
                        id="blog-title"
                        type="text"
                        value={formData.blogTitle}
                        onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                        placeholder="Leave empty to use project name"
                      />
                    </div>

                    <div>
                      <label htmlFor="blog-summary" className="block text-sm font-medium mb-2">Blog Summary</label>
                      <textarea
                        id="blog-summary"
                        value={formData.blogSummary}
                        onChange={(e) => setFormData({ ...formData, blogSummary: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                        placeholder="Brief description of the blog post"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label htmlFor="blog-content" className="block text-sm font-medium mb-2">Content (Markdown)</label>
                      <textarea
                        id="blog-content"
                        value={formData.blogContent}
                        onChange={(e) => setFormData({ ...formData, blogContent: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground font-mono text-sm"
                        placeholder="Write your blog content in Markdown..."
                        rows={10}
                      />
                      <div className="text-xs opacity-60 mt-2">
                        Markdown supported: **bold**, *italic*, `code`, ## headers, &gt; quotes, - lists
                      </div>
                    </div>

                    <div>
                      <label htmlFor="blog-category" className="block text-sm font-medium mb-2">Category</label>
                      <select
                        id="blog-category"
                        value={formData.blogCategory}
                        onChange={(e) => setFormData({ ...formData, blogCategory: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                      >
                        <option>Web3 Learning</option>
                        <option>Data Analytics</option>
                        <option>Blockchain Analysis</option>
                        <option>Python Tutorials</option>
                        <option>Career Transition</option>
                        <option>Tools & Resources</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="blog-tags" className="block text-sm font-medium mb-2">Blog Tags (comma-separated)</label>
                      <input
                        id="blog-tags"
                        type="text"
                        value={formData.blogTags}
                        onChange={(e) => setFormData({ ...formData, blogTags: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                        placeholder="Leave empty to use project tags"
                      />
                    </div>

                    <div>
                      <ImageUpload
                        label="Featured Image"
                        currentImage={formData.blogFeaturedImage}
                        onImageSelect={(url) => setFormData({ ...formData, blogFeaturedImage: url })}
                      />
                    </div>

                    <div className="border-t border-border pt-4">
                      <ImageUpload
                        label="Add Images to Content"
                        onImageSelect={(url) => {
                          const imageMarkdown = `![Image](${url})\n\n`
                          setFormData({ ...formData, blogContent: formData.blogContent + imageMarkdown })
                        }}
                      />
                      <p className="text-xs opacity-60 mt-2">
                        Images will be added to the end of your content as Markdown
                      </p>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.blogFeatured}
                        onChange={(e) => setFormData({ ...formData, blogFeatured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Mark as featured post</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 h-11 flex items-center justify-center bg-foreground text-background rounded hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background transition-opacity font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Project & Content'}
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Projects ({projects.length})</h2>

          {loading ? (
            <p className="text-center opacity-50 py-8">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-center opacity-50 py-8">No projects yet. Add your first one!</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-border rounded hover:border-foreground transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{project.title}</h3>
                        {project.blogPostSlug && (
                          <span className="text-xs opacity-50">• has content</span>
                        )}
                      </div>
                      <p className="text-sm opacity-60 mt-1 line-clamp-2">{project.description}</p>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tech_stack.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block text-xs px-2 py-1 bg-foreground/10 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.id && (
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400 font-medium transition-colors rounded"
                        >
                          Edit
                        </Link>
                      )}
                      {!project.id && (
                        <span className="px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
                          Edit
                        </span>
                      )}
                      <DeleteConfirmButton
                        onConfirm={() => handleDeleteProject(project.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
