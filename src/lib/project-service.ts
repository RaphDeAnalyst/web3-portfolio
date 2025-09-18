import { projects as staticProjects, Project } from '@/data/projects'
import { logger } from './logger'

export class ProjectService {
  private STORAGE_KEY = 'portfolio_projects'
  
  // Get all projects (from localStorage or static data as fallback)
  getAllProjects(): Project[] {
    if (typeof window === 'undefined') {
      return staticProjects // Server-side fallback
    }
    
    try {
      const storedProjects = localStorage.getItem(this.STORAGE_KEY)
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects)
        // Merge with static data to ensure new projects are included
        const merged = this.mergeProjects(staticProjects, parsed)
        return merged
      }
    } catch (error) {
      logger.error('Error loading projects from localStorage:', error)
    }
    
    return staticProjects
  }
  
  // Merge static projects with stored projects, preferring stored versions
  private mergeProjects(staticProjects: Project[], storedProjects: Project[]): Project[] {
    const merged = [...staticProjects]
    const newProjects: Project[] = []
    
    storedProjects.forEach(storedProject => {
      const index = merged.findIndex(p => p.title === storedProject.title)
      if (index !== -1) {
        // Update existing project with stored data
        merged[index] = { ...merged[index], ...storedProject }
      } else {
        // Collect new projects that don't exist in static data
        newProjects.push(storedProject)
      }
    })
    
    // Add new projects at the beginning, maintaining their order
    return [...newProjects, ...merged]
  }
  
  // Save all projects to localStorage
  saveAllProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    } catch (error) {
      logger.error('Error saving projects to localStorage:', error)
      throw error
    }
  }
  
  // Get project by index
  getProjectByIndex(index: number): Project | null {
    const projects = this.getAllProjects()
    return projects[index] || null
  }
  
  // Update a specific project
  updateProject(index: number, updatedProject: Partial<Project>): void {
    const projects = this.getAllProjects()
    
    if (index < 0 || index >= projects.length) {
      throw new Error('Project index out of range')
    }
    
    // Update the project
    projects[index] = { ...projects[index], ...updatedProject }
    
    // Save to localStorage
    this.saveAllProjects(projects)
    
  }
  
  // Add new project
  addProject(newProject: Omit<Project, 'id'>): void {
    const projects = this.getAllProjects()
    const projectWithId = {
      ...newProject,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    projects.unshift(projectWithId) // Add to beginning of array
    this.saveAllProjects(projects)
    
  }
  
  // Delete project
  deleteProject(index: number): void {
    const projects = this.getAllProjects()
    
    if (index < 0 || index >= projects.length) {
      throw new Error('Project index out of range')
    }
    
    const deletedProject = projects[index]
    projects.splice(index, 1)
    this.saveAllProjects(projects)
    
  }
  
  // Get featured projects (max 3)
  getFeaturedProjects(): Project[] {
    return this.getAllProjects().filter(p => p.featured).slice(0, 3)
  }
  
  // Set featured status
  setFeaturedStatus(index: number, featured: boolean): void {
    const projects = this.getAllProjects()
    
    if (index < 0 || index >= projects.length) {
      throw new Error('Project index out of range')
    }
    
    // If setting to featured, check if we already have 3 featured projects
    if (featured) {
      const currentFeatured = projects.filter(p => p.featured)
      if (currentFeatured.length >= 3) {
        throw new Error('Maximum of 3 projects can be featured. Please unfeature another project first.')
      }
    }
    
    this.updateProject(index, { featured })
  }
  
  // Reset to static data (for development/testing)
  resetToStaticData(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.STORAGE_KEY)
  }
  
  // Get projects statistics
  getProjectStats() {
    const projects = this.getAllProjects()
    
    return {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      byStatus: {
        live: projects.filter(p => p.status === 'Live').length,
        development: projects.filter(p => p.status === 'Development').length,
        complete: projects.filter(p => p.status === 'Complete').length,
        learning: projects.filter(p => p.status === 'Learning').length,
        beta: projects.filter(p => p.status === 'Beta').length
      },
      byCategory: projects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
}

export const projectService = new ProjectService()