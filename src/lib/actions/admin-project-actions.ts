'use server'

import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Create a Supabase client with service role key for admin operations (bypasses RLS)
function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials not configured: missing URL or service role key')
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })
}

interface AdminProjectData {
  id?: string
  title: string
  description: string
  category: string
  tech_stack?: string[]
  status: string
  featured?: boolean
  github_url?: string
  demo_url?: string
  dune_url?: string
  blog_post_slug?: string
  file_url?: string
  image?: string
  metrics?: Record<string, string>
  features?: string[]
  challenges?: string
  learnings?: string
}

export async function saveProjectAsAdmin(projectData: AdminProjectData) {
  try {
    // Check if service role key is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logger.error('Service role key not configured')
      throw new Error('Service role key not configured')
    }

    const supabaseAdmin = getSupabaseAdminClient()

    logger.info('Using service role key for admin project save', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })

    if (!projectData.id) {
      // Insert new project
      logger.info('Inserting new project with service role', { title: projectData.title })
      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert([projectData])
        .select('id')

      if (error) {
        logger.error('Error creating project as admin', error, { projectData })
        throw new Error(`Failed to create project: ${error.message}`)
      }

      const projectId = data?.[0]?.id
      if (!projectId) {
        throw new Error('Failed to get project ID')
      }

      logger.info('Project created by admin', { title: projectData.title, id: projectId })
      return { success: true, projectId }
    } else {
      // Update existing project
      logger.info('Updating existing project with service role', { id: projectData.id, title: projectData.title })
      const { error } = await supabaseAdmin
        .from('projects')
        .update(projectData)
        .eq('id', projectData.id)

      if (error) {
        logger.error('Error updating project as admin', error, { id: projectData.id, projectData })
        throw new Error(`Failed to update project: ${error.message}`)
      }

      logger.info('Project updated by admin', { title: projectData.title, id: projectData.id })
      return { success: true, projectId: projectData.id }
    }
  } catch (error) {
    logger.error('Admin project save error:', error)
    throw error
  }
}

export async function deleteProjectAsAdmin(projectId: string) {
  try {
    const supabaseAdmin = getSupabaseAdminClient()

    logger.info('Deleting project with service role', { projectId })
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      logger.error('Error deleting project as admin', error, { projectId })
      throw new Error(`Failed to delete project: ${error.message}`)
    }

    logger.info('Project deleted by admin', { projectId })
    return { success: true }
  } catch (error) {
    logger.error('Admin project delete error:', error)
    throw error
  }
}
