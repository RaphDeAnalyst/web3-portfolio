'use client'

import { useEffect, useState } from 'react'
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
    colorClasses: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    iconClasses: 'text-green-500'
  },
  error: {
    icon: AlertCircle,
    colorClasses: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    iconClasses: 'text-red-500'
  },
  warning: {
    icon: AlertTriangle,
    colorClasses: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    iconClasses: 'text-yellow-500'
  },
  info: {
    icon: Info,
    colorClasses: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    iconClasses: 'text-blue-500'
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

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => handleDismiss(), notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => onDismiss(notification.id), 300)
  }

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