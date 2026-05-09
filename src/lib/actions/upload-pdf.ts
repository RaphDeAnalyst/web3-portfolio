'use server'

import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Create admin client for PDF uploads (bypasses RLS)
function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })
}

export async function uploadPdfReport(formData: FormData): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      }
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      return {
        success: false,
        error: 'Only PDF files are allowed'
      }
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size exceeds 50MB limit'
      }
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    logger.info('Starting PDF upload with admin client', { fileName, size: file.size })

    // Use admin client for upload (bypasses RLS)
    const supabaseAdmin = getSupabaseAdminClient()

    const { data, error } = await supabaseAdmin.storage
      .from('reports')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      })

    if (error) {
      logger.error('PDF upload failed', error)
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      }
    }

    logger.info('PDF uploaded to storage', { fileName })

    // Get public URL using admin client
    const { data: publicData } = supabaseAdmin.storage
      .from('reports')
      .getPublicUrl(fileName)

    if (!publicData?.publicUrl) {
      return {
        success: false,
        error: 'Failed to get public URL'
      }
    }

    logger.success('PDF uploaded successfully', { fileName, url: publicData.publicUrl })

    return {
      success: true,
      url: publicData.publicUrl
    }
  } catch (error) {
    logger.error('PDF upload error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during upload'
    }
  }
}
