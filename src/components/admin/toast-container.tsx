'use client'

import { useEffect, useState } from 'react'
import type { Toast } from '@/hooks/useToast'

interface ToastContainerProps {
  toast: Toast | null
  onDismiss: () => void
}

export function ToastContainer({ toast, onDismiss }: ToastContainerProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!toast) {
      setIsExiting(false)
      setProgress(100)
      return
    }

    setIsExiting(false)
    setProgress(100)

    if (toast.type === 'success' || toast.type === 'warning') {
      const duration = toast.type === 'success' ? 3000 : 5000
      const startTime = Date.now()

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, 1 - elapsed / duration)
        setProgress(remaining * 100)
      }, 16)

      const timer = setTimeout(() => {
        clearInterval(progressInterval)
        setIsExiting(true)
        setTimeout(onDismiss, 150)
      }, duration)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(timer)
      }
    }
  }, [toast, onDismiss])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 150)
  }

  if (!toast) return null

  const baseClasses = `
    fixed z-50 px-4 py-4 sm:px-6 sm:py-4 rounded-lg shadow-lg
    transform transition-all duration-200
  `

  const animationClasses = isExiting
    ? 'opacity-0 translate-y-2'
    : 'opacity-100 translate-y-0'

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-emerald-950/40',
          border: 'border border-green-200 dark:border-emerald-800',
          text: 'text-green-900 dark:text-emerald-100',
          icon: '✓',
          iconBg: 'bg-green-600 dark:bg-emerald-700',
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40',
          border: 'border border-red-200 dark:border-red-800',
          text: 'text-red-900 dark:text-red-100',
          icon: '✕',
          iconBg: 'bg-red-600 dark:bg-red-700',
        }
      case 'loading':
        return {
          bg: 'bg-zinc-900 dark:bg-zinc-800',
          border: 'border border-zinc-700',
          text: 'text-zinc-100',
          icon: '○',
          iconBg: 'bg-zinc-700 dark:bg-zinc-600',
          spin: true,
        }
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border border-amber-200 dark:border-amber-800',
          text: 'text-amber-900 dark:text-amber-100',
          icon: '!',
          iconBg: 'bg-amber-600 dark:bg-amber-700',
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900',
          border: 'border border-gray-200 dark:border-gray-800',
          text: 'text-gray-900 dark:text-gray-100',
          icon: 'ℹ',
          iconBg: 'bg-gray-600 dark:bg-gray-700',
        }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${styles.bg} ${styles.border} bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-sm sm:max-w-md`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`${styles.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${
            styles.spin ? 'animate-spin-slow' : ''
          }`}
        >
          {styles.icon}
        </div>

        {/* Message and Action */}
        <div className="flex-1 min-w-0">
          <p className={`${styles.text} text-sm font-medium leading-snug`}>
            {toast.message}
          </p>
          {toast.type === 'error' && toast.onRetry && (
            <button
              onClick={() => {
                handleDismiss()
                toast.onRetry?.()
              }}
              className={`${styles.text} text-xs font-medium mt-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 rounded`}
            >
              Try again →
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {toast.type !== 'loading' && (
          <button
            onClick={handleDismiss}
            className={`${styles.text} flex-shrink-0 w-5 h-5 flex items-center justify-center hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 rounded transition-opacity`}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {(toast.type === 'success' || toast.type === 'warning') && (
        <div className="mt-2 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              toast.type === 'success'
                ? 'bg-green-600 dark:bg-emerald-500'
                : 'bg-amber-600 dark:bg-amber-500'
            } transition-all ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
