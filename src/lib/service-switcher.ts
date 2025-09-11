// Service Switcher - Allows toggling between localStorage and Supabase services
// This enables gradual migration and rollback capabilities

import { blogService as legacyBlogService } from './blog-service'
import { blogServiceSupabase } from './blog-service-supabase'
import { ProjectService as legacyProjectService } from './project-service'
import { projectServiceSupabase } from './project-service-supabase'
import { ProfileService as legacyProfileService } from './profile-service'
import { profileServiceSupabase } from './profile-service-supabase'
import { ActivityService as legacyActivityService } from './activity-service'
import { activityServiceSupabase } from './activity-service-supabase'

// Configuration for which services to use
export const SERVICE_CONFIG = {
  USE_SUPABASE: process.env.NEXT_PUBLIC_USE_SUPABASE === 'true',
  BLOG_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_BLOG !== 'false',
  PROJECT_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_PROJECTS !== 'false',
  PROFILE_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_PROFILE !== 'false',
  ACTIVITY_SERVICE: process.env.NEXT_PUBLIC_USE_SUPABASE_ACTIVITY !== 'false',
}

// Unified Blog Service Interface
export const blogService = {
  async getAllPosts() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getAllPosts()
    }
    return legacyBlogService.getAllPosts()
  },

  async getPublishedPosts() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getPublishedPosts()
    }
    return legacyBlogService.getPublishedPosts()
  },

  async getPostBySlug(slug: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getPostBySlug(slug)
    }
    return legacyBlogService.getPostBySlug(slug)
  },

  async getPostById(id: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getPostById(id)
    }
    return legacyBlogService.getPostById(id)
  },

  async savePost(postData: any, existingId?: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.savePost(postData, existingId)
    }
    return legacyBlogService.savePost(postData, existingId)
  },

  async updatePostFields(id: string, updates: any) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.updatePostFields(id, updates)
    }
    return legacyBlogService.updatePostFields(id, updates)
  },

  async deletePost(id: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.deletePost(id)
    }
    return legacyBlogService.deletePost(id)
  },

  async getStats() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getStats()
    }
    return legacyBlogService.getStats()
  },

  async generateSlug(title: string, existingId?: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.generateSlug(title, existingId)
    }
    return legacyBlogService.generateSlug(title, existingId)
  },

  async searchPosts(query: string, category?: string) {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.searchPosts(query, category)
    }
    return legacyBlogService.searchPosts(query, category)
  },

  async getCategories() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getCategories()
    }
    return legacyBlogService.getCategories()
  },

  async getFeaturedPosts() {
    if (SERVICE_CONFIG.BLOG_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await blogServiceSupabase.getFeaturedPosts()
    }
    return legacyBlogService.getFeaturedPosts()
  }
}

// Unified Project Service Interface
export const projectService = {
  async getAllProjects() {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await projectServiceSupabase.getAllProjects()
    }
    return legacyProjectService.getAllProjects()
  },

  async getProjectByIndex(index: number) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await projectServiceSupabase.getProjectByIndex(index)
    }
    return legacyProjectService.getProjectByIndex(index)
  },

  async updateProject(indexOrId: number | string, updatedProject: any) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      if (typeof indexOrId === 'string') {
        return await projectServiceSupabase.updateProject(indexOrId, updatedProject)
      } else {
        return await projectServiceSupabase.updateProjectByIndex(indexOrId, updatedProject)
      }
    }
    if (typeof indexOrId === 'number') {
      return legacyProjectService.updateProject(indexOrId, updatedProject)
    }
    throw new Error('Legacy service requires index, not ID')
  },

  async addProject(newProject: any) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await projectServiceSupabase.addProject(newProject)
    }
    return legacyProjectService.addProject(newProject)
  },

  async deleteProject(indexOrId: number | string) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      if (typeof indexOrId === 'string') {
        return await projectServiceSupabase.deleteProject(indexOrId)
      } else {
        return await projectServiceSupabase.deleteProjectByIndex(indexOrId)
      }
    }
    if (typeof indexOrId === 'number') {
      return legacyProjectService.deleteProject(indexOrId)
    }
    throw new Error('Legacy service requires index, not ID')
  },

  async getFeaturedProjects() {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await projectServiceSupabase.getFeaturedProjects()
    }
    return legacyProjectService.getFeaturedProjects()
  },

  async setFeaturedStatus(indexOrId: number | string, featured: boolean) {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      if (typeof indexOrId === 'string') {
        return await projectServiceSupabase.setFeaturedStatus(indexOrId, featured)
      } else {
        return await projectServiceSupabase.setFeaturedStatusByIndex(indexOrId, featured)
      }
    }
    if (typeof indexOrId === 'number') {
      return legacyProjectService.setFeaturedStatus(indexOrId, featured)
    }
    throw new Error('Legacy service requires index, not ID')
  },

  async getProjectStats() {
    if (SERVICE_CONFIG.PROJECT_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await projectServiceSupabase.getProjectStats()
    }
    return legacyProjectService.getProjectStats()
  }
}

