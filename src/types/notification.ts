export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number // in milliseconds, 0 for permanent
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void

  // Convenience methods
  success: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string
  error: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string
  warning: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string
  info: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string
  loading: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string

  // Common user actions
  copied: (item?: string) => string
  deleted: (item: string) => string
  updated: (item: string) => string
  saved: (item: string) => string
  created: (item: string) => string
}