'use client'

import { useState } from 'react'
import { ActivityService } from '@/lib/activity-service'

export default function MediaManagement() {
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'hero-background.jpg',
      type: 'image/jpeg',
      size: '2.5 MB',
      uploadDate: '2024-01-15',
      url: '/images/hero-background.jpg',
      used: true
    },
    {
      id: 2,
      name: 'project-screenshot.png',
      type: 'image/png',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      url: '/images/project-screenshot.png',
      used: false
    },
    {
      id: 3,
      name: 'data-analysis-chart.svg',
      type: 'image/svg+xml',
      size: '156 KB',
      uploadDate: '2024-01-13',
      url: '/images/data-analysis-chart.svg',
      used: true
    }
  ])

  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
        used: false
      }
      
      setUploadedFiles(prev => [newFile, ...prev])
      
      // Track media upload activity
      ActivityService.trackMedia(file.name)
    })
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
      setUploadedFiles(files => files.filter(file => file.id !== id))
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
        <p className="text-foreground/70 mt-1">Manage your images, videos, and other assets</p>
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
            Support for images, videos, documents, and other media files
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
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
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
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
                    onClick={() => copyToClipboard(file.url)}
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