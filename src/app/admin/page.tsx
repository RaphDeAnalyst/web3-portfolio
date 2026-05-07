'use client'

import { useState, useEffect } from 'react'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'
import Link from 'next/link'

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    duneUrl: '',
  })

  // Load projects
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectServiceSupabase.getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.duneUrl) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setError(null)
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t)

      await projectServiceSupabase.addProject({
        title: formData.name,
        description: formData.description,
        category: 'DeFi', // Default category
        status: 'active',
        duneUrl: formData.duneUrl,
        tech_stack: tags,
      })

      setFormData({ name: '', description: '', tags: '', duneUrl: '' })
      setShowForm(false)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project')
    }
  }

  const handleDeleteProject = async (id: string | undefined) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      setError(null)
      await projectServiceSupabase.deleteProject(id)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Admin</h1>
          <p className="text-sm opacity-60 mt-2">Manage your work projects</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Add Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-foreground text-background rounded hover:opacity-80 transition-opacity font-medium text-sm"
          >
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <form onSubmit={handleAddProject} className="mb-12 p-6 border border-border rounded">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="e.g., Base Network Activity Dashboard"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="What does this project measure? What did you find?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="e.g., Base, L2 Activity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dune URL *</label>
                <input
                  type="url"
                  value={formData.duneUrl}
                  onChange={(e) => setFormData({ ...formData, duneUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="https://dune.com/your-username/dashboard-name"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-foreground text-background rounded hover:opacity-80 transition-opacity font-medium"
              >
                Save Project
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
                      <h3 className="font-semibold text-base">{project.title}</h3>
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
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      Delete
                    </button>
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
