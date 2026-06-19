'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { projectServiceSupabase } from '@/lib/project-service-supabase'
import { blogServiceSupabase, type BlogPostData } from '@/lib/blog-service-supabase'
import { BlogPostEditor } from '@/components/admin/blog-post-editor'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import { Save, RefreshCw } from 'lucide-react'
import type { Project } from '@/lib/project-service-supabase'

const PROJECT_TYPES = ['Investigation', 'Research', 'Analytics'] as const

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const { toast, showSuccess, showError, dismiss } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [linkedPost, setLinkedPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [savingType, setSavingType] = useState(false)
  const [savingInvestigation, setSavingInvestigation] = useState(false)
  const [investigation, setInvestigation] = useState({
    mandate: '',
    methodology: '',
    findings: '',
    outcome: '',
  })

  const loadProject = useCallback(async () => {
    try {
      setLoading(true)

      const projectData = await projectServiceSupabase.getProjectById(params.id)
      if (!projectData) return

      setProject(projectData)
      setInvestigation({
        mandate: projectData.investigationMandate || '',
        methodology: projectData.investigationMethodology || '',
        findings: projectData.investigationFindings || '',
        outcome: projectData.investigationOutcome || '',
      })

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

  const handleTypeChange = async (newType: string) => {
    if (!project) return
    setSavingType(true)
    try {
      await projectServiceSupabase.updateProject(project.id || params.id, { category: newType })
      setProject(prev => prev ? { ...prev, category: newType } : prev)
    } catch {
      showError('Failed to update project type')
    } finally {
      setSavingType(false)
    }
  }

  const handleSaveInvestigation = async () => {
    if (!project) return
    setSavingInvestigation(true)
    try {
      await projectServiceSupabase.updateProject(project.id || params.id, {
        investigationMandate: investigation.mandate,
        investigationMethodology: investigation.methodology,
        investigationFindings: investigation.findings,
        investigationOutcome: investigation.outcome,
      })
      showSuccess('Investigation brief saved ✓')
    } catch {
      showError('Failed to save investigation brief')
    } finally {
      setSavingInvestigation(false)
    }
  }

  const handleSave = async (postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, isDraft: boolean) => {
    if (!project) return

    try {
      setSaving(true)

      const existingPostId = linkedPost?.id

      const savedPost = await blogServiceSupabase.savePost(
        postData,
        existingPostId
      )

      if (!savedPost) {
        showError('Failed to save post. Please ensure the post content and title are valid.', () => handleSave(postData, isDraft))
        return
      }

      if (!project.blogPostSlug) {
        await projectServiceSupabase.updateProject(project.id || params.id, {
          blogPostSlug: savedPost.slug,
        })
      }

      setLinkedPost(savedPost)
      setProject({
        ...project,
        blogPostSlug: savedPost.slug,
      })

      showSuccess(isDraft ? 'Draft saved ✓' : 'Post published ✓')
      setTimeout(() => setShowEditor(false), 500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save content'

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

  const initialEditorData: Partial<BlogPostData> = linkedPost ? {
    ...linkedPost,
  } : {
    title: project.title,
    slug: undefined,
    summary: project.description,
    content: '',
    category: 'Data Analytics',
    tags: project.tech_stack || [],
    featured: false,
    status: 'published' as const,
  }

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer toast={toast} onDismiss={dismiss} />

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-xs font-mono uppercase tracking-wider mb-6 inline-block transition-opacity" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
            ← Admin
          </Link>
          <h1 className="text-3xl font-serif font-bold mb-3">Edit: {project.title}</h1>
        </div>

        {/* Project type selector */}
        <div
          className="mb-6 p-4 rounded flex items-center gap-4"
          style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--card-border)' }}
        >
          <span
            className="text-xs font-mono uppercase tracking-wider shrink-0"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
          >
            Type
          </span>
          <div className="flex gap-2 flex-wrap">
            {PROJECT_TYPES.map(t => (
              <button
                key={t}
                disabled={savingType}
                onClick={() => handleTypeChange(t)}
                className="px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all"
                style={{
                  border: '1px solid',
                  borderColor: project.category === t ? 'var(--accent)' : 'var(--border)',
                  color: project.category === t ? 'var(--accent)' : 'var(--text-muted)',
                  backgroundColor: 'transparent',
                  opacity: savingType ? 0.5 : 1,
                  cursor: savingType ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.1em',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Investigation brief editor */}
        {project.category === 'Investigation' && (
          <div
            className="mb-8 rounded"
            style={{ border: '0.5px solid var(--card-border)' }}
          >
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: '0.5px solid var(--card-border)' }}
            >
              <span
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
              >
                Investigation Brief
              </span>
              <button
                onClick={handleSaveInvestigation}
                disabled={savingInvestigation}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-opacity"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#1a1a1a',
                  opacity: savingInvestigation ? 0.6 : 1,
                  cursor: savingInvestigation ? 'not-allowed' : 'pointer',
                }}
              >
                {savingInvestigation
                  ? <><RefreshCw className="w-3 h-3 animate-spin" /> Saving…</>
                  : <><Save className="w-3 h-3" /> Save brief</>
                }
              </button>
            </div>

            <div className="p-5 space-y-6">
              {([
                { key: 'mandate'     as const, label: 'Mandate',     rows: 3, hint: 'The question or mandate — what were you asked to find?' },
                { key: 'methodology' as const, label: 'Methodology',  rows: 4, hint: 'Address clustering, graph traversal, exchange tracing…' },
                { key: 'findings'    as const, label: 'Findings',     rows: 5, hint: 'Key findings. Include addresses/tx hashes where relevant.' },
                { key: 'outcome'     as const, label: 'Outcome',      rows: 3, hint: 'What was established, at what confidence, within what timeframe.' },
              ]).map(({ key, label, rows, hint }) => (
                <div key={key} className="space-y-1.5">
                  <label
                    className="block text-xs font-mono uppercase tracking-wider"
                    style={{ color: 'var(--accent)', letterSpacing: '0.12em' }}
                  >
                    {label}
                  </label>
                  <textarea
                    rows={rows}
                    value={investigation[key]}
                    onChange={e => setInvestigation(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={hint}
                    className="w-full px-3 py-2 rounded text-sm resize-none transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '0.5px solid var(--card-border)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--card-border)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog post editor — Research and Analytics only */}
        {project.category !== 'Investigation' && showEditor && (
          <div className="mb-8">
            <BlogPostEditor
              initialData={initialEditorData}
              onSave={handleSave}
            />
          </div>
        )}

        {project.category !== 'Investigation' && !showEditor && linkedPost && (
          <div className="p-6 rounded" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '0.5px' }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-4">Current Content</h2>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Status:</strong>{' '}
                    <span style={{ color: linkedPost.status === 'published' ? 'rgba(100, 200, 100, 0.9)' : 'rgba(200, 150, 50, 0.9)', fontWeight: 500 }}>
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
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 px-4 py-2 rounded text-sm font-medium transition-opacity"
              style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Edit Content
            </button>
          </div>
        )}

        {project.category !== 'Investigation' && !showEditor && !linkedPost && (
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
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(196, 147, 63, 0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              + Add Content
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
