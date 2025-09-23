'use client'

import { useState, useEffect, useRef } from 'react'
import type { DuneEmbedProps } from '../../types/dashboard'

export function DuneEmbed({
  embedUrl,
  title = 'Dune Analytics Dashboard',
  caption,
  width = '100%',
  height = '400px',
  className = '',
  lazy = true,
  dashboard
}: DuneEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px' // Start loading when 100px away from viewport
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isVisible])

  const handleIframeLoad = () => {
    // Add a small delay to ensure iframe content is fully loaded
    setTimeout(() => {
      setIsLoading(false)
      setHasError(false)
    }, 500)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const validateEmbedUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      const allowedDomains = ['dune.com', 'dune.xyz']
      return allowedDomains.includes(parsed.hostname) &&
             parsed.pathname.startsWith('/embeds/')
    } catch {
      return false
    }
  }

  if (!embedUrl || !validateEmbedUrl(embedUrl)) {
    return (
      <div className="dune-embed-error my-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="font-medium">Invalid Embed URL</span>
        </div>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
          The provided URL is not a valid Dune Analytics embed URL.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`dune-embed-container my-8 ${className}`}
      data-dashboard-id={dashboard?.dashboard_id}
    >
      {title && (
        <h3 className="dune-embed-title text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}

      {dashboard?.description && (
        <p className="dune-embed-description text-sm text-gray-600 dark:text-gray-400 mb-4">
          {dashboard.description}
        </p>
      )}

      <div className="dune-embed-wrapper relative w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg overflow-hidden">
        {/* Loading State */}
        {isLoading && isVisible && (
          <div className="dune-embed-loading absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-400 mb-3">
                <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                <span className="text-sm font-medium">Loading dashboard...</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Connecting to Dune Analytics
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="dune-embed-error absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
            <div className="text-center p-6">
              <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Failed to Load Dashboard
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Unable to load the Dune Analytics dashboard. Please try refreshing the page.
              </p>
              <button
                onClick={() => {
                  setHasError(false)
                  setIsLoading(true)
                  if (iframeRef.current) {
                    iframeRef.current.src = embedUrl
                  }
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Lazy Loading Placeholder */}
        {!isVisible && (
          <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800" style={{ height }}>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dashboard will load when visible
              </p>
            </div>
          </div>
        )}

        {/* Iframe */}
        {isVisible && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            width={width}
            height={height}
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            className="dune-embed-iframe w-full"
            title={title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              minHeight: height,
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className="dune-embed-caption text-sm text-gray-600 dark:text-gray-400 mt-3 text-center italic">
          {caption}
        </p>
      )}

      {/* Dashboard metadata for development */}
      {process.env.NODE_ENV === 'development' && dashboard && (
        <details className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
            Debug Info
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
            {JSON.stringify(
              {
                dashboard_id: dashboard.dashboard_id,
                title: dashboard.title,
                category: dashboard.category,
                embed_url: dashboard.embed_url
              },
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  )
}