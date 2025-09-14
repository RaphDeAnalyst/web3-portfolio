'use client'

import { NotificationToast } from './NotificationToast'
import type { Notification } from '@/types/notification'

interface NotificationContainerProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  if (!notifications || notifications.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <div className="space-y-2 pointer-events-auto">
        {notifications.map((notification, index) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}