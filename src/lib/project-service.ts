import { projects as staticProjects, Project } from '@/data/projects'
import { ActivityService } from './activity-service'

export class ProjectService {
  private static STORAGE_KEY = 'portfolio_projects'
  
  // Get all projects (from localStorage or static data as fallback)
  static getAllProjects(): Project[] {
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
      console.error('Error loading projects from localStorage:', error)
    }
    
    return staticProjects
  }
  
  // Merge static projects with stored projects, preferring stored versions
  private static mergeProjects(staticProjects: Project[], storedProjects: Project[]): Project[] {
    const merged = [...staticProjects]
    
    storedProjects.forEach(storedProject => {
      const index = merged.findIndex(p => p.title === storedProject.title)
      if (index !== -1) {
        // Update existing project with stored data
        merged[index] = { ...merged[index], ...storedProject }
      } else {
        // Add new project that doesn't exist in static data
        merged.push(storedProject)
      }
    })
    
    return merged
  }
  
  // Save all projects to localStorage
  static saveAllProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving projects to localStorage:', error)
      throw error
    }
  }
  
  // Get project by index
  static getProjectByIndex(index: number): Project | null {
    const projects = this.getAllProjects()
    return projects[index] || null
  }
  
  // Update a specific project
  static updateProject(index: number, updatedProject: Partial<Project>): void {
    const projects = this.getAllProjects()
    
    if (index < 0 || index >= projects.length) {
      throw new Error('Project index out of range')
    }
    
    // Update the project
    projects[index] = { ...projects[index], ...updatedProject }
    
    // Save to localStorage
    this.saveAllProjects(projects)
    
    // Track activity
    ActivityService.trackProject(projects[index].title, true)
  }
  
  // Add new project
  static addProject(newProject: Omit<Project, 'id'>): void {
    const projects = this.getAllProjects()
    const projectWithId = {
      ...newProject,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    projects.push(projectWithId)
    this.saveAllProjects(projects)
    
    // Track activity
    ActivityService.trackProject(newProject.title, false)
  }
  
  // Delete project
  static deleteProject(index: number): void {
    const projects = this.getAllProjects()
    
    if (index < 0 || index >= projects.length) {
      throw new Error('Project index out of range')
    }
    
    const deletedProject = projects[index]
    projects.splice(index, 1)
    this.saveAllProjects(projects)
    
    // Track activity
    ActivityService.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'project',
      title: `Deleted project: ${deletedProject.title}`,
      intensity: 2
    })
  }
  
  // Get featured projects (max 2)
  static getFeaturedProjects(): Project[] {
    return this.getAllProjects().filter(p => p.featured).slice(0, 2)
  }
  
  // Set featured status
  static setFeaturedStatus(index: number, featured: boolean): void {
    const projects = this.getAllProjects()
    
    if (index < 0 || index >= projects.length) {
      throw new Error('Project index out of range')
    }
    
    // If setting to featured, check if we already have 2 featured projects
    if (featured) {
      const currentFeatured = projects.filter(p => p.featured)
      if (currentFeatured.length >= 2) {
        throw new Error('Maximum of 2 projects can be featured. Please unfeature another project first.')
      }
    }
    
    this.updateProject(index, { featured })
  }
  
  // Reset to static data (for development/testing)
  static resetToStaticData(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.STORAGE_KEY)
    ActivityService.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'update',
      title: 'Reset projects to static data',
      intensity: 1
    })
  }
  
  // Get projects statistics
  static getProjectStats() {
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