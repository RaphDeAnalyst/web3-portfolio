'use client'

import { useState, useEffect } from 'react'
import { mediaServiceHybrid, MediaFile, StorageProvider, UploadOptions } from '@/lib/media-service-hybrid'
import { smartUploadRouter, RoutingDecision } from '@/lib/smart-upload-router'
import { MediaMigration, quickMigration } from '@/lib/media-migration'
import { ActivityService } from '@/lib/activity-service'

interface UploadState {
  uploading: boolean
  progress: Record<string, number>
  decisions: Record<string, RoutingDecision>
}

export default function EnhancedMediaUpload() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: {},
    decisions: {}
  })
  
  // Upload options
  const [uploadOptions, setUploadOptions] = useState<UploadOptions>({
    isPublic: true,
    optimize: false,
    generateThumbnail: false
  })
  
  // Selected provider override
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider | 'auto'>('auto')
  
  // UI state
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'migration' | 'analytics'>('upload')
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
    } catch (error) {
      console.error('Error loading media files:', error)
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
    console.log('Upload recommendations:', recommendations)

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

        console.log(`📤 Starting upload for ${file.name}`, fileUploadOptions)
        const uploadedFile = await mediaServiceHybrid.uploadFile(file, fileUploadOptions)
        console.log(`📥 Upload result for ${file.name}:`, uploadedFile)
        
        if (uploadedFile) {
          setUploadState(prev => ({
            ...prev,
            progress: { ...prev.progress, [fileKey]: 100 }
          }))
          
          // Track activity (non-blocking)
          try {
            ActivityService.trackMedia(file.name)
          } catch (error) {
            console.warn('Activity tracking failed, but upload succeeded:', error)
          }
          
          // Refresh media list
          await loadMediaFiles()
          
          console.log(`✅ Uploaded: ${file.name} to ${uploadedFile.storage_provider}`)
        } else {
          console.error(`❌ Failed to upload: ${file.name}`)
          setUploadState(prev => ({
            ...prev,
            progress: { ...prev.progress, [fileKey]: -1 } // -1 indicates error
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
        setUploadState(prev => ({
          ...prev,
          progress: { ...prev.progress, [fileKey]: -1 } // -1 indicates error
        }))
        
        // Show error message to user
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if (errorMessage.includes('timeout')) {
          console.error(`❌ Upload timeout: ${file.name} - Try a smaller file or check your connection`)
        } else if (errorMessage.includes('size')) {
          console.error(`❌ File too large: ${file.name} - ${errorMessage}`)
        } else {
          console.error(`❌ Upload error: ${file.name} - ${errorMessage}`)
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
        console.log(`✅ Added external media: ${result.filename}`)
        return true
      } else {
        console.error('❌ Failed to add external media')
        alert('Failed to add media. Please check the URL and try again.')
        return false
      }
    } catch (error) {
      console.error('Error adding external media:', error)
      alert(error instanceof Error ? error.message : 'Failed to add media. Please try again.')
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
    } catch (error) {
      console.error('Migration error:', error)
      setMigrationStatus({ inProgress: false, results: { error: error.toString() } })
    }
  }

  const getProviderIcon = (provider: StorageProvider) => {
    const icons = {
      supabase: '🗄️',
      imgbb: '🖼️', 
      youtube: '📺',
      googledrive: '📄'
    }
    return icons[provider] || '📁'
  }

  const getProviderColor = (provider: StorageProvider) => {
    const colors = {
      supabase: 'text-green-600',
      imgbb: 'text-blue-600',
      youtube: 'text-red-600', 
      googledrive: 'text-yellow-600'
    }
    return colors[provider] || 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enhanced Media Manager</h1>
          <p className="text-foreground/70 mt-1">Hybrid storage with smart routing and migration tools</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {showAdvanced ? '📖 Simple' : '🔧 Advanced'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-8">
          {[
            { id: 'upload', label: 'Upload', icon: '📤' },
            { id: 'library', label: 'Library', icon: '📚' },
            { id: 'migration', label: 'Migration', icon: '🔄' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-cyber-500 text-cyber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Options */}
          {showAdvanced && (
            <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">Upload Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Storage Provider</label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-foreground"
                  >
                    <option value="auto">🤖 Auto (ImgBB for Images)</option>
                    <option value="imgbb">🖼️ ImgBB (Images Only)</option>
                  </select>
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="block text-sm font-medium mb-2">Visibility</label>
                  <select
                    value={uploadOptions.isPublic ? 'public' : 'private'}
                    onChange={(e) => setUploadOptions(prev => ({ 
                      ...prev, 
                      isPublic: e.target.value === 'public' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-foreground"
                  >
                    <option value="public">🌍 Public</option>
                    <option value="private">🔒 Private</option>
                  </select>
                </div>

                {/* Optimization */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadOptions.optimize}
                      onChange={(e) => setUploadOptions(prev => ({ 
                        ...prev, 
                        optimize: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">🔧 Optimize Images</span>
                  </label>
                </div>

                {/* Thumbnails */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadOptions.generateThumbnail}
                      onChange={(e) => setUploadOptions(prev => ({ 
                        ...prev, 
                        generateThumbnail: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">🖼️ Generate Thumbnails</span>
                  </label>
                </div>
              </div>

              {/* Smart Routing Preview */}
              {showAdvanced && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 <strong>Smart Routing:</strong> {selectedProvider === 'auto' 
                      ? 'Images upload to ImgBB automatically. Use YouTube/Google Drive links for videos and documents.'
                      : `All images will be uploaded to ${selectedProvider}. Videos and documents still require external links.`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Upload Area */}
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Upload Files</h2>
            
            {/* File Drop Zone - Images Only */}
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleFileUpload(e.dataTransfer.files)
              }}
            >
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Drop images here or click to browse
              </h3>
              <p className="text-foreground/60 mb-2">
                <strong>Images only</strong> • JPG, PNG, GIF, WebP • Up to 32MB each
              </p>
              <p className="text-xs text-foreground/50 mb-6">
                Images upload to ImgBB • Use links below for videos and documents
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept="image/*"
                />
                <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
                  Choose Images
                </span>
              </label>
            </div>

            {/* Upload Progress & Decisions */}
            {uploadState.uploading && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Upload Progress</h4>
                {Object.entries(uploadState.progress).map(([fileKey, progress]) => (
                  <div key={fileKey} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{fileKey.split('-')[0]}</span>
                      <span className={`text-sm ${progress === -1 ? 'text-red-500' : 'text-gray-500'}`}>
                        {progress === -1 ? '❌ Error' : `${progress}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress === -1 ? 'bg-red-500' : 'bg-cyber-500'
                        }`}
                        style={{ width: `${progress === -1 ? 100 : progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Routing Decisions */}
            {Object.keys(uploadState.decisions).length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Smart Routing Decisions</h4>
                <div className="space-y-2">
                  {Object.entries(uploadState.decisions).map(([filename, decision]) => (
                    <div key={filename} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{filename}</span>
                        <div className="flex items-center space-x-2">
                          <span className={getProviderColor(decision.provider)}>
                            {getProviderIcon(decision.provider)} {decision.provider}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        💡 {decision.reason}
                      </p>
                      {decision.warnings && (
                        <div className="mt-2">
                          {decision.warnings.map((warning, idx) => (
                            <p key={idx} className="text-yellow-600 text-xs">
                              ⚠️ {warning}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Media Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* YouTube */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <h4 className="font-medium">📺 Add YouTube Video</h4>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Paste any YouTube URL (watch, shorts, embed)
                </p>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-foreground text-sm"
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value.trim()) {
                          const success = await handleExternalAdd(input.value.trim(), 'youtube')
                          if (success) {
                            input.value = ''
                          }
                        }
                      }
                    }}
                  />
                  <button
                    onClick={async (e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        const success = await handleExternalAdd(input.value.trim(), 'youtube')
                        if (success) {
                          input.value = ''
                        }
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Google Drive */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <h4 className="font-medium">📄 Add Google Drive Document</h4>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Paste shareable Google Drive link (PDFs, docs, etc.)
                </p>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/1ABC..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-foreground text-sm"
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value.trim()) {
                          const success = await handleExternalAdd(input.value.trim(), 'googledrive')
                          if (success) {
                            input.value = ''
                          }
                        }
                      }
                    }}
                  />
                  <button
                    onClick={async (e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        const success = await handleExternalAdd(input.value.trim(), 'googledrive')
                        if (success) {
                          input.value = ''
                        }
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Media Library ({mediaFiles.length} files)</h2>
          
          {mediaFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm truncate flex-1" title={file.filename}>
                      {file.filename}
                    </h4>
                    <div className="flex items-center space-x-1 ml-2">
                      <span className={`text-xs ${getProviderColor(file.storage_provider)}`}>
                        {getProviderIcon(file.storage_provider)}
                      </span>
                      {!file.is_public && <span className="text-xs">🔒</span>}
                      {file.usage_count > 0 && <span className="text-xs text-green-600">✓</span>}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Provider: {file.storage_provider}</div>
                    <div>Size: {file.size > 0 ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}</div>
                    <div>Used: {file.usage_count} times</div>
                    <div>Created: {new Date(file.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigator.clipboard.writeText(file.url)}
                      className="text-xs text-cyber-500 hover:text-cyber-600 transition-colors"
                    >
                      📋 Copy URL
                    </button>
                    <div className="flex space-x-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary-500 transition-colors"
                      >
                        👁️
                      </a>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this file?')) {
                            await mediaServiceHybrid.deleteMedia(file.id)
                            await loadMediaFiles()
                          }
                        }}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No media files yet</h3>
              <p className="text-foreground/60">Upload your first file to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Migration Tab */}
      {activeTab === 'migration' && (
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Migration Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleMigration('localStorage')}
              disabled={migrationStatus.inProgress}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-medium mb-1">Migrate from localStorage</h3>
              <p className="text-sm text-gray-600">Import existing media metadata</p>
            </button>

            <button
              onClick={() => handleMigration('cleanup')}
              disabled={migrationStatus.inProgress}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <div className="text-2xl mb-2">🧹</div>
              <h3 className="font-medium mb-1">Cleanup Duplicates</h3>
              <p className="text-sm text-gray-600">Remove broken and duplicate entries</p>
            </button>

            <button
              onClick={async () => {
                const report = await quickMigration.report()
                console.table(report)
                alert('Migration report logged to console')
              }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium mb-1">Generate Report</h3>
              <p className="text-sm text-gray-600">Analyze migration status</p>
            </button>
          </div>

          {migrationStatus.inProgress && (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p>Migration in progress...</p>
            </div>
          )}

          {migrationStatus.results && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-3">Migration Results</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(migrationStatus.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Media Analytics</h2>
          <p className="text-gray-600">Analytics dashboard coming soon...</p>
        </div>
      )}
    </div>
  )
}