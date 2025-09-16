'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Admin Access Demo Component
 * Shows current admin access status and methods for testing
 */
export function AdminAccessDemo() {
  const [tapCount, setTapCount] = useState(0)
  const searchParams = useSearchParams()
  const hasAdminParam = searchParams?.get('admin') === 'true' || searchParams?.get('dev') === 'true'

  useEffect(() => {
    // Listen for admin access events from navbar
    const handleAdminAccess = () => {
      alert('Admin access granted via 5-tap gesture!')
    }

    // This is just for demo - in real implementation the navigation happens in navbar
    window.addEventListener('admin-access', handleAdminAccess)
    return () => window.removeEventListener('admin-access', handleAdminAccess)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm z-40">
      <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white">Admin Access Status</h3>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>URL Parameter:</span>
          <span className={hasAdminParam ? 'text-green-600 font-bold' : 'text-gray-500'}>
            {hasAdminParam ? '✓ Active' : '✗ Inactive'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>5-Tap Gesture:</span>
          <span className="text-blue-600">Tap logo 5x on mobile</span>
        </div>

        <div className="flex items-center justify-between">
          <span>PWA Shortcut:</span>
          <span className="text-purple-600">Long press app icon</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Try: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">?admin=true</code>
        </p>
      </div>
    </div>
  )
}