'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProjectEditor } from '@/components/admin/project-editor'
import { projectService } from '@/lib/service-switcher'
import { ActivityService } from '@/lib/activity-service'

export default function NewProject() {
  const router = useRouter()
  
  const handleSave = async (projectData: any, isDraft: boolean) => {
    try {
      // Add the project using service switcher
      await projectService.addProject({
        ...projectData,
        status: isDraft ? 'Learning' : projectData.status
      })
      
      // Track the activity
      ActivityService.trackProject(projectData.title, false)
      
      // Redirect to projects list
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project. Please try again.')
    }
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
            <h1 className="text-2xl font-bold text-foreground">New Project</h1>
            <p className="text-foreground/70">Add a new project to your portfolio</p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <ProjectEditor onSave={handleSave} />
    </div>
  )
}