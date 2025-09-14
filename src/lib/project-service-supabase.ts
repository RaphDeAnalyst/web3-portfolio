import { supabase, type Project as SupabaseProject } from './supabase'

// Legacy Project interface for compatibility
export interface Project {
  id?: string
  title: string
  description: string
  category: string
  techStack?: string[]
  tech_stack?: string[]
  tech?: string[]
  status: string
  featured?: boolean
  github?: string
  demo?: string
  image?: string
  github_url?: string
  demo_url?: string
  githubUrl?: string
  demoUrl?: string
  duneUrl?: string
  blogPostSlug?: string
  links?: {
    github?: string
    demo?: string
  }
}

export class ProjectServiceSupabase {
  // Transform Supabase Project to legacy Project interface
  private transformToLegacyProject(project: SupabaseProject): Project {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      tech: project.tech_stack,
      techStack: project.tech_stack,
      tech_stack: project.tech_stack,
      status: project.status,
      featured: project.featured,
      github: project.github_url,
      demo: project.demo_url,
      github_url: project.github_url,
      demo_url: project.demo_url,
      githubUrl: project.github_url,
      demoUrl: project.demo_url,
      duneUrl: project.dune_url,
      blogPostSlug: project.blog_post_slug,
      image: project.image,
      metrics: project.metrics || {},
      features: project.features || [],
      challenges: project.challenges || '',
      learnings: project.learnings || '',
      links: {
        github: project.github_url,
        demo: project.demo_url
      }
    }
  }

  // Transform legacy Project to Supabase format
  private transformToSupabaseProject(project: Omit<Project, 'id'>): Partial<SupabaseProject> {
    return {
      title: project.title,
      description: project.description,
      category: project.category,
      tech_stack: project.techStack || project.tech_stack || [],
      status: project.status,
      featured: project.featured || false,
      github_url: (project as any).githubUrl || project.github || project.github_url || project.links?.github,
      demo_url: (project as any).demoUrl || project.demo || project.demo_url || project.links?.demo,
      dune_url: project.duneUrl,
      blog_post_slug: project.blogPostSlug,
      image: project.image,
      metrics: project.metrics,
      features: project.features,
      challenges: project.challenges,
      learnings: project.learnings
    }
  }

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects from Supabase:', error)
        return []
      }

      return data.map(project => this.transformToLegacyProject(project))
    } catch (error) {
      console.error('Error in getAllProjects:', error)
      return []
    }
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching project by ID:', error)
        return null
      }

      return this.transformToLegacyProject(data)
    } catch (error) {
      console.error('Error in getProjectById:', error)
      return null
    }
  }

  // Get project by index (legacy compatibility)
  async getProjectByIndex(index: number): Promise<Project | null> {
    try {
      const projects = await this.getAllProjects()
      return projects[index] || null
    } catch (error) {
      console.error('Error in getProjectByIndex:', error)
      return null
    }
  }

  // Update a specific project
  async updateProject(id: string, updatedProject: Partial<Project>): Promise<void> {
    try {
      const updateData = this.transformToSupabaseProject(updatedProject as Omit<Project, 'id'>)

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating project:', error)
        // Handle specific database errors
        if (error.code === '42703') {
          throw new Error('Database schema error. Please ensure all required columns exist in the projects table.')
        }
        if (error.message.includes('connection') || error.message.includes('fetch')) {
          throw new Error('Connection error. Please check your internet connection and try again.')
        }
        throw new Error(`Failed to update project: ${error.message}`)
      }

      console.log(`Project updated: ${updatedProject.title || id}`)
      
      // Track activity (activity service not implemented yet)
      console.log(`Project activity: ${updatedProject.title || 'Unknown Project'} - updated`)
    } catch (error) {
      console.error('Error in updateProject:', error)
      throw error
    }
  }

  // Update project by index (legacy compatibility)
  async updateProjectByIndex(index: number, updatedProject: Partial<Project>): Promise<void> {
    try {
      const projects = await this.getAllProjects()
      
      if (index < 0 || index >= projects.length) {
        throw new Error('Project index out of range')
      }

      const projectId = projects[index].id
      if (!projectId) {
        throw new Error('Project ID not found')
      }

      await this.updateProject(projectId, updatedProject)
    } catch (error) {
      console.error('Error in updateProjectByIndex:', error)
      throw error
    }
  }

  // Add new project
  async addProject(newProject: Omit<Project, 'id'>): Promise<void> {
    try {
      const projectData = this.transformToSupabaseProject(newProject)

      const { error } = await supabase
        .from('projects')
        .insert([projectData])

      if (error) {
        console.error('Error adding project:', error)
        throw error
      }

      console.log(`Project added: ${newProject.title}`)
      
      // Track activity (activity service not implemented yet)
      console.log(`Project activity: ${newProject.title || 'Unknown Project'} - created`)
    } catch (error) {
      console.error('Error in addProject:', error)
      throw error
    }
  }

  // Delete project by ID
  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting project:', error)
        throw error
      }

      console.log(`Project deleted: ${id}`)
    } catch (error) {
      console.error('Error in deleteProject:', error)
      throw error
    }
  }

  // Delete project by index (legacy compatibility)
  async deleteProjectByIndex(index: number): Promise<void> {
    try {
      const projects = await this.getAllProjects()
      
      if (index < 0 || index >= projects.length) {
        throw new Error('Project index out of range')
      }

      const projectId = projects[index].id
      if (!projectId) {
        throw new Error('Project ID not found')
      }

      await this.deleteProject(projectId)
    } catch (error) {
      console.error('Error in deleteProjectByIndex:', error)
      throw error
    }
  }

  // Get featured projects (max 3)
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .limit(3)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching featured projects:', error)
        return []
      }

      return data.map(project => this.transformToLegacyProject(project))
    } catch (error) {
      console.error('Error in getFeaturedProjects:', error)
      return []
    }
  }

  // Set featured status
  async setFeaturedStatus(id: string, featured: boolean): Promise<void> {
    try {
      if (featured) {
        // Check if we already have 3 featured projects
        const currentFeatured = await this.getFeaturedProjects()
        if (currentFeatured.length >= 3) {
          throw new Error('Maximum of 3 projects can be featured. Please unfeature another project first.')
        }
      }

      await this.updateProject(id, { featured })
    } catch (error) {
      console.error('Error in setFeaturedStatus:', error)
      throw error
    }
  }

  // Set featured status by index (legacy compatibility)
  async setFeaturedStatusByIndex(index: number, featured: boolean): Promise<void> {
    try {
      const projects = await this.getAllProjects()
      
      if (index < 0 || index >= projects.length) {
        throw new Error('Project index out of range')
      }

      const projectId = projects[index].id
      if (!projectId) {
        throw new Error('Project ID not found')
      }

      await this.setFeaturedStatus(projectId, featured)
    } catch (error) {
      console.error('Error in setFeaturedStatusByIndex:', error)
      throw error
    }
  }

  // Get projects statistics
  async getProjectStats() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('status, category, featured')

      if (error) {
        console.error('Error fetching project stats:', error)
        return {
          total: 0,
          featured: 0,
          byStatus: {},
          byCategory: {}
        }
      }

      const byStatus = data.reduce((acc: Record<string, number>, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      }, {})

      const byCategory = data.reduce((acc: Record<string, number>, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1
        return acc
      }, {})

      return {
        total: data.length,
        featured: data.filter(p => p.featured).length,
        byStatus,
        byCategory
      }
    } catch (error) {
      console.error('Error in getProjectStats:', error)
      return {
        total: 0,
        featured: 0,
        byStatus: {},
        byCategory: {}
      }
    }
  }

  // Search projects
  async searchProjects(query: string, category?: string): Promise<Project[]> {
    try {
      let queryBuilder = supabase.from('projects').select('*')

      // Apply category filter
      if (category && category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category)
      }

      // Apply search filter
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching projects:', error)
        return []
      }

      return data.map(project => this.transformToLegacyProject(project))
    } catch (error) {
      console.error('Error in searchProjects:', error)
      return []
    }
  }

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('category')

      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }

      const categories = [...new Set(data.map(p => p.category))]
      return categories.sort()
    } catch (error) {
      console.error('Error in getCategories:', error)
      return []
    }
  }
}

export const projectServiceSupabase = new ProjectServiceSupabase()