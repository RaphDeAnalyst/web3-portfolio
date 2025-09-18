'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for analytics components
const Analytics = dynamic(() => import('@vercel/analytics/next').then(mod => ({ default: mod.Analytics })), {
  ssr: false
})

const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => ({ default: mod.SpeedInsights })), {
  ssr: false
})

export function DeferredAnalytics() {
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false)

  useEffect(() => {
    // Wait for page to be interactive before loading analytics
    const loadAnalytics = () => {
      if (typeof window !== 'undefined') {
        // Check if page is interactive
        if (document.readyState === 'complete') {
          setShouldLoadAnalytics(true)
        } else {
          // Wait for load event
          window.addEventListener('load', () => {
            setShouldLoadAnalytics(true)
          }, { once: true })
        }
      }
    }

    // Use requestIdleCallback to defer further
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        loadAnalytics()
      }, { timeout: 10000 })

      return () => {
        if (idleCallback) {
          window.cancelIdleCallback(idleCallback)
        }
      }
    } else {
      // Fallback with delay
      const timeoutId = setTimeout(loadAnalytics, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  if (!shouldLoadAnalytics) {
    return null
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}