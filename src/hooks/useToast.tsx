import { useState, useCallback, useRef } from 'react'

export type ToastType = 'success' | 'error' | 'loading' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  onRetry?: () => void
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idRef = useRef(0)

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const dismiss = useCallback(() => {
    clearTimeout()
    setToast(null)
  }, [clearTimeout])

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number, onRetry?: () => void) => {
      clearTimeout()

      const id = String(++idRef.current)
      setToast({ id, type, message, onRetry })

      if (duration && duration > 0) {
        timeoutRef.current = setTimeout(() => {
          setToast(current => (current?.id === id ? null : current))
        }, duration)
      }
    },
    [clearTimeout]
  )

  const showSuccess = useCallback(
    (message: string) => showToast('success', message, 3000),
    [showToast]
  )

  const showError = useCallback(
    (message: string, onRetry?: () => void) => showToast('error', message, undefined, onRetry),
    [showToast]
  )

  const showLoading = useCallback(
    (message: string) => showToast('loading', message, undefined),
    [showToast]
  )

  const showWarning = useCallback(
    (message: string) => showToast('warning', message, 5000),
    [showToast]
  )

  return {
    toast,
    showSuccess,
    showError,
    showLoading,
    showWarning,
    dismiss,
  }
}
