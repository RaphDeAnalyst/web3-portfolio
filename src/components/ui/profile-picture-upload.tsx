'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { profileService } from '@/lib/service-switcher'
import { logger } from '@/lib/logger'

interface ProfilePictureUploadProps {
  onImageSelect: (imageUrl: string) => void
  currentImage?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showFallback?: boolean
}

export function ProfilePictureUpload({ 
  onImageSelect, 
  currentImage, 
  size = 'lg',
  className = "",
  showFallback = true
}: ProfilePictureUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const validateImage = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'))
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'))
        return
      }

      // Check image dimensions
      const img = new Image()
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          reject(new Error('Image must be at least 100x100 pixels'))
        } else if (img.width > 2048 || img.height > 2048) {
          reject(new Error('Image must be less than 2048x2048 pixels'))
        } else {
          resolve()
        }
      }
      img.onerror = () => reject(new Error('Invalid image file'))
      img.src = URL.createObjectURL(file)
    })
  }

  const resizeImage = (file: File, maxSize: number = 800): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        }, 'image/jpeg', 0.85)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadToImgBB = async (file: Blob): Promise<string> => {
    const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || ''

    if (!API_KEY) {
      throw new Error('ImgBB API key not configured')
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('key', API_KEY)

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      logger.error('ImgBB API Error:', response.status)
      throw new Error(`Upload failed: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    if (!data.success) {
      logger.error('ImgBB Response Error:', data)
      throw new Error(data.error?.message || 'Upload failed')
    }

    return data.data.url
  }

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      // Validate image
      await validateImage(file)
      setUploadProgress(20)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setUploadProgress(40)

      // Resize image for optimal upload
      const resizedBlob = await resizeImage(file, 800)
      if (!resizedBlob) throw new Error('Failed to process image')
      setUploadProgress(60)

      // Upload to ImgBB
      const imageUrl = await uploadToImgBB(resizedBlob)
      setUploadProgress(100)

      // Update profile and callback
      onImageSelect(imageUrl)
      await profileService.updateProfileField('avatar', imageUrl)

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        setPreview(null)
      }, 500)

    } catch (error) {
      logger.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      setUploading(false)
      setUploadProgress(0)
      setPreview(null)
    }
  }, [onImageSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const [profileData, setProfileData] = useState<any>(null)
  
  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile()
        setProfileData(data)
      } catch (error) {
        logger.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [])
  
  const displayImage = preview || currentImage || profileData?.avatar

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Profile Picture Display */}
      <div
        className={`relative ${sizeClasses[size]} mx-auto cursor-pointer group transition-all duration-300 ${
          dragOver ? 'scale-105' : ''
        } ${uploading ? 'pointer-events-none' : ''}`}
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

        {/* Profile Picture */}
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 transition-all duration-300 ${
          dragOver 
            ? 'border-cyber-500 shadow-lg shadow-cyber-500/25' 
            : 'border-gray-200 dark:border-gray-700 group-hover:border-primary-500'
        } ${uploading ? 'opacity-75' : ''}`}>
          {displayImage && displayImage !== '/avatar.jpg' ? (
            <img
              src={displayImage}
              alt={`${profileData?.name || 'Matthew Raphael'}'s profile picture`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/avatar.jpg'
              }}
            />
          ) : showFallback ? (
            <div className="w-full h-full bg-accent-blue flex items-center justify-center text-white">
              <span className={`font-bold ${
                size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-4xl'
              }`}>
                {(profileData?.name || 'Matthew Raphael').charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-4xl'} mb-1`}>
                  📸
                </div>
                {size !== 'sm' && (
                  <div className="text-xs">Add Photo</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upload overlay */}
        <div className={`absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
          dragOver || uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {uploading ? (
            <div className="text-center text-white">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-xs">{uploadProgress}%</div>
            </div>
          ) : (
            <div className="text-white text-center">
              <div className="text-xl mb-1">📸</div>
              {size !== 'sm' && <div className="text-xs">Change Photo</div>}
            </div>
          )}
        </div>

        {/* Upload progress ring */}
        {uploading && (
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="#00D9FF"
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={100 - uploadProgress}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Upload instructions */}
      {size !== 'sm' && !uploading && (
        <div className="text-center text-xs text-foreground/60 space-y-1">
          <p>Click or drag to upload</p>
          <p>Max 5MB • Min 100x100px • JPG, PNG, WebP</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Remove option */}
      {currentImage && currentImage !== '/avatar.jpg' && !uploading && (
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation()
            onImageSelect('/avatar.jpg')
            await profileService.updateProfileField('avatar', '/avatar.jpg')
          }}
          className="block mx-auto text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Remove photo
        </button>
      )}
    </div>
  )
}