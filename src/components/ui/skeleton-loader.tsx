import { memo } from 'react'

interface SkeletonLoaderProps {
  type: 'project-card' | 'hero' | 'text'
  className?: string
}

export const SkeletonLoader = memo(function SkeletonLoader({ type, className = '' }: SkeletonLoaderProps) {
  if (type === 'project-card') {
    return (
      <div className={`animate-pulse ${className}`} style={{ minHeight: '600px', maxHeight: '600px' }}>
        <div className="h-full rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {/* Image skeleton */}
          <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>

            {/* Tech stack */}
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
            </div>

            {/* Buttons skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'hero') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/6 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className={`animate-pulse space-y-2 ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    )
  }

  return null
})