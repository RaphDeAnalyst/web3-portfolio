'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ProjectEditor } from '@/components/admin/project-editor'
import { projectService } from '@/lib/service-switcher'
import { ActivityService } from '@/lib/activity-service'

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)
  
  const [projectData, setProjectData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the project by index using service switcher
    const loadProject = async () => {
      try {
        const project = await projectService.getProjectByIndex(id)
        if (project) {
          setProjectData(project)
        }
      } catch (error) {
        console.error('Error loading project:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleSave = async (updatedProjectData: any, isDraft: boolean) => {
    try {
      // Update the project using service switcher
      await projectService.updateProject(id, {
        ...updatedProjectData,
        status: isDraft ? 'Learning' : updatedProjectData.status
      })
      
      // Track the activity
      ActivityService.trackProject(updatedProjectData.title, true)
      
      // Redirect to projects list
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error updating project:', error)
      
      // Provide specific error messages based on error type
      let errorMessage = 'Error updating project. Please try again.'
      if (error instanceof Error) {
        if (error.message.includes('schema error')) {
          errorMessage = 'Database error: Missing columns. Please run the database migration script.'
        } else if (error.message.includes('connection')) {
          errorMessage = 'Connection error. Please check your internet connection and try again.'
        } else if (error.message.includes('Failed to update')) {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-center py-20">
        <div className="text-6xl mb-4">💼</div>
        <h1 className="text-2xl font-bold text-foreground">Project Not Found</h1>
        <p className="text-foreground/70">The project you're looking for doesn't exist.</p>
        <Link
          href="/admin/projects"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200"
        >
          <span>←</span>
          <span>Back to Projects</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/projects"
            className="p-2 text-foreground/60 hover:text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
            <p className="text-foreground/70">Update your project details</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs ${
            projectData.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            projectData.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {projectData.status}
          </span>
          <span className="text-foreground/60">•</span>
          <span className="text-foreground/60">{projectData.category}</span>
        </div>
      </div>

      {/* Editor */}
      <ProjectEditor initialData={projectData} onSave={handleSave} />
    </div>
  )
}