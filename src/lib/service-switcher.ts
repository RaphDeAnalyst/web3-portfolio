// Service Switcher - Allows toggling between localStorage and Supabase services
// This enables gradual migration and rollback capabilities

import { blogService as legacyBlogService } from './blog-service'
import { projectService as legacyProjectService } from './project-service'
import { ProfileService as legacyProfileService } from './profile-service'

// Dynamic import cache for Supabase services to prevent multiple imports
let blogServiceSupabaseCache: any = null
let projectServiceSupabaseCache: any = null
let profileServiceSupabaseCache: any = null
let dashboardServiceSupabaseCache: any = null

// Lazy loading functions for Supabase services
async function getBlogServiceSupabase() {
  if (!blogServiceSupabaseCache) {
    const importedModule = await import('./blog-service-supabase')
    blogServiceSupabaseCache = importedModule.blogServiceSupabase
  }
  return blogServiceSupabaseCache
}

async function getProjectServiceSupabase() {
  if (!projectServiceSupabaseCache) {
    const importedModule = await import('./project-service-supabase')
    projectServiceSupabaseCache = importedModule.projectServiceSupabase
  }
  return projectServiceSupabaseCache
}

async function getProfileServiceSupabase() {
  if (!profileServiceSupabaseCache) {
    const importedModule = await import('./profile-service-supabase')
    profileServiceSupabaseCache = importedModule.profileServiceSupabase
  }
  return profileServiceSupabaseCache
}

async function getDashboardServiceSupabase() {
  if (!dashboardServiceSupabaseCache) {
    const importedModule = await import('./dashboard-service-supabase')
    dashboardServiceSupabaseCache = importedModule.dashboardServiceSupabase
  }
  return dashboardServiceSupabaseCache
}

// Configuration for which services to use
export const SERVICE_CONFIG = {
  USE_SUPABASE: process.env.NEXT_PUBLIC_USE_SUPABASE === 'true',
  BLOG_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_BLOG !== 'false',
  PROJECT_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_PROJECTS !== 'false',
  PROFILE_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_PROFILE !== 'false',
  DASHBOARD_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_DASHBOARDS !== 'false',
}

// Unified Blog Service Interface
export const blogService = {
  async getAllPosts() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getAllPosts()
    }
    return legacyBlogService.getAllPosts()
  },

  async getPublishedPosts() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getPublishedPosts()
    }
    return legacyBlogService.getPublishedPosts()
  },

  async getPostBySlug(slug: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getPostBySlug(slug)
    }
    return legacyBlogService.getPostBySlug(slug)
  },

  async getPostById(id: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getPostById(id)
    }
    return legacyBlogService.getPostById(id)
  },

  async savePost(postData: any, existingId?: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.savePost(postData, existingId)
    }
    return legacyBlogService.savePost(postData, existingId)
  },

  async updatePostFields(id: string, updates: any) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.updatePostFields(id, updates)
    }
    return legacyBlogService.updatePostFields(id, updates)
  },

  async deletePost(id: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.deletePost(id)
    }
    return legacyBlogService.deletePost(id)
  },

  async getStats() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getStats()
    }
    return legacyBlogService.getStats()
  },

  async generateSlug(title: string, existingId?: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.generateSlug(title, existingId)
    }
    return legacyBlogService.generateSlug(title, existingId)
  },

  async searchPosts(query: string, category?: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.searchPosts(query, category)
    }
    return legacyBlogService.searchPosts(query, category)
  },

  async getCategories() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getCategories()
    }
    return legacyBlogService.getCategories()
  },

  async getFeaturedPosts() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getBlogServiceSupabase()
      return await supabaseService.getFeaturedPosts()
    }
    return legacyBlogService.getFeaturedPosts()
  }
}

