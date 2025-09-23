import { supabase, type Media } from './supabase'
import { logger } from './logger'

// Enhanced MediaFile interface for hybrid system
export interface MediaFile {
  id: string
  filename: string
  url: string
  type: string
  size: number
  alt_text?: string
  storage_provider: 'supabase' | 'imgbb' | 'youtube' | 'googledrive'
  bucket_name?: string
  file_path?: string
  thumbnail_url?: string
  video_id?: string
  drive_file_id?: string
  is_public: boolean
  usage_count: number
  last_accessed_at?: string
  metadata?: Record<string, any>
  created_at: string
  
  // Legacy compatibility fields
  service?: string
  used?: boolean
  uploadDate?: string
}

export type StorageProvider = 'supabase' | 'imgbb' | 'youtube' | 'googledrive'

export interface UploadOptions {
  provider?: StorageProvider
  alt_text?: string
}

export class MediaServiceHybrid {
  private readonly IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || ''

  // Configuration for smart routing
  private readonly config = {
    defaultImageProvider: (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_PROVIDER as StorageProvider) || 'imgbb',
    maxFileSizeSupabase: 50 * 1024 * 1024, // 50MB for Supabase
    maxFileSizeImgBB: 32 * 1024 * 1024,    // 32MB for ImgBB
    preferSupabaseForPrivate: false,       // Use ImgBB even for private images
    preferYouTubeForPublicVideo: true
  }

  // Transform database record to MediaFile interface
  private transformToMediaFile(record: any): MediaFile {
    return {
      id: record.id,
      filename: record.filename,
      url: record.url,
      type: record.type,
      size: record.size || 0,
      alt_text: record.alt_text,
      storage_provider: record.storage_provider,
      bucket_name: record.bucket_name,
      file_path: record.file_path,
      thumbnail_url: record.thumbnail_url,
      video_id: record.video_id,
      drive_file_id: record.drive_file_id,
      is_public: record.is_public,
      usage_count: record.usage_count || 0,
      last_accessed_at: record.last_accessed_at,
      metadata: record.metadata || {},
      created_at: record.created_at,
      
      // Legacy compatibility
      service: record.storage_provider,
      used: record.usage_count > 0,
      uploadDate: record.created_at?.split('T')[0]
    }
  }

  // Smart provider selection based on file characteristics
  private selectBestProvider(file: File, options: UploadOptions = {}): StorageProvider {
    // Override if explicitly specified
    if (options.provider) {
      return options.provider
    }

    // For images - always use ImgBB unless too large
    if (file.type.startsWith('image/')) {
      // Large images exceed ImgBB limits, throw error instead of falling back
      if (file.size > this.config.maxFileSizeImgBB) {
        throw new Error(`Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds ImgBB limit of ${this.config.maxFileSizeImgBB / 1024 / 1024}MB`)
      }
      
      // Use ImgBB for all images
      return 'imgbb'
    }
    
    // For documents (PDFs, etc.) - user should provide Google Drive links
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('PDF upload not supported. Please upload your PDF to Google Drive and use the "Add Google Drive Document" feature instead.')
    }
    
    // For videos - user should provide YouTube links
    if (file.type.startsWith('video/')) {
      throw new Error('Video upload not supported. Please upload your video to YouTube and use the "Add YouTube Video" feature instead.')
    }
    
