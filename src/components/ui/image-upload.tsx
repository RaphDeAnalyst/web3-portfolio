'use client'

import { useState, useRef } from 'react'
import { logger } from '@/lib/logger'

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  currentImage?: string
  label?: string
  className?: string
}

export function ImageUpload({ 
  onImageSelect, 
  currentImage, 
  label = "Upload Image",
  className = "" 
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const imageUrl = await uploadToImgBB(file)
        onImageSelect(imageUrl)
      } catch (error) {
        logger.error('Failed to upload image:', error)
        // Fallback to base64 for now
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onImageSelect(result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const uploadToImgBB = async (file: File): Promise<string> => {
    // Replace with your ImgBB API key
    const API_KEY = '3feb82a2e6ad9cc020876716282b7321'
    
    const formData = new FormData()
    formData.append('image', file)
    formData.append('key', API_KEY)

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.data.url
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
          dragOver
            ? 'border-cyber-500 bg-cyber-500/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {currentImage ? (
          <div className="space-y-4">
            <img
              src={currentImage}
              alt="Featured"
              className="max-w-full h-32 object-cover rounded-lg mx-auto"
            />
            <div className="text-center">
              <p className="text-sm text-foreground/60">Click or drag to replace image</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📸</div>
            <div className="text-sm text-foreground/60">
              <p>Click or drag and drop an image here</p>
              <p className="text-xs mt-1">Supports JPG, PNG, GIF, WebP</p>
            </div>
          </div>
        )}
      </div>
      
      {currentImage && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onImageSelect('')
          }}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  )
}