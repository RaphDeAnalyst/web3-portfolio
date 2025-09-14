'use client'

import { useNotification } from '@/lib/notification-context'
import { NotificationContainer } from './NotificationContainer'

export function GlobalNotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <NotificationContainer
      notifications={notifications}
      onDismiss={removeNotification}
    />
  )
}