'use client'

import { useState } from 'react'
import { StorageProvider, UploadOptions } from '@/lib/media-service-hybrid'
import { RoutingDecision } from '@/lib/smart-upload-router'
import { FolderOpen } from 'lucide-react'

interface UploadTabProps {
  uploadState: {
    uploading: boolean
    progress: Record<string, number>
    decisions: Record<string, RoutingDecision>
  }
  uploadOptions: UploadOptions
  selectedProvider: StorageProvider | 'auto'
  showAdvanced: boolean
  onFileUpload: (files: FileList | null) => void
  onExternalAdd: (url: string, provider: 'youtube' | 'googledrive') => Promise<boolean>
  onOptionsChange: (options: UploadOptions) => void
  onProviderChange: (provider: StorageProvider | 'auto') => void
  onAdvancedToggle: (show: boolean) => void
}

export function UploadTab({
  uploadState,
  uploadOptions,
  selectedProvider,
  showAdvanced,
  onFileUpload,
  onExternalAdd,
  onOptionsChange,
  onProviderChange,
  onAdvancedToggle
}: UploadTabProps) {
  const [dragOver, setDragOver] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [externalProvider, setExternalProvider] = useState<'youtube' | 'googledrive'>('youtube')

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    onFileUpload(e.dataTransfer.files)
  }

  const handleExternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!externalUrl.trim()) return
    
    const success = await onExternalAdd(externalUrl, externalProvider)
    if (success) {
      setExternalUrl('')
    }
  }

  return (
    <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Upload Media</h2>
      
      {/* Upload Options */}
      {showAdvanced && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Advanced Options</h3>
            <button
              onClick={() => onAdvancedToggle(!showAdvanced)}
              className="text-primary-500 hover:text-primary-600 text-sm"
            >
              Hide Advanced
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Storage Provider
            </label>
            <select
              value={selectedProvider}
              onChange={e => onProviderChange(e.target.value as StorageProvider | 'auto')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
            >
              <option value="auto">Auto-select (Recommended)</option>
              <option value="supabase">Supabase</option>
              <option value="imgbb">ImgBB</option>
            </select>
          </div>
        </div>
      )}

      {!showAdvanced && (
        <div className="mb-4 text-center">
          <button
            onClick={() => onAdvancedToggle(true)}
            className="text-primary-500 hover:text-primary-600 text-sm"
          >
            Show Advanced Options
          </button>
        </div>
      )}

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="mb-4">
          <FolderOpen size={48} className="mx-auto text-gray-400" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">
          Drop files here or click to select
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports images, videos, documents, and more
        </p>
        
        <input
          type="file"
          multiple
          onChange={e => onFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 cursor-pointer transition-colors"
        >
          Select Files
        </label>
      </div>

      {/* External Media */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-foreground mb-4">Add External Media</h3>
        
        <form onSubmit={handleExternalSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Media Type
            </label>
            <select
              value={externalProvider}
              onChange={e => setExternalProvider(e.target.value as 'youtube' | 'googledrive')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
            >
              <option value="youtube">YouTube Video</option>
              <option value="googledrive">Google Drive Document</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={e => setExternalUrl(e.target.value)}
              placeholder="Enter URL..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-secondary-500 text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
          >
            Add External Media
          </button>
        </form>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadState.progress).length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-foreground mb-4">Upload Progress</h3>
          <div className="space-y-3">
            {Object.entries(uploadState.progress).map(([key, progress]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground">{key.split('-')[0]}</span>
                  <span className={`font-medium ${
                    progress === -1 ? 'text-red-500' : 
                    progress === 100 ? 'text-green-500' : 'text-primary-500'
                  }`}>
                    {progress === -1 ? 'Error' : progress === 100 ? 'Complete' : `${progress}%`}
                  </span>
                </div>
                {progress !== -1 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress === 100 ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Decisions */}
      {Object.keys(uploadState.decisions).length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-foreground mb-4">Smart Routing Decisions</h3>
          <div className="space-y-3">
            {Object.entries(uploadState.decisions).map(([filename, decision]) => (
              <div key={filename} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{filename}</span>
                  <span className="text-sm text-primary-500">{decision.provider}</span>
                </div>
                <p className="text-sm text-gray-600">{decision.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}