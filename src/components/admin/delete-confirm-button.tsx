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
        className="text-xs font-medium transition-opacity"
        style={{
          color: 'rgba(200, 50, 50, 0.7)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgb(200, 50, 50)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(200, 50, 50, 0.7)'
        }}
      >
        Delete
      </button>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleConfirm}
        className="text-xs font-medium px-2 py-1 rounded transition-all"
        style={{
          backgroundColor: 'rgba(200, 50, 50, 0.9)',
          color: '#fff',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.85'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        Confirm delete?
      </button>
      <button
        onClick={handleCancel}
        className="text-xs font-medium px-2 py-1 rounded transition-opacity"
        style={{
          color: 'var(--text-secondary)',
        }}
      >
        Cancel
      </button>
    </div>
  )
}
