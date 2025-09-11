'use client'

import { useState, useEffect } from 'react'
import { ActivityService } from '@/lib/activity-service'

export default function MediaManagement() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'document'>('image')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [googleDriveUrl, setGoogleDriveUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

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

  const handleYouTubeAdd = () => {
    if (!youtubeUrl.trim()) return
    
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(youtubeUrl)
    if (!videoId) {
      alert('Please enter a valid YouTube URL')
      return
    }

    const newVideo = {
      id: Date.now() + Math.random(),
      name: `YouTube Video - ${videoId}`,
      type: 'video/youtube',
      size: 'N/A',
      uploadDate: new Date().toISOString().split('T')[0],
      url: youtubeUrl,
      videoId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      used: false,
      service: 'youtube'
    }

    setUploadedFiles(prev => {
      const updated = [newVideo, ...prev]
      console.log('Added YouTube video:', newVideo.name, newVideo.url)
      return updated
    })

    ActivityService.trackMedia(`YouTube: ${videoId}`)
    setYoutubeUrl('')
    setShowUrlInput(false)
  }

  const handleGoogleDriveAdd = () => {
    if (!googleDriveUrl.trim()) return

    // Extract file ID from Google Drive URL
    const fileId = extractGoogleDriveFileId(googleDriveUrl)
    if (!fileId) {
      alert('Invalid Google Drive URL. Please use a share link format: https://drive.google.com/file/d/FILE_ID/view')
      return
    }

    const fileName = extractGoogleDriveFileName(googleDriveUrl) || 'Google Drive Document'
    
    const newDocument = {
      id: Date.now() + Math.random(),
      name: fileName,
      type: 'application/pdf',
      size: 'Unknown',
      uploadDate: new Date().toISOString().split('T')[0],
      url: googleDriveUrl,
      used: false,
      service: 'googledrive',
      fileId: fileId
    }

    setUploadedFiles(prev => {
      const updated = [newDocument, ...prev]
      console.log('Added Google Drive document:', newDocument.name, newDocument.url)
      return updated
    })

    ActivityService.trackMedia(`Google Drive: ${fileName}`)
    setGoogleDriveUrl('')
    setShowUrlInput(false)
  }

  const extractYouTubeVideoId = (url: string): string | null => {
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

  const extractGoogleDriveFileId = (url: string): string | null => {
    // Extract file ID from Google Drive URL
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//)
    return match ? match[1] : null
  }

  const extractGoogleDriveFileName = (url: string): string | null => {
    // Try to extract filename from URL parameters or return default
    // Google Drive URLs don't typically contain filename, so we'll use a generic name
    return 'Google Drive Document'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string, service?: string) => {
    if (service === 'youtube' || type === 'video/youtube') return '📺'
    if (service === 'googledrive' || service === 'mediafire' || type === 'application/pdf') return '📄'
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
    totalSize: uploadedFiles.reduce((acc, file) => {
      const size = file.size === 'N/A' || file.size === 'Unknown' ? 0 : parseFloat(file.size) || 0
      return acc + size
    }, 0),
    images: uploadedFiles.filter(f => f.type.startsWith('image/')).length,
    videos: uploadedFiles.filter(f => f.service === 'youtube' || f.type.startsWith('video/')).length,
    documents: uploadedFiles.filter(f => f.service === 'googledrive' || f.service === 'mediafire' || f.type === 'application/pdf').length,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <p className="text-sm text-foreground/60">Videos</p>
              <p className="text-2xl font-bold text-foreground">{stats.videos}</p>
            </div>
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <span className="text-red-500 text-xl">📺</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Documents</p>
              <p className="text-2xl font-bold text-foreground">{stats.documents}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-xl">📄</span>
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

      {/* Media Type Selection */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Add Media</h2>
        
        {/* Media Type Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { type: 'image', icon: '🖼️', label: 'Images' },
            { type: 'video', icon: '📺', label: 'Videos' },
            { type: 'document', icon: '📄', label: 'Documents' }
          ].map((tab) => (
            <button
              key={tab.type}
              onClick={() => {
                setMediaType(tab.type as any)
                setShowUrlInput(false)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mediaType === tab.type
                  ? 'bg-cyber-500 text-white shadow-lg shadow-cyber-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Area for Images */}
        {mediaType === 'image' && (
          <div
            className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
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
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Upload Images
              </h3>
              <p className="text-foreground/60 mb-6">
                JPG, PNG, GIF, WebP, BMP, SVG • Up to 32MB each • Unlimited storage
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
          </div>
        )}

        {/* YouTube Video Input */}
        {mediaType === 'video' && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Add YouTube Videos
              </h3>
              <p className="text-foreground/60 mb-6">
                Paste YouTube video URL • Unlimited uploads • 15min max per video
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-foreground focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                  />
                  <button
                    onClick={handleYouTubeAdd}
                    disabled={!youtubeUrl.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    Add Video
                  </button>
                </div>
                <p className="text-xs text-foreground/50 mt-2">
                  Supports youtube.com/watch, youtu.be, shorts, and embed URLs
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Google Drive Document Input */}
        {mediaType === 'document' && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Add Documents
              </h3>
              <p className="text-foreground/60 mb-6">
                Paste Google Drive share URL • 15GB free storage • Ad-free viewing
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={googleDriveUrl}
                    onChange={(e) => setGoogleDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-foreground focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                  />
                  <button
                    onClick={handleGoogleDriveAdd}
                    disabled={!googleDriveUrl.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    Add Document
                  </button>
                </div>
                <p className="text-xs text-foreground/50 mt-2">
                  Upload files to Google Drive, set sharing to "Anyone with link", then paste the share link here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Files Grid */}
      {uploadedFiles.length > 0 ? (
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* File Preview */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                  {file.service === 'youtube' ? (
                    <div className="w-full h-full relative">
                      <img 
                        src={file.thumbnail} 
                        alt={file.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<span class="text-4xl">📺</span><div class="text-xs text-center text-foreground/60 mt-2">YouTube Video</div>`
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl">
                          ▶️
                        </div>
                      </div>
                    </div>
                  ) : file.service === 'googledrive' ? (
                    <div className="text-center">
                      <span className="text-4xl">📄</span>
                      <div className="text-xs text-center text-foreground/60 mt-2">Google Drive Document</div>
                    </div>
                  ) : file.type.startsWith('image/') ? (
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
                    <div className="text-center">
                      <span className="text-4xl">{getFileIcon(file.type, file.service)}</span>
                      <div className="text-xs text-center text-foreground/60 mt-2">{file.service || 'File'}</div>
                    </div>
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