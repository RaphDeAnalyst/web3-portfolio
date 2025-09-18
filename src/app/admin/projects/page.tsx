'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { projectService } from '@/lib/service-switcher'
import { Project } from '@/data/projects'
import type { Project as ServiceProject } from '@/lib/project-service-supabase'
import { useNotification } from '@/lib/notification-context'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  Rocket,
  CheckCircle,
  RefreshCw,
  Star,
  ExternalLink,
  Github
} from 'lucide-react'
import { logger } from '@/lib/logger'

export default function ProjectsManagement() {
  const { error, success } = useNotification()
  const [projectList, setProjectList] = useState<(Project | ServiceProject)[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterFeatured, setFilterFeatured] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; project: (Project | ServiceProject) | null; index: number }>({
    isOpen: false,
    project: null,
    index: -1
  })

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await projectService.getAllProjects()
        setProjectList(projects)
      } catch (err) {
        logger.error('Error loading projects:', err)
        error('Failed to load projects. Please refresh the page.')
      } finally {
        setIsLoaded(true)
      }
    }

    loadProjects()
  }, [])

  const categories = Array.from(new Set(projectList.map(project => project.category)))

  const filteredProjects = projectList.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory
    const matchesFeatured = filterFeatured === 'all' || 
                           (filterFeatured === 'featured' && project.featured) ||
                           (filterFeatured === 'regular' && !project.featured)
    return matchesSearch && matchesCategory && matchesFeatured
  })

  const openDeleteDialog = (project: Project | ServiceProject, index: number) => {
    setDeleteDialog({ isOpen: true, project, index })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, project: null, index: -1 })
  }

  const handleDeleteProject = async () => {
    if (!deleteDialog.project || deleteDialog.index === -1) return

    const { title } = deleteDialog.project
    try {
      await projectService.deleteProject(deleteDialog.index)
      // Reload projects after deletion
      const updatedProjects = await projectService.getAllProjects()
      setProjectList(updatedProjects)
      success(`Project "${title}" deleted successfully`)
    } catch (err) {
      logger.error('Error deleting project:', err)
      error('Failed to delete project. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Complete': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Learning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Beta': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }


  const statsData = {
    total: projectList.length,
    completed: projectList.filter(p => p.status === 'Complete' || p.status === 'Live').length,
    inProgress: projectList.filter(p => p.status === 'Development').length,
    featured: projectList.filter(p => p.featured).length
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-sm sm:text-base text-foreground/70 mt-1">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-foreground hover:bg-foreground/80 text-background rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20 flex items-center space-x-2"
        >
          <span>New Project</span>
        </Link>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Projects</p>
              <p className="text-2xl font-bold text-foreground">{statsData.total}</p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <Rocket className="text-foreground" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Completed</p>
              <p className="text-2xl font-bold text-foreground">{statsData.completed}</p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-foreground" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">In Progress</p>
              <p className="text-2xl font-bold text-foreground">{statsData.inProgress}</p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <RefreshCw className="text-foreground" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Featured</p>
              <p className="text-2xl font-bold text-foreground">{statsData.featured}</p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <Star className="text-foreground" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10"
          />
        </div>
        <div className="flex space-x-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="all">All Projects</option>
            <option value="featured">Featured Only</option>
            <option value="regular">Regular Only</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project, index) => (
            <div key={index} className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 hover:shadow-lg transition-shadow">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base sm:text-lg mb-2">{project.title}</h3>
                  <p className="text-foreground/70 text-sm line-clamp-3 mb-3">{project.description}</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                

                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60">Category</span>
                  <span className="text-xs text-foreground">{project.category}</span>
                </div>
                
                {project.featured && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/60">Featured</span>
                    <span className="text-xs text-foreground font-medium">Yes</span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="text-xs text-foreground/60 mb-2">Tech Stack</div>
                <div className="flex flex-wrap gap-1">
                  {project.tech?.slice(0, 3).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-foreground/10 text-foreground text-xs rounded">
                      {tech}
                    </span>
                  ))}
                  {project.tech && project.tech.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-foreground/60 text-xs rounded">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>


              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 gap-2 sm:gap-0">
                <div className="flex space-x-2">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-foreground/60 hover:text-foreground hover:bg-foreground/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="View demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-foreground/60 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="View code"
                    >
                      <Github size={16} />
                    </a>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/projects/edit/${index}`}
                    className="p-3 text-foreground/60 hover:text-foreground hover:bg-foreground/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Edit project"
                  >
Edit
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(project, index)}
                    className="p-3 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Delete project"
                  >
Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-background rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
          <p className="text-foreground/60 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first project'
            }
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-foreground hover:bg-foreground/80 text-background rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20"
          >
            <span>Add First Project</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteDialog.project?.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}