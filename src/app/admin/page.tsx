'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'
import { blogServiceSupabase, type BlogPostData } from '@/lib/blog-service-supabase'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import Link from 'next/link'
import { ChevronDown, Upload, X, File } from 'lucide-react'
import { uploadPdfReport } from '@/lib/actions/upload-pdf'
import { saveProjectAsAdmin, deleteProjectAsAdmin } from '@/lib/actions/admin-project-actions'

interface FormData {
  name: string
  description: string
  type: 'Investigation' | 'Research' | 'Analytics'
  tags: string
  externalLink: string
  fileUrl: string
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
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [pdfFileName, setPdfFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'Investigation',
    tags: '',
    externalLink: '',
    fileUrl: '',
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

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingPdf(true)
    setPdfFileName(file.name)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      const result = await uploadPdfReport(formDataToSend)

      if (result.success && result.url) {
        setFormData({ ...formData, fileUrl: result.url })
        showSuccess(`PDF uploaded: ${file.name}`)
      } else {
        showError(result.error || 'Failed to upload PDF')
      }
    } catch (err) {
      showError('Failed to upload PDF. Please try again.')
    } finally {
      setIsUploadingPdf(false)
      setPdfFileName(null)
      event.target.value = ''
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description) {
      showError('Please fill in project name and description')
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

      const projectData: any = {
        title: formData.name,
        description: formData.description,
        category: formData.type,
        status: 'active',
        tech_stack: tags,
      }

      if (formData.externalLink) {
        projectData.dune_url = formData.externalLink
      }

      if (formData.fileUrl) {
        projectData.file_url = formData.fileUrl
      }

      const result = await saveProjectAsAdmin(projectData)
      const projectId = result.projectId

      if (formData.blogTitle || formData.blogContent) {
        const blogTags = formData.blogTags
          .split(',')
          .map(t => t.trim())
          .filter(t => t)

        const blogTitle = formData.blogTitle || formData.name
        const blogSlug = await blogServiceSupabase.generateSlug(blogTitle)

        const blogPostData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'> = {
          title: blogTitle,
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
          status: 'published' as const,
          featuredImage: formData.blogFeaturedImage,
        }

        const savedPost = await blogServiceSupabase.savePost(blogPostData)

        if (!savedPost) {
          showError('Failed to create blog post. Please try again.')
          return
        }

        await projectServiceSupabase.updateProject(projectId, {
          blogPostSlug: savedPost.slug,
        })
      }

