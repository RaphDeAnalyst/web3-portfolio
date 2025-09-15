'use client'

import { useState } from 'react'
import { MediaFile, mediaServiceHybrid } from '@/lib/media-service-hybrid'
import { useNotification } from '@/lib/notification-context'
import { FolderOpen, Video, FileText, Trash2, AlertTriangle } from 'lucide-react'

interface MediaLibraryProps {
  mediaFiles: MediaFile[]
  onRefresh: () => void
}

export function MediaLibrary({ mediaFiles, onRefresh }: MediaLibraryProps) {
  const { copied, error, success, warning } = useNotification()
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterProvider, setFilterProvider] = useState<string>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredFiles = mediaFiles.filter(file => 
    filterProvider === 'all' || file.storage_provider === filterProvider
  )

  const providers = [...new Set(mediaFiles.map(f => f.storage_provider))]

  const handleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedFiles.size === 0) return
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (selectedFiles.size === 0) return

    setIsDeleting(true)
    setShowDeleteConfirm(false)

    try {
      const idsToDelete = Array.from(selectedFiles)
      const result = await mediaServiceHybrid.deleteMultipleMedia(idsToDelete)

      if (result.summary.successful > 0) {
        success(`Successfully deleted ${result.summary.successful} file${result.summary.successful !== 1 ? 's' : ''}`)
      }

      if (result.summary.failed > 0) {
        error(`Failed to delete ${result.summary.failed} file${result.summary.failed !== 1 ? 's' : ''}`)
      }

      // Clear selection and refresh
      setSelectedFiles(new Set())
      await onRefresh()

    } catch (err) {
      console.error('Error during bulk delete:', err)
      error('Failed to delete selected files. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      copied('Media URL')
    } catch (err) {
      console.error('Failed to copy:', err)
      copied('Media URL') // Still show success message as fallback
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-0">Media Library</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Provider Filter */}
          <select
            value={filterProvider}
            onChange={e => setFilterProvider(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground text-sm min-h-[44px]"
          >
            <option value="all">All Providers</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm min-h-[44px] flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-background text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm min-h-[44px] flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-background text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-secondary-500 text-white rounded-md text-sm font-medium hover:bg-secondary-600 transition-colors min-h-[44px]"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Selection Controls */}
      {filteredFiles.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-xs sm:text-sm text-foreground">
                Select All ({selectedFiles.size} selected)
              </span>
            </label>
          </div>
          
          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deleting...' : `Delete (${selectedFiles.size})`}
              </button>
              <div className="text-sm text-gray-600">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
              </div>
            </div>
          )}
        </div>
      )}

      {/* Media Files */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <FolderOpen size={64} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">No media files found</h3>
          <p className="text-gray-500">
            {filterProvider === 'all' 
              ? 'Upload some files to get started' 
              : `No files found for ${filterProvider}`
            }
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'
        }>
          {filteredFiles.map(file => (
            <div key={file.id} className={
              viewMode === 'grid'
                ? `group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    selectedFiles.has(file.id) ? 'ring-2 ring-primary-500' : ''
                  }`
                : `flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow ${
                    selectedFiles.has(file.id) ? 'ring-2 ring-primary-500' : ''
                  }`
            }>
              {/* Selection Checkbox */}
              <label className={
                viewMode === 'grid'
                  ? 'absolute top-2 left-2 z-10 cursor-pointer'
                  : 'mr-3 cursor-pointer'
              }>
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => handleSelectFile(file.id)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </label>

              {viewMode === 'grid' ? (
                // Grid View
                <>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {(() => {
                      const fileType = (file as any).file_type || (file as any).type || (file as any).fileType || ''
                      if (fileType.startsWith('image/')) {
                        return (
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )
                      } else {
                        return (
                          <div className="flex justify-center">
                            {fileType.startsWith('video/') ?
                              <Video size={32} className="text-gray-400" /> :
                              <FileText size={32} className="text-gray-400" />
                            }
                          </div>
                        )
                      }
                    })()}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-foreground text-sm truncate mb-1">
                      {file.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {formatFileSize((file as any).file_size || (file as any).size || 0)} • {formatDate((file as any).created_at || (file as any).createdAt || (file as any).uploadedAt)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded">
                        {file.storage_provider}
                      </span>
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // List View  
                <>
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-4">
                    {(() => {
                      const fileType = (file as any).file_type || (file as any).type || (file as any).fileType || ''
                      if (fileType.startsWith('image/')) {
                        return (
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        )
                      } else {
                        return (
                          <div className="flex justify-center">
                            {fileType.startsWith('video/') ?
                              <Video size={20} className="text-gray-400" /> :
                              <FileText size={20} className="text-gray-400" />
                            }
                          </div>
                        )
                      }
                    })()}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-foreground truncate mb-1">
                      {file.filename}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize((file as any).file_size || (file as any).size || 0)}</span>
                      <span>{formatDate((file as any).created_at || (file as any).createdAt || (file as any).uploadedAt)}</span>
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded text-xs">
                        {file.storage_provider}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Copy URL
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {filteredFiles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div>Total Files: <span className="font-medium text-foreground">{filteredFiles.length}</span></div>
            <div>Selected: <span className="font-medium text-foreground">{selectedFiles.size}</span></div>
            <div>
              Total Size: <span className="font-medium text-foreground">
                {formatFileSize(filteredFiles.reduce((acc, file) => acc + ((file as any).file_size || (file as any).size || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-foreground mb-3">
                Are you sure you want to delete {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''}?
              </p>

              {selectedFiles.size <= 5 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                  {Array.from(selectedFiles).slice(0, 5).map(id => {
                    const file = mediaFiles.find(f => f.id === id)
                    return file ? (
                      <div key={id} className="text-sm text-gray-600 truncate">
                        • {file.filename}
                      </div>
                    ) : null
                  })}
                </div>
              )}

              {selectedFiles.size > 5 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="text-sm text-gray-600">
                    {Array.from(selectedFiles).slice(0, 3).map(id => {
                      const file = mediaFiles.find(f => f.id === id)
                      return file ? (
                        <div key={id} className="truncate">• {file.filename}</div>
                      ) : null
                    })}
                    <div className="text-gray-500 mt-1">
                      ... and {selectedFiles.size - 3} more files
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-foreground rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete {selectedFiles.size} File{selectedFiles.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}