// Unified Profile Service Interface
export const profileService = {
  async getProfile() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.getProfile()
    }
    return legacyProfileService.getProfile()
  },

  async saveProfile(profileData: any) {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.saveProfile(profileData)
    }
    return legacyProfileService.saveProfile(profileData)
  },

  async updateProfileField(field: any, value: any) {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.updateProfileField(field, value)
    }
    return legacyProfileService.updateProfileField(field, value)
  },

  async getSocialLinks() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.getSocialLinks()
    }
    return legacyProfileService.getSocialLinks()
  },

  async getAuthorInfo() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.getAuthorInfo()
    }
    return legacyProfileService.getAuthorInfo()
  },

  async initializeProfile() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.initializeProfile()
    }
    return legacyProfileService.initializeProfile()
  },

  async exportProfile() {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.exportProfile()
    }
    return legacyProfileService.exportProfile()
  },

  async importProfile(profileJson: string) {
    if (SERVICE_CONFIG.PROFILE_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await profileServiceSupabase.importProfile(profileJson)
    }
    return legacyProfileService.importProfile(profileJson)
  }
}

// Unified Activity Service Interface
export const activityService = {
  async getActivity() {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.getActivity()
    }
    return legacyActivityService.getActivity()
  },

  async addActivity(activity: any) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.addActivity(activity)
    }
    return legacyActivityService.addActivity(activity)
  },

  async updateActivity(id: string, updates: any) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.updateActivity(id, updates)
    }
    return legacyActivityService.updateActivity(id, updates)
  },

  async deleteActivity(id: string) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.deleteActivity(id)
    }
    return legacyActivityService.deleteActivity(id)
  },

  async getActivityForDate(date: string) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.getActivityForDate(date)
    }
    return legacyActivityService.getActivityForDate(date)
  },

  async getActivityForDateRange(startDate: string, endDate: string) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.getActivityForDateRange(startDate, endDate)
    }
    return legacyActivityService.getActivityForDateRange(startDate, endDate)
  },

  async getCurrentStreak() {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.getCurrentStreak()
    }
    return legacyActivityService.getCurrentStreak()
  },

  async getActivityStats() {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.getActivityStats()
    }
    return legacyActivityService.getActivityStats()
  },

  async getYearData(year?: number) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.getYearData(year)
    }
    return legacyActivityService.getYearData(year)
  },

  async initializeSampleData() {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.initializeSampleData()
    }
    return legacyActivityService.initializeSampleData()
  },

  async trackBlogPost(title: string, isUpdate = false) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.trackBlogPost(title, isUpdate)
    }
    return legacyActivityService.trackBlogPost(title, isUpdate)
  },

  async trackProject(title: string, isUpdate = false) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.trackProject(title, isUpdate)
    }
    return legacyActivityService.trackProject(title, isUpdate)
  },

  async trackMedia(filename: string) {
    if (SERVICE_CONFIG.ACTIVITY_SERVICE && SERVICE_CONFIG.USE_SUPABASE) {
      return await activityServiceSupabase.trackMedia(filename)
    }
    return legacyActivityService.trackMedia(filename)
  }
}