'use client'

import { useState, useEffect } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  isDangerous?: boolean
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsExiting(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleConfirm = async () => {
    await onConfirm()
  }

  const handleCancel = () => {
    setIsExiting(true)
    setTimeout(onCancel, 150)
  }

  if (!isOpen && !isExiting) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-150 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      role="presentation"
      onClick={handleCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 ${
          isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 space-y-4">
          {/* Title */}
          <h2
            id="modal-title"
            className="text-xl font-bold text-foreground"
          >
            {title}
          </h2>

          {/* Message */}
          <p className="text-sm text-foreground/70 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600'
                  : 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600'
              }`}
            >
              {isLoading ? 'Saving...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
