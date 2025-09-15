import { supabase, type Media as SupabaseMedia } from './supabase'

export interface MediaFile {
  id: string
  filename: string
  url: string
  type: string
  size: number
  alt_text?: string
  created_at: string
}

export class MediaServiceSupabase {
  // Transform Supabase Media to MediaFile interface
  private static transformToMediaFile(media: SupabaseMedia): MediaFile {
    return {
      id: media.id,
      filename: media.filename,
      url: media.url,
      type: media.type,
      size: media.size,
      alt_text: media.alt_text,
      created_at: media.created_at
    }
  }

  // Get all media files
  static async getAllMedia(): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching media from Supabase:', error)
        return []
      }

      return data.map((media: SupabaseMedia) => this.transformToMediaFile(media))
    } catch (error) {
      console.error('Error in getAllMedia:', error)
      return []
    }
  }

  // Get media by ID
  static async getMediaById(id: string): Promise<MediaFile | null> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching media by ID:', error)
        return null
      }

      return this.transformToMediaFile(data)
    } catch (error) {
      console.error('Error in getMediaById:', error)
      return null
    }
  }

  // Add media file record (file should be uploaded to storage separately)
  static async addMedia(mediaData: {
    filename: string
    url: string
    type: string
    size: number
    alt_text?: string
  }): Promise<MediaFile | null> {
    try {
      const { data, error } = await supabase
        .from('media')
        .insert([mediaData])
        .select()
        .single()

      if (error) {
        console.error('Error adding media:', error)
        return null
      }

      return this.transformToMediaFile(data)
    } catch (error) {
      console.error('Error in addMedia:', error)
      return null
    }
  }

  // Update media file record
  static async updateMedia(id: string, updates: Partial<{
    filename: string
    alt_text: string
  }>): Promise<MediaFile | null> {
    try {
      const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating media:', error)
        return null
      }

      return this.transformToMediaFile(data)
    } catch (error) {
      console.error('Error in updateMedia:', error)
      return null
    }
  }

  // Delete media file record
  static async deleteMedia(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting media:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteMedia:', error)
      return false
    }
  }

  // Get media by type
  static async getMediaByType(type: string): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching media by type:', error)
        return []
      }

      return data.map((media: SupabaseMedia) => this.transformToMediaFile(media))
    } catch (error) {
      console.error('Error in getMediaByType:', error)
      return []
    }
  }

  // Search media files
  static async searchMedia(query: string): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .or(`filename.ilike.%${query}%,alt_text.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching media:', error)
        return []
      }

      return data.map((media: SupabaseMedia) => this.transformToMediaFile(media))
    } catch (error) {
      console.error('Error in searchMedia:', error)
      return []
    }
  }

  // Get media statistics
  static async getMediaStats() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('type, size')

      if (error) {
        console.error('Error fetching media stats:', error)
        return {
          total: 0,
          totalSize: 0,
          byType: {}
        }
      }

      const byType = data.reduce((acc: Record<string, number>, media: any) => {
        acc[media.type] = (acc[media.type] || 0) + 1
        return acc
      }, {})

      const totalSize = data.reduce((sum: number, media: any) => sum + media.size, 0)

      return {
        total: data.length,
        totalSize,
        byType
      }
    } catch (error) {
      console.error('Error in getMediaStats:', error)
      return {
        total: 0,
        totalSize: 0,
        byType: {}
      }
    }
  }

  // Upload file to Supabase Storage (simplified version)
  static async uploadFile(file: File, bucket = 'media'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading file:', error)
        return null
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      // Add to media table
      await this.addMedia({
        filename: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size
      })

      return publicUrl
    } catch (error) {
      console.error('Error in uploadFile:', error)
      return null
    }
  }
}

export const mediaServiceSupabase = new MediaServiceSupabase()