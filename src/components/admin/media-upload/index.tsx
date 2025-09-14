'use client'

import { useState, useEffect } from 'react'
import { mediaServiceHybrid, MediaFile, StorageProvider, UploadOptions } from '@/lib/media-service-hybrid'
import { smartUploadRouter, RoutingDecision } from '@/lib/smart-upload-router'
import { MediaMigration, quickMigration } from '@/lib/media-migration'
import { useNotification } from '@/lib/notification-context'
import {
  Upload,
  FolderOpen,
  RotateCcw,
  BarChart3
} from 'lucide-react'

import { UploadTab } from './UploadTab'
import { MediaLibrary } from './MediaLibrary'
import { MigrationTab } from './MigrationTab'
import { AnalyticsTab } from './AnalyticsTab'

interface UploadState {
  uploading: boolean
  progress: Record<string, number>
  decisions: Record<string, RoutingDecision>
}

type TabType = 'upload' | 'library' | 'migration' | 'analytics'

export default function EnhancedMediaUpload() {
  const { error, success, warning, info } = useNotification()
  // Core state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: {},
    decisions: {}
  })
  
  // Upload configuration
  const [uploadOptions, setUploadOptions] = useState<UploadOptions>({
    isPublic: true,
    optimize: false,
    generateThumbnail: false
  })
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider | 'auto'>('auto')
  
  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('upload')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Migration state
  const [migrationStatus, setMigrationStatus] = useState<{
    inProgress: boolean
    results?: any
  }>({ inProgress: false })

  // Load media files on component mount
  useEffect(() => {
    loadMediaFiles()
  }, [])

  const loadMediaFiles = async () => {
    try {
      const files = await mediaServiceHybrid.getAllMedia()
      setMediaFiles(files)
    } catch (err) {
      console.error('Error loading media files:', err)
      error('Failed to load media files. Please refresh and try again.')
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    setUploadState({
      uploading: true,
      progress: {},
      decisions: {}
    })

    // Get smart routing recommendations
    const recommendations = smartUploadRouter.getUploadRecommendations(fileArray)
    info(`Upload recommendations generated for ${fileArray.length} file(s)`)

    // Show routing decisions to user
    const decisions: Record<string, RoutingDecision> = {}
    fileArray.forEach(file => {
      const decision = smartUploadRouter.routeUpload(file, {
        ...uploadOptions,
        provider: selectedProvider === 'auto' ? undefined : selectedProvider
      })
      decisions[file.name] = decision
    })
    
    setUploadState(prev => ({ ...prev, decisions }))

    // Upload files
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const fileKey = `${file.name}-${Date.now()}`
      
      try {
        // Update progress
        setUploadState(prev => ({
          ...prev,
          progress: { ...prev.progress, [fileKey]: 0 }
        }))

        const fileUploadOptions: UploadOptions = {
          ...uploadOptions,
          provider: selectedProvider === 'auto' ? undefined : selectedProvider
        }

        // Simulate progress (in real implementation, you'd get this from upload)
        setUploadState(prev => ({
          ...prev,
          progress: { ...prev.progress, [fileKey]: 50 }
        }))

        info(`Starting upload for ${file.name}`)
        const uploadedFile = await mediaServiceHybrid.uploadFile(file, fileUploadOptions)
        info(`Upload completed for ${file.name}`)
        
        if (uploadedFile) {
          setUploadState(prev => ({
            ...prev,
            progress: { ...prev.progress, [fileKey]: 100 }
          }))
          
          // Refresh media list
          await loadMediaFiles()
          
          success(`Uploaded ${file.name} to ${uploadedFile.storage_provider}`)
        } else {
          error(`Failed to upload: ${file.name}`)
          setUploadState(prev => ({
            ...prev,
            progress: { ...prev.progress, [fileKey]: -1 }
          }))
        }

        // Clean up progress after delay
        setTimeout(() => {
          setUploadState(prev => {
            const { [fileKey]: removed, ...rest } = prev.progress
            return { ...prev, progress: rest }
          })
        }, 2000)

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        error(`Error uploading ${file.name}`)
        setUploadState(prev => ({
          ...prev,
          progress: { ...prev.progress, [fileKey]: -1 }
        }))
        
        // Show error message to user
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if (errorMessage.includes('timeout')) {
          console.error(`⚠ Upload timeout: ${file.name} - Try a smaller file or check your connection`)
          warning(`Upload timeout for ${file.name}. Try a smaller file or check your connection.`)
        } else if (errorMessage.includes('size')) {
          console.error(`⚠ File too large: ${file.name} - ${errorMessage}`)
          error(`File too large: ${file.name}`)
        } else {
          console.error(`⚠ Upload error: ${file.name} - ${errorMessage}`)
          error(`Upload error for ${file.name}`)
        }
      }
    }

    setUploadState(prev => ({ ...prev, uploading: false }))
  }

  const handleExternalAdd = async (url: string, provider: 'youtube' | 'googledrive'): Promise<boolean> => {
    try {
      const filename = provider === 'youtube' ? 'YouTube Video' : 'Google Drive Document'
      const result = await mediaServiceHybrid.addExternalMedia(url, provider, filename)
      
      if (result) {
        await loadMediaFiles()
        success(`Added external media: ${result.filename}`)
        return true
      } else {
        console.error('✗ Failed to add external media')
        error('Failed to add media. Please check the URL and try again.')
        return false
      }
    } catch (err) {
      console.error('Error adding external media:', err)
      error(err instanceof Error ? err.message : 'Failed to add media. Please try again.')
      return false
    }
  }

  const handleMigration = async (type: 'all' | 'localStorage' | 'cleanup') => {
    setMigrationStatus({ inProgress: true })
    
    try {
      let results
      switch (type) {
        case 'all':
          results = await MediaMigration.migrateAll()
          break
        case 'localStorage':
          results = await quickMigration.all()
          break
        case 'cleanup':
          results = await MediaMigration.cleanupMedia()
          break
      }
      
      setMigrationStatus({ inProgress: false, results })
      await loadMediaFiles() // Refresh after migration
    } catch (err) {
      console.error('Migration error:', err)
      error('Migration failed. Please try again.')
      setMigrationStatus({ inProgress: false })
    }
  }

  const tabs = [
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'library' as const, label: 'Library', icon: FolderOpen, count: mediaFiles.length },
    { id: 'migration' as const, label: 'Migration', icon: RotateCcw },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Media Management</h1>
        <p className="text-gray-600">
          Upload, organize, and analyze your media files across multiple storage providers
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <IconComponent size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && (
        <UploadTab
          uploadState={uploadState}
          uploadOptions={uploadOptions}
          selectedProvider={selectedProvider}
          showAdvanced={showAdvanced}
          onFileUpload={handleFileUpload}
          onExternalAdd={handleExternalAdd}
          onOptionsChange={setUploadOptions}
          onProviderChange={setSelectedProvider}
          onAdvancedToggle={setShowAdvanced}
        />
      )}

      {activeTab === 'library' && (
        <MediaLibrary
          mediaFiles={mediaFiles}
          onRefresh={loadMediaFiles}
        />
      )}

      {activeTab === 'migration' && (
        <MigrationTab
          migrationStatus={migrationStatus}
          onMigration={handleMigration}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab
          mediaFiles={mediaFiles}
        />
      )}
    </div>
  )
}