    // Only images are supported for direct upload
    throw new Error('Only image files are supported for direct upload. For videos use YouTube links, for documents use Google Drive links.')
  }

  // Upload file with smart routing
  async uploadFile(file: File, options: UploadOptions = {}): Promise<MediaFile | null> {
    const provider = this.selectBestProvider(file, options)
    
    try {
      let uploadResult: {
        url: string
        thumbnail_url?: string
        file_path?: string
        bucket_name?: string
        metadata?: Record<string, any>
      }

      switch (provider) {
        case 'imgbb':
          uploadResult = await this.uploadToImgBB(file)
          break
        default:
          throw new Error(`Upload not supported for provider: ${provider}`)
      }

      // Save metadata to database (using simple schema for compatibility)
      const mediaRecord = {
        filename: file.name,
        url: uploadResult.url,
        type: file.type,
        size: file.size,
        alt_text: options.alt_text || null
      }

      logger.info('💾 Saving media record to database:', mediaRecord)

      const { data, error } = await supabase
        .from('media')
        .insert([mediaRecord])
        .select()
        .single()

      if (error) {
        logger.error('❌ Error saving media metadata:', error)
        logger.error('Full error details:', JSON.stringify(error))
        return null
      }

      logger.info('✅ Media record saved successfully:', data)
      return this.transformToMediaFile(data)
    } catch (error) {
      logger.error(`Error uploading to ${provider}:`, error)
      return null
    }
  }


  // Upload to ImgBB (primary image storage)
  private async uploadToImgBB(file: File): Promise<{
    url: string
    thumbnail_url?: string
    metadata?: Record<string, any>
  }> {
    if (!this.IMGBB_API_KEY) {
      throw new Error('ImgBB API key not configured')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('ImgBB only supports image files')
    }

    if (file.size > this.config.maxFileSizeImgBB) {
      throw new Error(`File size exceeds ImgBB limit of ${this.config.maxFileSizeImgBB / 1024 / 1024}MB`)
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('key', this.IMGBB_API_KEY)

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('ImgBB API Error:', response.status)
      throw new Error(`ImgBB upload failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    if (!data.success) {
      logger.error('ImgBB Response Error:', data)
      throw new Error(data.error?.message || 'ImgBB upload failed')
    }

    return {
      url: data.data.url,
      thumbnail_url: data.data.thumb?.url,
      metadata: {
        imgbb_id: data.data.id,
        imgbb_delete_url: data.data.delete_url
      }
    }
  }

  // Add external URL (YouTube, Google Drive, etc.)
  async addExternalMedia(
    url: string, 
    provider: 'youtube' | 'googledrive', 
    filename?: string
  ): Promise<MediaFile | null> {
    try {
      // Validate URLs first
      if (provider === 'youtube') {
        const videoId = this.extractYouTubeVideoId(url)
        if (!videoId) {
          throw new Error('Invalid YouTube URL. Please use a valid YouTube video URL.')
        }
        // Update URL to use embed format for consistency
        url = `https://www.youtube.com/watch?v=${videoId}`
      }

      if (provider === 'googledrive') {
        const fileId = this.extractGoogleDriveFileId(url)
        if (!fileId) {
          throw new Error('Invalid Google Drive URL. Please use a shareable Google Drive file URL.')
        }
        // Update URL to use direct view format
        url = `https://drive.google.com/file/d/${fileId}/view`
      }

      // Simple database record - only using columns that exist
      const mediaRecord = {
        filename: filename || this.extractFilenameFromUrl(url, provider),
        url,
        type: provider === 'youtube' ? 'video/youtube' : 'application/pdf',
        size: 0,
        alt_text: null
      }

      logger.info('💾 Saving external media to database:', mediaRecord)

      const { data, error } = await supabase
        .from('media')
        .insert([mediaRecord])
        .select()
        .single()

      if (error) {
        logger.error('❌ Error saving external media:', error)
        logger.error('Full error details:', JSON.stringify(error))
        return null
      }

      logger.info('✅ External media saved successfully:', data)
      return this.transformToMediaFile(data)
    } catch (error) {
      logger.error('Error adding external media:', error)
      return null
    }
  }

  // Get all media files
  async getAllMedia(): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Error fetching media:', error)
        return []
      }

      return data.map((record: Media) => this.transformToMediaFile(record))
    } catch (error) {
      logger.error('Error in getAllMedia:', error)
      return []
    }
  }

  // Get media by provider
  async getMediaByProvider(provider: StorageProvider): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('storage_provider', provider)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Error fetching media by provider:', error)
        return []
      }

      return data.map((record: Media) => this.transformToMediaFile(record))
    } catch (error) {
      logger.error('Error in getMediaByProvider:', error)
      return []
    }
  }

  // Increment usage count
  async trackUsage(id: string): Promise<void> {
    try {
      // First get current usage count
      const { data: currentData } = await supabase
        .from('media')
        .select('usage_count')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from('media')
        .update({
          usage_count: (currentData?.usage_count || 0) + 1,
          last_accessed_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        logger.error('Error tracking media usage:', error)
      }
    } catch (error) {
      logger.error('Error in trackUsage:', error)
    }
  }

  // Delete media file
  async deleteMedia(id: string): Promise<boolean> {
    try {
      // Get media record first
      const { data: media, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !media) {
        logger.error('Error fetching media for deletion:', fetchError)
        return false
      }

      // Delete from storage if it's in Supabase
      if (media.storage_provider === 'supabase' && media.bucket_name && media.file_path) {
        const { error: storageError } = await supabase.storage
          .from(media.bucket_name)
          .remove([media.file_path])

        if (storageError) {
          logger.error('Error deleting from storage:', storageError)
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete database record
      const { error: deleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

      if (deleteError) {
        logger.error('Error deleting media record:', deleteError)
        return false
      }

      return true
    } catch (error) {
      logger.error('Error in deleteMedia:', error)
      return false
    }
  }

  // Bulk delete multiple media files
  async deleteMultipleMedia(ids: string[]): Promise<{
    success: string[]
    failed: Array<{ id: string, error: string }>
    summary: { total: number, successful: number, failed: number }
  }> {
    const results = {
      success: [] as string[],
      failed: [] as Array<{ id: string, error: string }>,
      summary: { total: ids.length, successful: 0, failed: 0 }
    }

    for (const id of ids) {
      try {
        const deleted = await this.deleteMedia(id)
        if (deleted) {
          results.success.push(id)
          results.summary.successful++
        } else {
          results.failed.push({ id, error: 'Deletion failed' })
          results.summary.failed++
        }
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        results.summary.failed++
      }
    }

    logger.info(`Bulk deletion completed: ${results.summary.successful} successful, ${results.summary.failed} failed`)
    return results
  }

  // Get media statistics
  async getMediaStats() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('storage_provider, type, size, is_public, usage_count')

      if (error) {
        logger.error('Error fetching media stats:', error)
        return {
          total: 0,
          totalSize: 0,
          byProvider: {},
          byType: {},
          publicCount: 0,
          privateCount: 0,
          totalUsage: 0
        }
      }

      const byProvider = data.reduce((acc: Record<string, number>, media: any) => {
        acc[media.storage_provider] = (acc[media.storage_provider] || 0) + 1
        return acc
      }, {})

      const byType = data.reduce((acc: Record<string, number>, media: any) => {
        const mainType = media.type.split('/')[0]
        acc[mainType] = (acc[mainType] || 0) + 1
        return acc
      }, {})

      const totalSize = data.reduce((sum: number, media: any) => sum + (media.size || 0), 0)
      const totalUsage = data.reduce((sum: number, media: any) => sum + (media.usage_count || 0), 0)
      const publicCount = data.filter((media: any) => media.is_public).length
      const privateCount = data.filter((media: any) => !media.is_public).length

      return {
        total: data.length,
        totalSize,
        byProvider,
        byType,
        publicCount,
        privateCount,
        totalUsage
      }
    } catch (error) {
      logger.error('Error in getMediaStats:', error)
      return {
        total: 0,
        totalSize: 0,
        byProvider: {},
        byType: {},
        publicCount: 0,
        privateCount: 0,
        totalUsage: 0
      }
    }
  }

  // Utility functions
  private extractFilenameFromUrl(url: string, provider: StorageProvider): string {
    if (provider === 'youtube') {
      const videoId = this.extractYouTubeVideoId(url)
      return videoId ? `YouTube Video - ${videoId}` : 'YouTube Video'
    }
    
    if (provider === 'googledrive') {
      return 'Google Drive Document'
    }
    
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const filename = pathname.split('/').pop()
      return filename || 'Unknown File'
    } catch {
      return 'Unknown File'
    }
  }

  private extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  private extractGoogleDriveFileId(url: string): string | null {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//)
    return match ? match[1] : null
  }

  // Migration helper to import existing localStorage media
  async migrateFromLocalStorage(): Promise<{ success: number; errors: number }> {
    if (typeof window === 'undefined') {
      return { success: 0, errors: 0 }
    }

    let success = 0
    let errors = 0

    try {
      const stored = localStorage.getItem('media-library')
      if (!stored) {
        logger.info('No media library found in localStorage')
        return { success, errors }
      }

      const localFiles = JSON.parse(stored)
      logger.info(`Migrating ${localFiles.length} files from localStorage...`)

      for (const localFile of localFiles) {
        try {
          // Determine provider based on URL
          let provider: StorageProvider = 'imgbb' // default
          if (localFile.service === 'youtube' || localFile.url.includes('youtube.com') || localFile.url.includes('youtu.be')) {
            provider = 'youtube'
          } else if (localFile.service === 'googledrive' || localFile.url.includes('drive.google.com')) {
            provider = 'googledrive'
          } else if (localFile.url.includes('i.ibb.co') || localFile.url.includes('imgbb.com')) {
            provider = 'imgbb'
          }

          const mediaRecord = {
            filename: localFile.name || 'Unknown File',
            url: localFile.url,
            type: localFile.type || 'application/octet-stream',
            size: this.parseFileSize(localFile.size) || 0,
            storage_provider: provider,
            is_public: true,
            usage_count: localFile.used ? 1 : 0,
            video_id: localFile.videoId,
            drive_file_id: localFile.fileId,
            thumbnail_url: localFile.thumbnail,
            metadata: {
              migrated_from_localStorage: true,
              original_id: localFile.id
            }
          }

          const { error } = await supabase
            .from('media')
            .insert([mediaRecord])

          if (error) {
            logger.error(`Error migrating file "${localFile.name}":`, error)
            errors++
          } else {
            logger.info(`Migrated: ${localFile.name}`)
            success++
          }
        } catch (error) {
          logger.error(`Error processing file "${localFile.name}":`, error)
          errors++
        }
      }

      logger.info(`Migration completed: ${success} successful, ${errors} errors`)
      return { success, errors }
    } catch (error) {
      logger.error('Error in migration:', error)
      return { success, errors }
    }
  }

  private parseFileSize(sizeStr: string | number): number {
    if (typeof sizeStr === 'number') return sizeStr
    if (!sizeStr || sizeStr === 'N/A' || sizeStr === 'Unknown') return 0
    
    const match = sizeStr.toString().match(/^([\d.]+)\s*([KMGT]?B)?$/i)
    if (!match) return 0
    
    const value = parseFloat(match[1])
    const unit = match[2]?.toUpperCase()
    
    const multipliers: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024
    }
    
    return value * (multipliers[unit || 'B'] || 1)
  }
}

export const mediaServiceHybrid = new MediaServiceHybrid()