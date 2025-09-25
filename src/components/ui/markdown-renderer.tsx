'use client'

import { ReactNode, useState, useEffect } from 'react'
import { GoogleDriveDocument } from './google-drive-document'
import { GoogleDriveDocumentGroup } from './google-drive-document-group'
import { DuneEmbed } from '../blog/dune-embed'
import { dashboardService } from '../../lib/service-switcher'
import { extractDashboardIds } from '../../lib/utils/dune-placeholder-parser'
import { logger } from '../../lib/logger'
import type { Dashboard } from '../../types/dashboard'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(false)

  // Load dashboards when content changes
  useEffect(() => {
    const loadDashboards = async (retryCount = 0) => {
      const dashboardIds = extractDashboardIds(content)

      if (dashboardIds.length === 0) {
        setDashboards([])
        return
      }

      setIsLoadingDashboards(true)

      try {
        // Add timeout to the dashboard service call
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Dashboard loading timeout')), 10000) // 10 second timeout
        })

        const dashboardPromise = dashboardService.getDashboardsWithEmbeds()

        const allDashboards = await Promise.race([dashboardPromise, timeoutPromise])

        // Filter to get only the dashboards requested in the content
        const relevantDashboards = allDashboards.filter((d: Dashboard) =>
          dashboardIds.includes(d.dashboard_id)
        )

        // The allDashboards is already sorted by the service (featured first, then sort_order)
        // but we need to ensure the filtered dashboards maintain that priority order
        // since they'll be rendered in the order they appear in the content, not by priority


        setDashboards(relevantDashboards)
        setIsLoadingDashboards(false)
      } catch (error) {
        logger.error(`Error loading dashboards (attempt ${retryCount + 1}):`, error)

        // Retry logic: retry up to 2 times with increasing delay
        if (retryCount < 2) {
          const retryDelay = (retryCount + 1) * 1000 // 1s, 2s delay
          console.log(`Retrying dashboard load in ${retryDelay}ms...`)
          setTimeout(() => {
            loadDashboards(retryCount + 1)
          }, retryDelay)
          return
        }

        // After all retries failed, set empty dashboards and stop loading
        setDashboards([])
        setIsLoadingDashboards(false)
      }
    }

    // Add a small delay to prevent hydration issues
    const timeoutId = setTimeout(() => {
      loadDashboards()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [content]) // Re-run when content changes to pick up new dashboard placeholders


  // Helper function to detect and group consecutive Google Drive documents
  // Supports both formats:
  // - Titled links: [Custom Title](https://drive.google.com/file/d/FILE_ID/view) (recommended)
  // - Plain URLs: https://drive.google.com/file/d/FILE_ID/view (shows default "Document" title)
  const groupGoogleDriveDocs = (lines: string[]) => {
    const grouped: Array<{ type: 'document' | 'group' | 'other', data: any, originalIndex: number }> = []
    let i = 0
    
    while (i < lines.length) {
      const line = lines[i]
      
      // Check for Google Drive links (both titled and plain)
      const googleDriveTitleMatch = line.trim().match(/^\[([^\]]+)\]\((https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/[^)]*)\)/)
      const googleDriveMatch = line.trim().match(/^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
      
      if (googleDriveTitleMatch || googleDriveMatch) {
        const documents = []
        let currentIndex = i
        
        // Collect consecutive Google Drive documents
        while (currentIndex < lines.length) {
          const currentLine = lines[currentIndex]
          const titleMatch = currentLine.trim().match(/^\[([^\]]+)\]\((https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/[^)]*)\)/)
          const plainMatch = currentLine.trim().match(/^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
          
          if (titleMatch) {
            documents.push({
              fileId: titleMatch[3],
              customTitle: titleMatch[1],
              url: titleMatch[2]
            })
            currentIndex++
          } else if (plainMatch) {
            documents.push({
              fileId: plainMatch[1],
              url: currentLine.trim()
            })
            currentIndex++
          } else if (currentLine.trim() === '') {
            // Skip empty lines between documents
            currentIndex++
          } else {
            // Not a Google Drive document, stop grouping
            break
          }
        }
        
        if (documents.length > 0) {
          grouped.push({
            type: documents.length === 1 ? 'document' : 'group',
            data: documents,
            originalIndex: i
          })
          i = currentIndex
          continue
        }
      }
      
      // Not a Google Drive document
      grouped.push({
        type: 'other',
        data: line,
        originalIndex: i
      })
      i++
    }
    
    return grouped
  }

  // Simple markdown parser for demo purposes
  // In a real app, you'd use a library like react-markdown or marked
  const parseMarkdown = (text: string): ReactNode => {
    const lines = text.split('\n')
    const groupedLines = groupGoogleDriveDocs(lines)
    const elements: ReactNode[] = []
    
    for (let i = 0; i < groupedLines.length; i++) {
      const item = groupedLines[i]
      
      if (item.type === 'document') {
        const doc = item.data[0]
        elements.push(
          <GoogleDriveDocument 
            key={item.originalIndex}
            fileId={doc.fileId}
            customTitle={doc.customTitle}
            url={doc.url}
          />
        )
        continue
      }
      
      if (item.type === 'group') {
        elements.push(
          <GoogleDriveDocumentGroup
            key={item.originalIndex}
            documents={item.data}
          />
        )
        continue
      }
      
      // Process regular markdown line
      const line = item.data
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-foreground mb-6 text-gradient">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-foreground mb-4 mt-8">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-foreground mb-3 mt-6">
            {line.substring(4)}
          </h3>
        )
      }
      // Dune Analytics Placeholders
      else if (line.trim().match(/^\{\{embed_query:[a-zA-Z0-9_-]+\}\}$/)) {
        const match = line.trim().match(/^\{\{embed_query:([a-zA-Z0-9_-]+)\}\}$/)
        if (match) {
          const dashboardId = match[1]
          const dashboard = dashboards.find(d => d.dashboard_id === dashboardId)

          // Debug log for each dashboard lookup (development only)
          if (process.env.NODE_ENV === 'development') {
            logger.info(`Rendering dashboard placeholder ${dashboardId}:`, {
              found: !!dashboard,
              dashboard: dashboard ? {
                id: dashboard.dashboard_id,
                title: dashboard.title,
                featured: dashboard.featured,
                sortOrder: dashboard.sort_order,
                hasEmbed: !!dashboard.embed_url,
                hasEmbedUrls: !!(dashboard.embed_urls && dashboard.embed_urls.length > 0),
                embed_url: dashboard.embed_url,
                embed_urls: dashboard.embed_urls
              } : null,
              allAvailableDashboards: dashboards.map(d => ({
                id: d.dashboard_id,
                title: d.title,
                featured: d.featured,
                sortOrder: d.sort_order
              }))
            })
          }

          // Always show loading state first, then dashboard or error
          if (isLoadingDashboards || dashboards.length === 0) {
            elements.push(
              <div key={i} className="my-8">
                <div className="animate-pulse">
                  {/* Dashboard skeleton */}
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-6 w-48 mb-2"></div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                        <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                        <span className="text-sm font-medium">Loading dashboard...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          } else if (dashboard && (dashboard.embed_url || (dashboard.embed_urls && dashboard.embed_urls.length > 0))) {
            // Get all chart embeds (handle both legacy strings and new ChartEmbed objects)
            const allCharts: Array<{url: string, title?: string, description?: string}> = []

            if (dashboard.embed_urls && dashboard.embed_urls.length > 0) {
              dashboard.embed_urls.forEach((item, index) => {
                if (typeof item === 'string') {
                  // Legacy string format
                  allCharts.push({
                    url: item,
                    title: `Chart ${index + 1}`,
                    description: undefined
                  })
                } else if (typeof item === 'object' && item !== null && 'url' in item) {
                  // New ChartEmbed object format
                  allCharts.push(item as any)
                }
              })
            } else if (dashboard.embed_url) {
              // Fallback to legacy single embed_url
              allCharts.push({
                url: dashboard.embed_url,
                title: dashboard.title,
                description: dashboard.description
              })
            }

            // Create a DuneEmbed for each chart
            allCharts.forEach((chart, chartIndex) => {
              const chartTitle = chart.title || (allCharts.length > 1
                ? `${dashboard.title} - Chart ${chartIndex + 1}`
                : dashboard.title)
              const chartDescription = chart.description || dashboard.description

              elements.push(
                <DuneEmbed
                  key={`${i}-${chartIndex}`}
                  embedUrl={chart.url}
                  title={chartTitle}
                  caption={chartDescription}
                  dashboard={dashboard}
                />
              )
            })
          } else {
            elements.push(
              <div key={i} className="my-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium">Dashboard Unavailable</span>
                </div>
                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  The dashboard &quot;<code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">{dashboardId}</code>&quot; is not available or has no embed URL configured.
                </p>
              </div>
            )
          }
        }
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines = []
        i++ // Skip the opening ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <div key={i} className="my-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs text-foreground/60 font-medium">
              Code
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 text-sm text-foreground overflow-x-auto">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        )
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-cyber-500 pl-4 py-2 my-4 bg-cyber-500/5 rounded-r-lg">
            <p className="text-foreground/80 italic">{line.substring(2)}</p>
          </blockquote>
        )
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [line.substring(2)]
        while (i + 1 < lines.length && (lines[i + 1].startsWith('- ') || lines[i + 1].startsWith('* '))) {
          i++
          listItems.push(lines[i].substring(2))
        }
        elements.push(
          <ul key={i} className="list-disc pl-6 mb-4 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/80">{item}</li>
            ))}
          </ul>
        )
      }
      // Regular paragraphs
      else if (line.trim()) {
        // Handle inline formatting
        let formattedLine = line
        
        // Bold
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        
        // Italic
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>')
        
        // Inline code
        formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm font-mono text-cyber-500">$1</code>')
        
        // YouTube videos - check for YouTube URLs (including Shorts)
        const youtubeMatch = line.trim().match(/^https?:\/\/(?:www\.)?(youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?/)
        if (youtubeMatch) {
          const videoId = youtubeMatch[2]
          const originalUrl = youtubeMatch[0]
          // Add cache-busting parameter to force reload
          const cacheBuster = Date.now()

          elements.push(
            <div key={i} className="my-8">
              <div className="relative w-full max-w-4xl mx-auto" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?cb=${cacheBuster}`}
                  title="YouTube video"
                  className="absolute inset-0 w-full h-full rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg"
                  allowFullScreen
                  loading="lazy"
                  onError={() => {
                    // If iframe fails to load, this won't catch embedding restrictions
                    console.warn(`YouTube iframe failed to load for video: ${videoId}`)
                  }}
                />
                {/* Fallback content - shown when embedding is disabled */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="text-center p-6">
                    <div className="text-4xl mb-3">📺</div>
                    <div className="text-sm text-foreground/60 mb-3">Video embedding restricted</div>
                    <a
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
          continue
        }


        // Images - check if the line contains image markdown
        const imageMatch = line.trim().match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (imageMatch) {
          const altText = imageMatch[1] || 'Image'
          const imageUrl = imageMatch[2]
          
          elements.push(
            <div key={i} className="my-8 text-center">
              <div className="relative inline-block">
                <img 
                  src={imageUrl} 
                  alt={altText}
                  className="max-w-full h-auto rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg mx-auto transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    // Create error placeholder
                    const errorDiv = document.createElement('div')
                    errorDiv.className = 'p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800'
                    errorDiv.innerHTML = `
                      <div class="text-4xl mb-3">🖼️</div>
                      <div class="text-sm text-foreground/60">Image failed to load</div>
                      <div class="text-xs text-foreground/40 mt-1 font-mono break-all">${imageUrl}</div>
                    `
                    target.parentElement?.appendChild(errorDiv)
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.opacity = '1'
                  }}
                />
              </div>
              {altText && altText !== 'Image' && (
                <p className="text-sm text-foreground/60 mt-3 italic">{altText}</p>
              )}
            </div>
          )
          continue
        }
        
        // Links
        formattedLine = formattedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyber-500 hover:text-primary-500 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>')
        
        elements.push(
          <p key={i} className="text-foreground/80 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        )
      }
      // Empty lines
      else {
        elements.push(<br key={i} />)
      }
    }
    
    return elements
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="space-y-1">
        {parseMarkdown(content)}
      </div>
    </div>
  )
}