import { StorageProvider, UploadOptions } from './media-service-hybrid'

export interface RoutingDecision {
  provider: StorageProvider
  reason: string
  backup?: StorageProvider
  warnings?: string[]
}

export class SmartUploadRouter {
  // Configuration
  private readonly limits = {
    supabase: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      supportedTypes: ['image/*', 'video/*', 'application/pdf', 'text/*', 'application/*'],
      cost: 'low', // per GB stored + bandwidth
      features: ['thumbnails', 'cdn', 'access_control', 'analytics']
    },
    imgbb: {
      maxFileSize: 32 * 1024 * 1024, // 32MB  
      supportedTypes: ['image/*'],
      cost: 'free', // but with rate limits
      features: ['thumbnails', 'hotlinking', 'no_expiry']
    },
    youtube: {
      maxFileSize: 128 * 1024 * 1024 * 1024, // 128GB (theoretical)
      supportedTypes: ['video/*'],
      cost: 'free', // but with content policies
      features: ['streaming', 'seo', 'analytics', 'transcoding', 'global_cdn']
    },
    googledrive: {
      maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB per file
      supportedTypes: ['*/*'],
      cost: 'free_tier', // 15GB total free
      features: ['sharing', 'collaboration', 'version_history']
    }
  }

  // User preferences and environment config
  private readonly config = {
    preferFreeServices: process.env.NODE_ENV !== 'production',
    enableSupabaseStorage: process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE !== 'false',
    defaultImageProvider: (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_PROVIDER as StorageProvider) || 'supabase',
    defaultVideoProvider: (process.env.NEXT_PUBLIC_DEFAULT_VIDEO_PROVIDER as StorageProvider) || 'youtube',
    defaultDocumentProvider: (process.env.NEXT_PUBLIC_DEFAULT_DOCUMENT_PROVIDER as StorageProvider) || 'supabase',
    maxBandwidthBudget: parseInt(process.env.NEXT_PUBLIC_MAX_BANDWIDTH_MB || '1000') // MB per month
  }

  /**
   * Main routing logic - decides the best provider for a file
   */
  routeUpload(file: File, options: UploadOptions = {}): RoutingDecision {
    // Early return for explicit provider choice
    if (options.provider) {
      const validation = this.validateProviderChoice(file, options.provider)
      return {
        provider: options.provider,
        reason: 'Explicitly requested by user',
        warnings: validation.warnings
      }
    }

    // Route based on file type
    if (file.type.startsWith('image/')) {
      return this.routeImage(file, options)
    }
    
    if (file.type.startsWith('video/')) {
      return this.routeVideo(file, options)
    }
    
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return this.routeDocument(file, options)
    }

    // Default routing for other file types
    return this.routeGenericFile(file, options)
  }

  /**
   * Image routing logic
   */
  private routeImage(file: File, _options: UploadOptions): RoutingDecision {
    const warnings: string[] = []

    // Large images might exceed ImgBB limits
    if (file.size > this.limits.imgbb.maxFileSize) {
      warnings.push('File exceeds ImgBB 32MB limit')
      return {
        provider: 'supabase',
        reason: 'File size exceeds ImgBB limits',
        warnings
      }
    }

    // Use configured default, with intelligent fallback
    const preferredProvider = this.config.defaultImageProvider

    if (preferredProvider === 'imgbb' && this.config.preferFreeServices) {
      return {
        provider: 'imgbb',
        reason: 'Using free service for public images',
        backup: 'supabase',
        warnings: file.size > 10 * 1024 * 1024 ? ['Large file - consider Supabase for better performance'] : undefined
      }
    }

    return {
      provider: 'supabase',
      reason: 'Default provider for images with full feature set',
      backup: 'imgbb'
    }
  }

  /**
   * Video routing logic
   */
  private routeVideo(file: File, _options: UploadOptions): RoutingDecision {
    const warnings: string[] = []

    // For public videos, YouTube is often better for SEO and performance
    if (this.config.defaultVideoProvider === 'youtube') {
      warnings.push('YouTube upload requires manual process - consider direct Supabase upload for automation')
      return {
        provider: 'supabase', // Auto-upload to Supabase, user can manually add to YouTube later
        reason: 'Video uploaded to Supabase for immediate availability',
        backup: 'youtube',
        warnings
      }
    }

    // Very large videos
    if (file.size > this.limits.supabase.maxFileSize) {
      warnings.push('File exceeds Supabase limits - YouTube recommended for large videos')
      return {
        provider: 'supabase', // Will fail gracefully, user will get error
        reason: 'Large video - may need manual YouTube upload',
        warnings
      }
    }

    return {
      provider: 'supabase',
      reason: 'Direct video hosting with full control',
      backup: 'youtube'
    }
  }

  /**
   * Document routing logic
   */
  private routeDocument(file: File, options: UploadOptions): RoutingDecision {
    // PDFs and documents work better with direct hosting than Google Drive sharing
    if (file.type === 'application/pdf') {
      return {
        provider: 'supabase',
        reason: 'Better PDF viewing experience than Google Drive',
        backup: 'googledrive'
      }
    }

    // For collaborative documents, Google Drive might be better
    if ((options as any).metadata?.collaborative) {
      return {
        provider: 'googledrive',
        reason: 'Collaborative document - Google Drive provides better sharing',
        backup: 'supabase'
      }
    }

    return {
      provider: 'supabase',
      reason: 'Direct document hosting with access control',
      backup: 'googledrive'
    }
  }

  /**
   * Generic file routing
   */
  private routeGenericFile(file: File, _options: UploadOptions): RoutingDecision {
    const warnings: string[] = []

    // Check if file type is supported by providers
    if (!this.isFileTypeSupported(file.type, 'supabase')) {
      warnings.push('File type may not be fully supported')
    }

    return {
      provider: 'supabase',
      reason: 'Most flexible provider for generic files',
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  /**
   * Validate if a provider can handle a specific file
   */
  private validateProviderChoice(file: File, provider: StorageProvider): { 
    valid: boolean
    warnings?: string[]
  } {
    const warnings: string[] = []
    const limits = this.limits[provider]

    // Check file size
    if (file.size > limits.maxFileSize) {
      warnings.push(`File size (${this.formatFileSize(file.size)}) exceeds ${provider} limit (${this.formatFileSize(limits.maxFileSize)})`)
    }

    // Check file type support
    if (!this.isFileTypeSupported(file.type, provider)) {
      warnings.push(`File type ${file.type} may not be supported by ${provider}`)
    }

    // Provider-specific warnings
    if (provider === 'imgbb' && !file.type.startsWith('image/')) {
      warnings.push('ImgBB only supports image files')
    }

    if (provider === 'youtube' && !file.type.startsWith('video/')) {
      warnings.push('YouTube only supports video files')
    }

    return {
      valid: warnings.length === 0,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  /**
   * Check if file type is supported by provider
   */
  private isFileTypeSupported(mimeType: string, provider: StorageProvider): boolean {
    const supportedTypes = this.limits[provider].supportedTypes
    
    return supportedTypes.some(pattern => {
      if (pattern === '*/*') return true
      if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -2)
        return mimeType.startsWith(prefix)
      }
      return pattern === mimeType
    })
  }

  /**
   * Get recommendations for optimizing upload strategy
   */
  getUploadRecommendations(files: File[]): {
    summary: string
    recommendations: Array<{
      file: string
      provider: StorageProvider
      reason: string
    }>
    warnings: string[]
  } {
    const recommendations = files.map(file => {
      const decision = this.routeUpload(file)
      return {
        file: file.name,
        provider: decision.provider,
        reason: decision.reason
      }
    })

    const providerCounts = recommendations.reduce((acc, rec) => {
      acc[rec.provider] = (acc[rec.provider] || 0) + 1
      return acc
    }, {} as Record<StorageProvider, number>)

    const warnings: string[] = []
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > 100 * 1024 * 1024) { // 100MB
      warnings.push('Large batch upload - consider uploading in smaller batches')
    }

    if (providerCounts.imgbb && providerCounts.imgbb > 10) {
      warnings.push('Many ImgBB uploads - be aware of rate limits')
    }

    const summary = `Routing ${files.length} files: ${Object.entries(providerCounts)
      .map(([provider, count]) => `${count} to ${provider}`)
      .join(', ')}`

    return {
      summary,
      recommendations,
      warnings
    }
  }

  /**
   * Utility: Format file size for human reading
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  /**
   * Get cost estimation for upload strategy
   */
  estimateCosts(files: File[]): {
    totalSize: string
    costBreakdown: Record<StorageProvider, { files: number, size: string, estimatedCost: string }>
    recommendations: string[]
  } {
    const breakdown: Record<StorageProvider, { files: number, size: number }> = {
      supabase: { files: 0, size: 0 },
      imgbb: { files: 0, size: 0 },
      youtube: { files: 0, size: 0 },
      googledrive: { files: 0, size: 0 }
    }

    files.forEach(file => {
      const decision = this.routeUpload(file)
      breakdown[decision.provider].files++
      breakdown[decision.provider].size += file.size
    })

    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    const costBreakdown = Object.entries(breakdown).reduce((acc, [provider, data]) => {
      if (data.files > 0) {
        acc[provider as StorageProvider] = {
          files: data.files,
          size: this.formatFileSize(data.size),
          estimatedCost: this.estimateProviderCost(provider as StorageProvider, data.size)
        }
      }
      return acc
    }, {} as Record<StorageProvider, { files: number, size: string, estimatedCost: string }>)

    const recommendations: string[] = []
    
    if (breakdown.supabase.size > 1024 * 1024 * 1024) { // 1GB
      recommendations.push('Consider optimizing images before upload to reduce storage costs')
    }
    
    if (breakdown.imgbb.files > breakdown.supabase.files) {
      recommendations.push('Many files going to ImgBB - consider Supabase for better control')
    }

    return {
      totalSize: this.formatFileSize(totalSize),
      costBreakdown,
      recommendations
    }
  }

  private estimateProviderCost(provider: StorageProvider, bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024)
    
    switch (provider) {
      case 'supabase':
        // Approximate Supabase pricing: $0.021/GB/month storage + $0.09/GB egress
        return gb < 0.001 ? 'Free tier' : `~$${(gb * 0.021).toFixed(3)}/month`
      case 'imgbb':
        return 'Free (with limits)'
      case 'youtube':
        return 'Free (with policies)'
      case 'googledrive':
        return gb < 15 ? 'Free tier' : `~$${Math.ceil(gb / 100) * 1.99}/month`
      default:
        return 'Unknown'
    }
  }
}

export const smartUploadRouter = new SmartUploadRouter()