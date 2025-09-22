'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'
import type { Notification, NotificationType } from '@/types/notification'

interface NotificationToastProps {
  notification: Notification
  onDismiss: (id: string) => void
  index: number
}

const typeConfig: Record<NotificationType, {
  icon: React.ComponentType<{ className?: string }>
  colorClasses: string
  iconClasses: string
}> = {
  success: {
    icon: CheckCircle,
    colorClasses: 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200',
    iconClasses: 'text-gray-600 dark:text-gray-400'
  },
  error: {
    icon: AlertCircle,
    colorClasses: 'bg-gray-100 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100',
    iconClasses: 'text-gray-700 dark:text-gray-300'
  },
  warning: {
    icon: AlertTriangle,
    colorClasses: 'bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300',
    iconClasses: 'text-gray-600 dark:text-gray-400'
  },
  info: {
    icon: Info,
    colorClasses: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200',
    iconClasses: 'text-gray-500 dark:text-gray-400'
  },
  loading: {
    icon: Loader2,
    colorClasses: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300',
    iconClasses: 'text-gray-500'
  }
}

export function NotificationToast({ notification, onDismiss, index }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const config = typeConfig[notification.type]
  const Icon = config.icon

  useEffect(() => {
    // Trigger entry animation
    const timer = setTimeout(() => setIsVisible(true), 100 + index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const handleDismiss = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => onDismiss(notification.id), 300)
  }, [onDismiss, notification.id])

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => handleDismiss(), notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration, handleDismiss])

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : isLeaving
            ? 'translate-x-full opacity-0 scale-95'
            : 'translate-x-full opacity-0 scale-95'
        }
      `}
      style={{
        transform: `translateY(${index * -10}px)`,
        zIndex: 1000 - index
      }}
      role="alert"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className={`
        relative min-w-80 max-w-md p-4 rounded-lg border shadow-lg backdrop-blur-sm
        ${config.colorClasses}
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon
              className={`w-5 h-5 ${config.iconClasses} ${
                notification.type === 'loading' ? 'animate-spin' : ''
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4 className="text-sm font-semibold mb-1">
                {notification.title}
              </h4>
            )}
            <p className="text-sm leading-relaxed">
              {notification.message}
            </p>

            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
              >
                {notification.action.label}
              </button>
            )}
          </div>

          {notification.dismissible !== false && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar for timed notifications */}
        {notification.duration && notification.duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-current opacity-30 transition-all ease-linear"
              style={{
                width: '100%',
                animation: `shrink ${notification.duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}