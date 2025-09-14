'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Notification, NotificationContextType } from '@/types/notification'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId()
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 seconds default
      dismissible: true,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])
    return id
  }, [generateId])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return addNotification({ type: 'success', message, ...options })
  }, [addNotification])

  const error = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000, // Errors stay longer
      ...options
    })
  }, [addNotification])

  const warning = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    })
  }, [addNotification])

  const info = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return addNotification({ type: 'info', message, ...options })
  }, [addNotification])

  const loading = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'loading',
      message,
      duration: 0, // Loading notifications persist until manually dismissed
      ...options
    })
  }, [addNotification])

  // Common user action methods
  const copied = useCallback((item = 'Content') => {
    return success(`${item} copied to clipboard!`, { duration: 3000 })
  }, [success])

  const deleted = useCallback((item: string) => {
    return success(`${item} deleted successfully`, { duration: 4000 })
  }, [success])

  const updated = useCallback((item: string) => {
    return success(`${item} updated successfully`, { duration: 4000 })
  }, [success])

  const saved = useCallback((item: string) => {
    return success(`${item} saved successfully`, { duration: 4000 })
  }, [success])

  const created = useCallback((item: string) => {
    return success(`${item} created successfully`, { duration: 4000 })
  }, [success])

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    loading,
    copied,
    deleted,
    updated,
    saved,
    created
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// Hook for accessing notifications without throwing error (for optional usage)
export function useNotificationOptional(): NotificationContextType | undefined {
  return useContext(NotificationContext)
}