// Unified Project Service Interface
export const projectService = {
  async getAllProjects() {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      return await supabaseService.getAllProjects()
    }
    return legacyProjectService.getAllProjects()
  },

  async getProjectByIndex(index: number) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      return await supabaseService.getProjectByIndex(index)
    }
    return legacyProjectService.getProjectByIndex(index)
  },

  async updateProject(indexOrId: number | string, updatedProject: any) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      if (typeof indexOrId === 'string') {
        return await supabaseService.updateProject(indexOrId, updatedProject)
      } else {
        return await supabaseService.updateProjectByIndex(indexOrId, updatedProject)
      }
    }
    if (typeof indexOrId === 'number') {
      return legacyProjectService.updateProject(indexOrId, updatedProject)
    }
    throw new Error('Legacy service requires index, not ID')
  },

  async addProject(newProject: any) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      return await supabaseService.addProject(newProject)
    }
    return legacyProjectService.addProject(newProject)
  },

  async deleteProject(indexOrId: number | string) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      if (typeof indexOrId === 'string') {
        return await supabaseService.deleteProject(indexOrId)
      } else {
        return await supabaseService.deleteProjectByIndex(indexOrId)
      }
    }
    if (typeof indexOrId === 'number') {
      return legacyProjectService.deleteProject(indexOrId)
    }
    throw new Error('Legacy service requires index, not ID')
  },

  async getFeaturedProjects() {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      return await supabaseService.getFeaturedProjects()
    }
    return legacyProjectService.getFeaturedProjects()
  },

  async setFeaturedStatus(indexOrId: number | string, featured: boolean) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      if (typeof indexOrId === 'string') {
        return await supabaseService.setFeaturedStatus(indexOrId, featured)
      } else {
        return await supabaseService.setFeaturedStatusByIndex(indexOrId, featured)
      }
    }
    if (typeof indexOrId === 'number') {
      return legacyProjectService.setFeaturedStatus(indexOrId, featured)
    }
    throw new Error('Legacy service requires index, not ID')
  },

  async getProjectStats() {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProjectServiceSupabase()
      return await supabaseService.getProjectStats()
    }
    return legacyProjectService.getProjectStats()
  }
}

// Unified Profile Service Interface
export const profileService = {
  async getProfile() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.getProfile()
    }
    return legacyProfileService.getProfile()
  },

  async saveProfile(profileData: any) {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.saveProfile(profileData)
    }
    return legacyProfileService.saveProfile(profileData)
  },

  async updateProfileField(field: any, value: any) {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.updateProfileField(field, value)
    }
    return legacyProfileService.updateProfileField(field, value)
  },

  async getSocialLinks() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.getSocialLinks()
    }
    return legacyProfileService.getSocialLinks()
  },

  async getAuthorInfo() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.getAuthorInfo()
    }
    return legacyProfileService.getAuthorInfo()
  },

  async initializeProfile() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.initializeProfile()
    }
    return legacyProfileService.initializeProfile()
  },

  async exportProfile() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.exportProfile()
    }
    return legacyProfileService.exportProfile()
  },

  async importProfile(profileJson: string) {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getProfileServiceSupabase()
      return await supabaseService.importProfile(profileJson)
    }
    return legacyProfileService.importProfile(profileJson)
  }
}

// Unified Dashboard Service Interface
export const dashboardService = {
  async getAllDashboards() {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getAllDashboards()
    }
    return [] // No legacy dashboard service yet
  },

  async getActiveDashboards() {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getActiveDashboards()
    }
    return []
  },

  async getDashboardByKey(dashboardId: string) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getDashboardByKey(dashboardId)
    }
    return null
  },

  async getDashboardById(id: string) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getDashboardById(id)
    }
    return null
  },

  async createDashboard(dashboardData: any) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.createDashboard(dashboardData)
    }
    throw new Error('Dashboard service not available')
  },

  async updateDashboard(updateData: any) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.updateDashboard(updateData)
    }
    throw new Error('Dashboard service not available')
  },

  async deleteDashboard(id: string) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.deleteDashboard(id)
    }
    throw new Error('Dashboard service not available')
  },

  async getDashboardsByCategory(category: string) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getDashboardsByCategory(category)
    }
    return []
  },

  async getDashboardsWithEmbeds() {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getDashboardsWithEmbeds()
    }
    return []
  },

  async searchDashboards(query: string, category?: string) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.searchDashboards(query, category)
    }
    return []
  },

  validateEmbedUrl(url: string) {
    try {
      const parsed = new URL(url)
      const allowedDomains = ['dune.com', 'dune.xyz']
      return allowedDomains.includes(parsed.hostname) &&
             parsed.pathname.startsWith('/embeds/')
    } catch {
      return false
    }
  },

  async updateEmbedUrl(id: string, embedUrl: string) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.updateEmbedUrl(id, embedUrl)
    }
    throw new Error('Dashboard service not available')
  },

  async getStats() {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.getStats()
    }
    return { total: 0, active: 0, withEmbeds: 0, categories: {} }
  },

  async compactSortOrders(featured: boolean) {
    if (SERVICE_CONFIG.DASHBOARD_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      const supabaseService = await getDashboardServiceSupabase()
      return await supabaseService.compactSortOrders(featured)
    }
    throw new Error('Dashboard service not available')
  }
}

