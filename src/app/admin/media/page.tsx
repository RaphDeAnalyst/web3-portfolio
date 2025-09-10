'use client'

import { useState, useEffect } from 'react'
import { ActivityService } from '@/lib/activity-service'

export default function MediaManagement() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('media-library')
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles)
        // Only filter out obviously broken sample URLs, keep real uploaded files
        const validFiles = files.filter((file: any) => {
          // Keep files with ImgBB URLs (real uploads)
          if (file.url.includes('i.ibb.co') || file.url.includes('imgbb.com')) {
            return true
          }
          // Remove old sample data with local paths
          if (file.url.startsWith('/images/') && 
              (file.name === 'hero-background.jpg' || 
               file.name === 'project-screenshot.png' || 
               file.name === 'data-analysis-chart.svg')) {
            return false
          }
          // Remove temporary blob URLs
          if (file.url.startsWith('blob:')) {
            return false
          }
          // Keep everything else (including any other valid URLs)
          return true
        })
        console.log('Loaded', validFiles.length, 'valid files from localStorage')
        setUploadedFiles(validFiles)
      } catch (error) {
        console.error('Error loading saved media files:', error)
        setUploadedFiles([])
      }
    } else {
      console.log('No saved media files found in localStorage')
    }
  }, [])

  // Save files to localStorage whenever files change
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      console.log('Saving', uploadedFiles.length, 'files to localStorage')
      localStorage.setItem('media-library', JSON.stringify(uploadedFiles))
    }
  }, [uploadedFiles])

  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    setUploading(true)
    const fileArray = Array.from(files)
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const fileKey = `${file.name}-${Date.now()}`
      
      try {
        // Validate file size (32MB limit for ImgBB)
        if (file.size > 32 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds 32MB limit`)
        }
        
        // Validate file type (ImgBB only accepts images)
        if (!file.type.startsWith('image/')) {
          throw new Error(`File "${file.name}" is not a supported image format`)
        }
        
        // Show progress
        setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }))
        
        // Upload to ImgBB (same service as profile pictures)
        setUploadProgress(prev => ({ ...prev, [fileKey]: 50 }))
        const uploadedUrl = await uploadToImgBB(file)
        setUploadProgress(prev => ({ ...prev, [fileKey]: 100 }))
        
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          url: uploadedUrl,
          used: false
        }
        
        setUploadedFiles(prev => {
          const updated = [newFile, ...prev]
          console.log('Added new file to media library:', newFile.name, newFile.url)
          console.log('Total files now:', updated.length)
          return updated
        })
        
        // Track media upload activity
        ActivityService.trackMedia(file.name)
        
        // Clean up progress
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileKey]: removed, ...rest } = prev
            return rest
          })
        }, 1000)
        
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        setUploadProgress(prev => {
          const { [fileKey]: removed, ...rest } = prev
          return rest
        })
      }
    }
    
    setUploading(false)
  }

  const uploadToImgBB = async (file: File): Promise<string> => {
    const API_KEY = '3feb82a2e6ad9cc020876716282b7321'
    
    const formData = new FormData()
    formData.append('image', file)
    formData.append('key', API_KEY)

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed')
    }

    return data.data.url
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    return '📁'
  }

  const handleDeleteFile = (id: number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const fileToDelete = uploadedFiles.find(f => f.id === id)
      console.log('User manually deleting file:', fileToDelete?.name)
      setUploadedFiles(files => {
        const filtered = files.filter(file => file.id !== id)
        console.log('Files after deletion:', filtered.length)
        return filtered
      })
    }
  }

  const copyToClipboard = async (url: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // Show success feedback (you could enhance this with a toast)
      const button = document.activeElement as HTMLButtonElement
      const originalText = button.textContent
      button.textContent = '✓ Copied!'
      button.style.color = '#10B981'
      
      setTimeout(() => {
        button.textContent = originalText
        button.style.color = ''
      }, 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback: select and copy
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const clearMediaLibrary = () => {
    if (window.confirm('Are you sure you want to clear all media files? This action cannot be undone.')) {
      console.log('User manually clearing all media files')
      setUploadedFiles([])
      localStorage.removeItem('media-library')
      console.log('Media library cleared')
    }
  }

  const stats = {
    total: uploadedFiles.length,
    totalSize: uploadedFiles.reduce((acc, file) => acc + parseFloat(file.size), 0),
    images: uploadedFiles.filter(f => f.type.startsWith('image/')).length,
    used: uploadedFiles.filter(f => f.used).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-foreground/70 mt-1">Manage your images, videos, and other assets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={clearMediaLibrary}
            className="px-4 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Files</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-xl">📁</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Images</p>
              <p className="text-2xl font-bold text-foreground">{stats.images}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <span className="text-green-500 text-xl">🖼️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">In Use</p>
              <p className="text-2xl font-bold text-foreground">{stats.used}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <span className="text-purple-500 text-xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Size</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalSize.toFixed(1)}MB</p>
            </div>
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <span className="text-orange-500 text-xl">💾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 transition-colors ${
          dragOver 
            ? 'border-cyber-500 bg-cyber-500/5' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFileUpload(e.dataTransfer.files)
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📤</div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-foreground/60 mb-6">
            Support for JPG, PNG, GIF, WebP, BMP, SVG images up to 32MB each
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              accept="image/*"
            />
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
              Choose Files
            </span>
          </label>
        </div>
      </div>

      {/* Files Grid */}
      {uploadedFiles.length > 0 ? (
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* File Preview */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-4xl">🖼️</span><div class="text-xs text-center text-foreground/60 mt-2">Image failed to load</div>`
                        }
                      }}
                    />
                  ) : (
                    <span className="text-4xl">{getFileIcon(file.type)}</span>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-foreground/60">
                    <span>{file.size}</span>
                    <span>{file.uploadDate}</span>
                  </div>
                  {file.used && (
                    <div className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                      ✓ In Use
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => copyToClipboard(file.url, file.name)}
                    className="text-xs text-foreground/60 hover:text-cyber-500 transition-colors"
                  >
                    📋 Copy URL
                  </button>
                  <div className="flex space-x-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-primary-500 transition-colors"
                      title="View file"
                    >
                      👁️
                    </a>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-foreground/60 hover:text-red-500 transition-colors"
                      title="Delete file"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-background rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-foreground mb-2">No files uploaded yet</h3>
          <p className="text-foreground/60">Upload your first file to get started</p>
        </div>
      )}
    </div>
  )
}