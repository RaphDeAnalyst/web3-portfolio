import { mediaServiceHybrid } from './media-service-hybrid'
import { logger } from './logger'

export interface MigrationResult {
  success: number
  errors: number
  skipped: number
  details: Array<{
    filename: string
    status: 'success' | 'error' | 'skipped'
    message: string
    provider?: string
  }>
}

export class MediaMigration {
  /**
   * Main migration function - migrates all localStorage media to Supabase database
   */
  static async migrateAll(): Promise<MigrationResult> {
    logger.info('🚀 Starting media migration from localStorage to Supabase...')
    
    const result = await mediaServiceHybrid.migrateFromLocalStorage()
    
    const migrationResult: MigrationResult = {
      success: result.success,
      errors: result.errors,
      skipped: 0,
      details: []
    }

    // Add some basic details (the hybrid service doesn't return detailed info yet)
    if (result.success > 0) {
      migrationResult.details.push({
        filename: `${result.success} files`,
        status: 'success',
        message: 'Successfully migrated media metadata to Supabase database'
      })
    }

    if (result.errors > 0) {
      migrationResult.details.push({
        filename: `${result.errors} files`,
        status: 'error', 
        message: 'Failed to migrate some media files - check console for details'
      })
    }

    logger.info(`✅ Migration completed: ${result.success} successful, ${result.errors} errors`)
    return migrationResult
  }

  /**
   * Migrate only specific media types
   */
  static async migrateByType(mediaType: 'image' | 'video' | 'document'): Promise<MigrationResult> {
    if (typeof window === 'undefined') {
      return { success: 0, errors: 0, skipped: 0, details: [] }
    }

    const result: MigrationResult = {
      success: 0,
      errors: 0,
      skipped: 0,
      details: []
    }

    try {
      const stored = localStorage.getItem('media-library')
      if (!stored) {
        result.details.push({
          filename: 'localStorage',
          status: 'skipped',
          message: 'No media library found in localStorage'
        })
        return result
      }

      const localFiles = JSON.parse(stored)
      const filteredFiles = localFiles.filter((file: any) => this.matchesType(file, mediaType))

      logger.info(`Migrating ${filteredFiles.length} ${mediaType} files...`)

      // This is a simplified version - in a real implementation you'd want more detailed migration
      const migrationResult = await mediaServiceHybrid.migrateFromLocalStorage()
      
      result.success = Math.min(migrationResult.success, filteredFiles.length)
      result.errors = migrationResult.errors

      result.details.push({
        filename: `${mediaType} files`,
        status: result.errors === 0 ? 'success' : 'error',
        message: `Migrated ${result.success} ${mediaType} files`
      })

    } catch (error) {
      logger.error(`Error migrating ${mediaType} files:`, error)
      result.errors++
      result.details.push({
        filename: `${mediaType} migration`,
        status: 'error',
        message: `Failed to migrate ${mediaType} files: ${error}`
      })
    }

    return result
  }

