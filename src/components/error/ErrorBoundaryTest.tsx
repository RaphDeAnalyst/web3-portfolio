'use client'

import { useState } from 'react'

interface ErrorTestProps {
  section: string
}

export function ErrorBoundaryTest({ section }: ErrorTestProps) {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error(`Test error in ${section} section`)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/90 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 shadow-lg">
      <h4 className="font-semibold text-red-500 mb-2">Error Boundary Test</h4>
      <p className="text-sm text-foreground/70 mb-3">Test error boundaries for: {section}</p>
      <button
        onClick={() => setShouldError(true)}
        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
      >
        Trigger Error
      </button>
    </div>
  )
}