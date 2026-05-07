'use client'

import { useState, useEffect } from 'react'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Work</h1>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-12 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
            Error loading projects: {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12 opacity-50">
            <p>Loading projects...</p>
          </div>
        )}

        {/* Project Cards */}
        {!loading && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-12 opacity-50">
                <p>No projects yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={project.duneUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 sm:p-8 border border-border rounded hover:border-foreground hover:shadow-lg transition-all duration-300"
                  >
                    {/* Project Name */}
                    <h2 className="text-xl font-semibold mb-3 group-hover:opacity-70 transition-opacity">
                      {project.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base opacity-70 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
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

                    {/* Link */}
                    <div className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                      View on Dune ↗
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
