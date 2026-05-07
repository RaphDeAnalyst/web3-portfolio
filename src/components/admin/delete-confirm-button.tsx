'use client'

import { useState, useEffect, useRef } from 'react'

interface DeleteConfirmButtonProps {
  onConfirm: () => void
  disabled?: boolean
}

export function DeleteConfirmButton({
  onConfirm,
  disabled = false,
}: DeleteConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleFirstClick = () => {
    if (disabled) return
    setIsConfirming(true)

    // Auto-reset after 4 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsConfirming(false)
    }, 4000)
  }

  const handleConfirm = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsConfirming(false)
    onConfirm()
  }

  const handleCancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsConfirming(false)
  }

  if (!isConfirming) {
    return (
      <button
        onClick={handleFirstClick}
        disabled={disabled}
        className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:focus-visible:outline-red-400 font-medium transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete
      </button>
    )
  }

  return (
    <div className="flex gap-2 items-center animate-delete-confirm">
      <button
        onClick={handleConfirm}
        className="px-3 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:focus-visible:outline-red-700 transition-colors rounded"
      >
        Confirm delete?
      </button>
      <button
        onClick={handleCancel}
        className="px-3 py-2 text-sm font-medium text-foreground hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity rounded"
      >
        Cancel
      </button>
    </div>
  )
}
