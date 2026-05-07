'use client'

import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { useState } from 'react'

export default function TestToastsPage() {
  const { toast, showSuccess, showError, showLoading, showWarning, dismiss } = useToast()
  const [testMessage, setTestMessage] = useState('Test message')

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Toast & Confirmation Test Page</h1>

        <ToastContainer toast={toast} onDismiss={dismiss} />

        <div className="space-y-8">
          {/* Test Controls */}
          <div className="p-6 border border-border rounded">
            <h2 className="text-2xl font-semibold mb-6">Toast Tests</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="toast-message" className="block text-sm font-medium mb-2">Message:</label>
                <input
                  id="toast-message"
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => showSuccess(testMessage)}
                  className="px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Success
                </button>
                <button
                  onClick={() => showError(testMessage)}
                  className="px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Error
                </button>
                <button
                  onClick={() => showLoading(testMessage)}
                  className="px-4 py-3 bg-zinc-700 text-white rounded hover:bg-zinc-800 transition-colors"
                >
                  Loading
                </button>
                <button
                  onClick={() => showWarning(testMessage)}
                  className="px-4 py-3 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                >
                  Warning
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  onClick={dismiss}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          {/* Delete Button Test */}
          <div className="p-6 border border-border rounded">
            <h2 className="text-2xl font-semibold mb-6">Delete Confirmation Test</h2>
            <p className="mb-4 text-sm opacity-60">Click the delete button to test the two-step confirmation pattern. It will auto-reset after 4 seconds if you do not confirm.</p>
            <DeleteConfirmButton
              onConfirm={() => {
                showSuccess('Delete confirmed (simulated)')
              }}
            />
          </div>

          {/* Visual Reference */}
          <div className="p-6 border border-border rounded bg-background/50">
            <h2 className="text-2xl font-semibold mb-6">Design Specifications</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Success Toast</h3>
                <p className="text-sm opacity-60">Green background, checkmark icon, auto-dismisses after 3 seconds with progress bar</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Error Toast</h3>
                <p className="text-sm opacity-60">Red background, X icon, manual dismiss only, includes &quot;Try again&quot; button</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Loading Toast</h3>
                <p className="text-sm opacity-60">Dark background, spinning icon, no manual dismiss, auto-replaced by success/error</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Warning Toast</h3>
                <p className="text-sm opacity-60">Amber background, exclamation icon, auto-dismisses after 5 seconds with progress bar</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delete Confirmation</h3>
                <p className="text-sm opacity-60">Two-step inline pattern: first click shows confirm or cancel, auto-resets after 4 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