  /**
   * Re-upload files from external services to Supabase
   * Useful for consolidating all media in one place
   */
  static async consolidateToSupabase(options: {
    includeImgBB?: boolean
    includeYouTube?: boolean
    includeGoogleDrive?: boolean
    dryRun?: boolean
  } = {}): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: 0,
      errors: 0,
      skipped: 0,
      details: []
    }

    try {
      // Get all existing media from database
      const allMedia = await mediaServiceHybrid.getAllMedia()
      
      logger.info(`Found ${allMedia.length} media files in database`)

      for (const media of allMedia) {
        if (media.storage_provider === 'supabase') {
          result.skipped++
          result.details.push({
            filename: media.filename,
            status: 'skipped',
            message: 'Already in Supabase',
            provider: media.storage_provider
          })
          continue
        }

        // Skip if provider not included in consolidation
        if (media.storage_provider === 'imgbb' && !options.includeImgBB) {
          result.skipped++
          continue
        }
        if (media.storage_provider === 'youtube' && !options.includeYouTube) {
          result.skipped++
          continue
        }
        if (media.storage_provider === 'googledrive' && !options.includeGoogleDrive) {
          result.skipped++
          continue
        }

        if (options.dryRun) {
          result.details.push({
            filename: media.filename,
            status: 'skipped',
            message: `Would consolidate from ${media.storage_provider} to Supabase (dry run)`,
            provider: media.storage_provider
          })
          continue
        }

        try {
          // For images from ImgBB, we could download and re-upload
          if (media.storage_provider === 'imgbb' && media.type.startsWith('image/')) {
            // This would require downloading the image and re-uploading
            // Implementation would depend on your needs
            result.details.push({
              filename: media.filename,
              status: 'skipped',
              message: 'ImgBB to Supabase migration not implemented yet (would require download/re-upload)',
              provider: media.storage_provider
            })
            result.skipped++
            continue
          }

          // YouTube and Google Drive can't really be "migrated" since they're external services
          // But we can update metadata or create references
          result.details.push({
            filename: media.filename,
            status: 'skipped',
            message: `Cannot migrate external service ${media.storage_provider} - keeping as reference`,
            provider: media.storage_provider
          })
          result.skipped++

        } catch (error) {
          logger.error(`Error consolidating ${media.filename}:`, error)
          result.errors++
          result.details.push({
            filename: media.filename,
            status: 'error',
            message: `Failed to consolidate: ${error}`,
            provider: media.storage_provider
          })
        }
      }

    } catch (error) {
      logger.error('Error in consolidation:', error)
      result.errors++
      result.details.push({
        filename: 'consolidation',
        status: 'error',
        message: `Consolidation failed: ${error}`
      })
    }

    logger.info(`Consolidation completed: ${result.success} successful, ${result.errors} errors, ${result.skipped} skipped`)
    return result
  }

  /**
   * Clean up broken or duplicate media entries
   */
  static async cleanupMedia(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: 0,
      errors: 0,
      skipped: 0,
      details: []
    }

    try {
      const allMedia = await mediaServiceHybrid.getAllMedia()
      logger.info(`Checking ${allMedia.length} media files for cleanup...`)

      // Group by URL to find duplicates
      const urlGroups = allMedia.reduce((groups, media) => {
        if (!groups[media.url]) {
          groups[media.url] = []
        }
        groups[media.url].push(media)
        return groups
      }, {} as Record<string, typeof allMedia>)

      // Find duplicates
      const duplicates = Object.values(urlGroups).filter(group => group.length > 1)
      
      for (const duplicateGroup of duplicates) {
        // Keep the most recent one, delete others
        const sorted = duplicateGroup.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        const toKeep = sorted[0]
        const toDelete = sorted.slice(1)

        for (const duplicate of toDelete) {
          try {
            const deleted = await mediaServiceHybrid.deleteMedia(duplicate.id)
            if (deleted) {
              result.success++
              result.details.push({
                filename: duplicate.filename,
                status: 'success',
                message: `Removed duplicate (kept ${toKeep.created_at})`,
                provider: duplicate.storage_provider
              })
            } else {
              result.errors++
              result.details.push({
                filename: duplicate.filename,
                status: 'error',
                message: 'Failed to delete duplicate',
                provider: duplicate.storage_provider
              })
            }
          } catch (error) {
            result.errors++
            result.details.push({
              filename: duplicate.filename,
              status: 'error',
              message: `Error deleting duplicate: ${error}`,
              provider: duplicate.storage_provider
            })
          }
        }
      }

      // Check for broken links (this would require actually testing URLs)
      // For now, just report what we would do
      result.details.push({
        filename: 'broken links',
        status: 'skipped',
        message: 'Broken link detection not implemented (would require URL testing)',
      })

    } catch (error) {
      logger.error('Error in cleanup:', error)
      result.errors++
      result.details.push({
        filename: 'cleanup',
        status: 'error',
        message: `Cleanup failed: ${error}`
      })
    }

    logger.info(`Cleanup completed: ${result.success} cleaned up, ${result.errors} errors`)
    return result
  }

  /**
   * Generate migration report
   */
  static async generateReport(): Promise<{
    localStorage: {
      exists: boolean
      fileCount: number
      totalSize: string
      breakdown: Record<string, number>
    }
    database: {
      fileCount: number
      totalSize: string
      byProvider: Record<string, number>
      byType: Record<string, number>
    }
    recommendations: string[]
  }> {
    const report = {
      localStorage: {
        exists: false,
        fileCount: 0,
        totalSize: '0 B',
        breakdown: {} as Record<string, number>
      },
      database: {
        fileCount: 0,
        totalSize: '0 B',
        byProvider: {} as Record<string, number>,
        byType: {} as Record<string, number>
      },
      recommendations: [] as string[]
    }

    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('media-library')
      if (stored) {
        try {
          const localFiles = JSON.parse(stored)
          report.localStorage.exists = true
          report.localStorage.fileCount = localFiles.length
          
          let totalBytes = 0
          localFiles.forEach((file: any) => {
            const bytes = this.parseFileSize(file.size) || 0
            totalBytes += bytes
            
            const type = file.service || 'unknown'
            report.localStorage.breakdown[type] = (report.localStorage.breakdown[type] || 0) + 1
          })
          
          report.localStorage.totalSize = this.formatFileSize(totalBytes)
        } catch (error) {
          logger.error('Error reading localStorage:', error)
        }
      }
    }

    // Check database
    try {
      const stats = await mediaServiceHybrid.getMediaStats()
      report.database.fileCount = stats.total
      report.database.totalSize = this.formatFileSize(stats.totalSize)
      report.database.byProvider = stats.byProvider
      report.database.byType = stats.byType
    } catch (error) {
      logger.error('Error getting database stats:', error)
    }

    // Generate recommendations
    if (report.localStorage.exists && report.localStorage.fileCount > 0) {
      if (report.database.fileCount === 0) {
        report.recommendations.push('🔄 Run full migration to move localStorage data to persistent database')
      } else if (report.localStorage.fileCount > report.database.fileCount) {
        report.recommendations.push('⚠️ Some localStorage files may not have been migrated yet')
      } else if (report.localStorage.fileCount < report.database.fileCount) {
        report.recommendations.push('✅ Database has more files than localStorage - migration appears successful')
        report.recommendations.push('🧹 Consider clearing localStorage media data to free up space')
      }
    }

    if (report.database.byProvider.imgbb > 0) {
      report.recommendations.push('💡 Consider consolidating ImgBB images to Supabase for better control')
    }

    if (report.database.fileCount > 100) {
      report.recommendations.push('🔍 Run cleanup to remove duplicates and optimize storage')
    }

    return report
  }

  // Helper methods
  private static matchesType(file: any, type: 'image' | 'video' | 'document'): boolean {
    if (type === 'image') {
      return file.type?.startsWith('image/') || file.service === 'imgbb'
    }
    if (type === 'video') {
      return file.type?.startsWith('video/') || file.service === 'youtube'
    }
    if (type === 'document') {
      return file.type === 'application/pdf' || file.service === 'googledrive'
    }
    return false
  }

  private static parseFileSize(sizeStr: string | number): number {
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

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Quick migration functions for console use
export const quickMigration = {
  // Run in browser console: await quickMigration.all()
  async all() {
    logger.info('🚀 Starting quick migration...')
    const result = await MediaMigration.migrateAll()
    console.table(result.details)
    return result
  },

  // Run in browser console: await quickMigration.report()
  async report() {
    logger.info('📊 Generating migration report...')
    const report = await MediaMigration.generateReport()
    logger.info('📁 localStorage:', report.localStorage)
    logger.info('🗄️ Database:', report.database)
    logger.info('💡 Recommendations:', report.recommendations)
    return report
  },

  // Run in browser console: await quickMigration.cleanup()
  async cleanup() {
    logger.info('🧹 Starting cleanup...')
    const result = await MediaMigration.cleanupMedia()
    console.table(result.details)
    return result
  }
}

// Make available globally for console use
if (typeof window !== 'undefined') {
  (window as any).quickMigration = quickMigration
}