      setFormData({
        name: '',
        description: '',
        type: 'Investigation',
        tags: '',
        externalLink: '',
        fileUrl: '',
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
      await deleteProjectAsAdmin(id)
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
      <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-mono uppercase tracking-wider mb-8 inline-block rounded" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
            ← Back to site
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Admin Access</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Enter your admin password to continue</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'rgba(220, 38, 38, 0.3)', borderWidth: '1px', color: 'rgba(220, 38, 38, 0.9)' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="p-6 rounded" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '0.5px' }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="login-password" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--card-border)',
                    borderWidth: '0.5px',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--card-border)'
                  }}
                  placeholder="Enter admin password"
                  disabled={loginLoading}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-3 rounded font-medium text-sm transition-opacity"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#1a1a1a',
                  opacity: loginLoading ? 0.4 : 1,
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                }}
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
      <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-xs font-mono uppercase tracking-wider mb-6 inline-block rounded transition-opacity" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
            ← Back to site
          </Link>
          <h1 className="text-4xl font-serif font-bold mb-3">Admin</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your published work.</p>
        </div>

        {/* Toast Container */}
        <ToastContainer toast={toast} onDismiss={dismiss} />

        {/* Add Project Button */}
        <div className="mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 rounded text-sm font-medium transition-all"
            style={{
              borderColor: 'var(--accent)',
              borderWidth: '1px',
              color: 'var(--accent)',
              backgroundColor: showForm ? 'rgba(196, 147, 63, 0.08)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(196, 147, 63, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = showForm ? 'rgba(196, 147, 63, 0.08)' : 'transparent'
            }}
          >
            {showForm ? '← Cancel' : '+ New project'}
          </button>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <form onSubmit={handleAddProject} className="mb-12 mx-auto" style={{ maxWidth: '640px' }}>
            <div className="rounded p-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '0.5px' }}>
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs font-mono uppercase tracking-wider mb-6 inline-block transition-opacity"
                  style={{ color: 'var(--text-muted)', opacity: 0.8 }}
                >
                  ← Cancel
                </button>
                <h2 className="text-2xl font-serif font-bold">Add project</h2>
              </div>

              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label htmlFor="project-name" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Project Name *</label>
                  <input
                    id="project-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--card-border)',
                      borderWidth: '0.5px',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--card-border)'
                    }}
                    placeholder="e.g., Kraken $18.2M Social Engineering Theft"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="project-type" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Type *</label>
                  <select
                    id="project-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FormData['type'] })}
                    className="w-full px-4 py-3 rounded text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--card-border)',
                      borderWidth: '0.5px',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--card-border)'
                    }}
                  >
                    <option value="Investigation">Investigation</option>
                    <option value="Research">Research</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="project-description" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Description *</label>
                  <textarea
                    id="project-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--card-border)',
                      borderWidth: '0.5px',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--card-border)'
                    }}
                    placeholder="What did you investigate or build? What did you find?"
                    rows={4}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="project-tags" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Tags</label>
                  <input
                    id="project-tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--card-border)',
                      borderWidth: '0.5px',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--card-border)'
                    }}
                    placeholder="e.g., Ethereum, AML, Fund Tracing (comma-separated)"
                  />
                </div>

                {/* External Link */}
                <div>
                  <label htmlFor="project-external-link" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>External link</label>
                  <input
                    id="project-external-link"
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--card-border)',
                      borderWidth: '0.5px',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--card-border)'
                    }}
                    placeholder="https://x.com/... or https://paragraph.com/..."
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Link to X thread, Paragraph.com paper, or Dune dashboard. Leave blank if none.</p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Report file</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded p-8 text-center cursor-pointer transition-all"
                    style={{
                      borderColor: 'var(--card-border)',
                      borderWidth: '1px',
                      borderStyle: 'dashed',
                      backgroundColor: 'var(--bg-primary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--card-border)'
                    }}
                  >
                    {!formData.fileUrl ? (
                      <>
                        <Upload className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Choose file to upload</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>HTML or PDF · Max 10MB</p>
                      </>
                    ) : (
                      <>
                        <File className="w-4 h-4 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{pdfFileName}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFormData({ ...formData, fileUrl: '' })
                          }}
                          className="text-xs mt-3 inline-block transition-opacity"
                          style={{ color: 'var(--text-muted)', opacity: 0.6 }}
                        >
                          ✕ Remove
                        </button>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.pdf,application/pdf,text/html"
                    onChange={handlePdfUpload}
                    disabled={isUploadingPdf}
                    className="hidden"
                    aria-label="Upload report file"
                  />
                </div>

                {/* Extended Write-up Section */}

                {/* Extended Write-up Collapsible */}
                <div style={{ borderTopColor: 'var(--card-border)', borderTopWidth: '0.5px', paddingTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowContentSection(!showContentSection)}
                    className="flex items-center gap-2 text-sm font-medium transition-opacity"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ChevronDown
                      className="w-4 h-4 transition-transform"
                      style={{ transform: showContentSection ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                    Extended write-up (optional)
                  </button>

                  {showContentSection && (
                    <div className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="blog-title" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Title</label>
                        <input
                          id="blog-title"
                          type="text"
                          value={formData.blogTitle}
                          onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })}
                          className="w-full px-4 py-3 rounded text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--card-border)',
                            borderWidth: '0.5px',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--accent)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'var(--card-border)'
                          }}
                          placeholder="Leave empty to use project name"
                        />
                      </div>

                      <div>
                        <label htmlFor="blog-summary" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Summary</label>
                        <textarea
                          id="blog-summary"
                          value={formData.blogSummary}
                          onChange={(e) => setFormData({ ...formData, blogSummary: e.target.value })}
                          className="w-full px-4 py-3 rounded text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--card-border)',
                            borderWidth: '0.5px',
                            color: 'var(--text-primary)',
                            fontFamily: 'inherit',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--card-border)'
                          }}
                          placeholder="Brief description of the write-up"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label htmlFor="blog-content" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Content (Markdown)</label>
                        <textarea
                          id="blog-content"
                          value={formData.blogContent}
                          onChange={(e) => setFormData({ ...formData, blogContent: e.target.value })}
                          className="w-full px-4 py-3 rounded text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--card-border)',
                            borderWidth: '0.5px',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--card-border)'
                          }}
                          placeholder="Write your content in Markdown..."
                          rows={10}
                        />
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                          Markdown supported: **bold**, *italic*, `code`, ## headers, &gt; quotes, - lists
                        </p>
                      </div>

                      <div>
                        <label htmlFor="blog-category" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Category</label>
                        <select
                          id="blog-category"
                          value={formData.blogCategory}
                          onChange={(e) => setFormData({ ...formData, blogCategory: e.target.value })}
                          className="w-full px-4 py-3 rounded text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--card-border)',
                            borderWidth: '0.5px',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--card-border)'
                          }}
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
                        <label htmlFor="blog-tags" className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Tags (comma-separated)</label>
                        <input
                          id="blog-tags"
                          type="text"
                          value={formData.blogTags}
                          onChange={(e) => setFormData({ ...formData, blogTags: e.target.value })}
                          className="w-full px-4 py-3 rounded text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--card-border)',
                            borderWidth: '0.5px',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--accent)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'var(--card-border)'
                          }}
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

                      <div style={{ borderTopColor: 'var(--card-border)', borderTopWidth: '0.5px', paddingTop: '1rem' }}>
                        <ImageUpload
                          label="Add Images to Content"
                          onImageSelect={(url) => {
                            const imageMarkdown = `![Image](${url})\n\n`
                            setFormData({ ...formData, blogContent: formData.blogContent + imageMarkdown })
                          }}
                        />
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                          Images will be added to the end of your content as Markdown
                        </p>
                      </div>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.blogFeatured}
                          onChange={(e) => setFormData({ ...formData, blogFeatured: e.target.checked })}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: 'var(--accent)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Mark as featured post</span>
                      </label>
                    </div>
                  )}
                </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 rounded font-medium text-sm transition-opacity"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#1a1a1a',
                  opacity: saving ? 0.4 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  marginTop: '1.5rem',
                }}
              >
                {saving ? 'Saving…' : 'Save project'}
              </button>
            </div>
            </div>
          </form>
        )}

        {/* Projects List */}
        <div>
          {loading ? (
            <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>No projects yet.</p>
              <p className="mb-8" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Add your first project to get started.</p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
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
                  + New project
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded transition-all"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                    borderWidth: '0.5px',
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-base" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
                        {project.blogPostSlug && (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· has content</span>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block text-xs px-2 py-1 rounded"
                              style={{
                                borderColor: 'var(--card-border)',
                                borderWidth: '0.5px',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 shrink-0">
                      {project.id && (
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="text-xs font-medium transition-opacity"
                          style={{ color: 'var(--accent)' }}
                        >
                          Edit
                        </Link>
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
