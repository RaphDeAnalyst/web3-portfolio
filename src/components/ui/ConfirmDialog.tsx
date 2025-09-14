'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsConfirming(false)
    }
  }

  const variantStyles = {
    danger: {
      iconColor: 'text-primary-800',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
      confirmBtn: 'bg-primary-800 hover:bg-primary-900 focus:ring-primary-800',
    },
    warning: {
      iconColor: 'text-primary-500',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
      confirmBtn: 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500',
    },
    info: {
      iconColor: 'text-primary-600',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
      confirmBtn: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-600',
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-background border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          disabled={isConfirming}
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-foreground/70 text-center mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={onClose}
              disabled={isConfirming}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmBtn}`}
            >
              {isConfirming ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}