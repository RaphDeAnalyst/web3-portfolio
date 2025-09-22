'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Generate a simple blur data URL for placeholder
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ33HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvCZ3/8QAFQEBAQAAAAAAAAAAAAAAAAAABfH/2gAIAQMBAT8AmX//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AJ//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AJ//2Q=='

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${fill ? 'object-cover' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  )
}