import type { Dashboard, PlaceholderMatch, ParsedContent } from '../../types/dashboard'
import { logger } from '../logger'

const PLACEHOLDER_REGEX = /\{\{embed_query:([a-zA-Z0-9_-]+)\}\}/g

export class DunePlaceholderParser {
  static parsePlaceholders(content: string): PlaceholderMatch[] {
    const matches: PlaceholderMatch[] = []
    let match: RegExpExecArray | null

    // Reset regex lastIndex to ensure we get all matches
    PLACEHOLDER_REGEX.lastIndex = 0

    while ((match = PLACEHOLDER_REGEX.exec(content)) !== null) {
      matches.push({
        placeholder: match[0],
        dashboardId: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      })
    }

    return matches
  }

  static extractDashboardIds(content: string): string[] {
    const matches = this.parsePlaceholders(content)
    return [...new Set(matches.map(match => match.dashboardId))]
  }

  static validatePlaceholder(placeholder: string): boolean {
    const regex = /^\{\{embed_query:[a-zA-Z0-9_-]+\}\}$/
    return regex.test(placeholder)
  }

  static async replacePlaceholders(
    content: string,
    dashboards: Dashboard[]
  ): Promise<string> {
    try {
      const matches = this.parsePlaceholders(content)

      if (matches.length === 0) {
        return content
      }

      // Create a map for quick dashboard lookup
      const dashboardMap = new Map<string, Dashboard>()
      dashboards.forEach(dashboard => {
        dashboardMap.set(dashboard.dashboard_id, dashboard)
      })

      // Sort matches by startIndex in descending order to avoid index shifting
      const sortedMatches = matches.sort((a, b) => b.startIndex - a.startIndex)

      let result = content
      for (const match of sortedMatches) {
        const dashboard = dashboardMap.get(match.dashboardId)


        if (dashboard && this.hasValidEmbedUrls(dashboard)) {
          const embedHtml = this.generateEmbedHtml(dashboard)
          result = result.substring(0, match.startIndex) +
                  embedHtml +
                  result.substring(match.endIndex)
        } else {
          if (dashboard) {
            logger.warn(`Dashboard found but no valid embed URLs: ${match.dashboardId}`, {
              embed_url: dashboard.embed_url,
              embed_urls: dashboard.embed_urls,
              has_embed_url: !!dashboard.embed_url,
              has_embed_urls: !!(dashboard.embed_urls && dashboard.embed_urls.length > 0),
              getAllEmbedUrls_result: this.getAllEmbedUrls(dashboard)
            })
          } else {
            logger.warn(`Dashboard not found: ${match.dashboardId}`)
            logger.warn('Available dashboards:', Array.from(dashboardMap.keys()))
          }
          // Replace with a placeholder message
          const fallbackHtml = this.generateFallbackHtml(match.dashboardId)
          result = result.substring(0, match.startIndex) +
                  fallbackHtml +
                  result.substring(match.endIndex)
        }
      }

      return result
    } catch (error) {
      logger.error('Error replacing placeholders:', error)
      return content
    }
  }

  // Helper method to check if dashboard has any valid embed URLs
  static hasValidEmbedUrls(dashboard: Dashboard): boolean {
    // Prioritize embed_urls array over legacy embed_url
    return !!((dashboard.embed_urls && Array.isArray(dashboard.embed_urls) && dashboard.embed_urls.length > 0) || dashboard.embed_url)
  }

  // Helper method to get all embed URLs from a dashboard (legacy support)
  static getAllEmbedUrls(dashboard: Dashboard): string[] {
    return this.getAllChartEmbeds(dashboard).map(chart => chart.url)
  }

  // Helper method to get all ChartEmbed objects from a dashboard
  static getAllChartEmbeds(dashboard: Dashboard): import('../../types/dashboard').ChartEmbed[] {
    const charts: import('../../types/dashboard').ChartEmbed[] = []

    // Prioritize new multiple embed URLs if exists
    if (dashboard.embed_urls && Array.isArray(dashboard.embed_urls) && dashboard.embed_urls.length > 0) {
      dashboard.embed_urls.forEach((item, index) => {
        if (typeof item === 'string') {
          // Convert legacy string format to ChartEmbed object
          charts.push({
            url: item,
            title: `Chart ${index + 1}`,
            description: undefined
          })
        } else if (typeof item === 'object' && item !== null && 'url' in item) {
          // Already a ChartEmbed object
          charts.push(item as import('../../types/dashboard').ChartEmbed)
        }
      })
    }
    // Fallback to legacy single embed URL only if no embed_urls array
    else if (dashboard.embed_url && typeof dashboard.embed_url === 'string') {
      charts.push({
        url: dashboard.embed_url,
        title: dashboard.title,
        description: dashboard.description
      })
    }

    return charts.filter(chart => chart.url && chart.url.trim() !== '')
  }

  static generateEmbedHtml(dashboard: Dashboard): string {
    const {
      title = 'Dune Analytics Dashboard',
      description,
      dashboard_id
    } = dashboard

    // Get chart embed objects instead of just URLs
    const chartEmbeds = this.getAllChartEmbeds(dashboard)

    if (chartEmbeds.length === 0) {
      return this.generateFallbackHtml(dashboard_id)
    }

    // Generate HTML for all chart embeds with individual titles and descriptions
    const embedsHtml = chartEmbeds.map((chart, index) => {
      const iframeId = `dune-embed-${dashboard_id}-${index}-${Date.now()}`
      const chartTitle = chart.title || (chartEmbeds.length > 1 ? `${title} - Chart ${index + 1}` : title)
      const chartDescription = chart.description

      return `
  <div class="dune-embed-wrapper relative w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg overflow-hidden ${index > 0 ? 'mt-6' : ''}">
    ${chartTitle && chartTitle !== title ? `<div class="px-4 pt-4"><h4 class="text-md font-medium text-gray-800 dark:text-gray-200">${this.escapeHtml(chartTitle)}</h4></div>` : ''}
    ${chartDescription ? `<div class="px-4 ${chartTitle && chartTitle !== title ? 'pt-1 pb-3' : 'pt-4 pb-3'}"><p class="text-sm text-gray-600 dark:text-gray-400">${this.escapeHtml(chartDescription)}</p></div>` : ''}
    <div class="dune-embed-loading absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading chart...</span>
      </div>
    </div>
    <iframe
      id="${iframeId}"
      src="${this.escapeHtml(chart.url)}"
      width="100%"
      height="400"
      frameborder="0"
      allowfullscreen
      loading="lazy"
      class="dune-embed-iframe"
      title="${this.escapeHtml(chartTitle)}"
      onload="this.previousElementSibling.style.display='none'"
      style="min-height: 400px;"
    ></iframe>
  </div>`
    }).join('')

    return `
<div class="dune-embed-container my-8" data-dashboard-id="${dashboard_id}">
  ${title ? `<h3 class="dune-embed-title text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">${this.escapeHtml(title)}</h3>` : ''}
  ${description && !chartEmbeds.some(chart => chart.description) ? `<p class="dune-embed-description text-sm text-gray-600 dark:text-gray-400 mb-4">${this.escapeHtml(description)}</p>` : ''}
  ${chartEmbeds.length > 1 ? `<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${chartEmbeds.length} charts</p>` : ''}
  ${embedsHtml}
</div>`.trim()
  }

  static generateFallbackHtml(dashboardId: string): string {
    return `
<div class="dune-embed-error my-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
  <div class="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
    <span class="font-medium">Dashboard Unavailable</span>
  </div>
  <p class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
    The dashboard "<code class="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">${this.escapeHtml(dashboardId)}</code>" is not available or has no embed URL configured.
  </p>
</div>`.trim()
  }

  static escapeHtml(text: string): string {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }
    return this.escapeHtmlServer(text)
  }

  // Server-side HTML escaping (for SSR)
  static escapeHtmlServer(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  static memoizedParse = (() => {
    const cache = new Map<string, PlaceholderMatch[]>()
    const maxCacheSize = 100

    return (content: string): PlaceholderMatch[] => {
      if (cache.has(content)) {
        return cache.get(content)!
      }

      const result = this.parsePlaceholders(content)

      // Implement simple LRU cache
      if (cache.size >= maxCacheSize) {
        const firstKey = cache.keys().next().value
        if (firstKey !== undefined) {
          cache.delete(firstKey)
        }
      }

      cache.set(content, result)
      return result
    }
  })()

  static async parseContent(
    content: string,
    dashboards: Dashboard[]
  ): Promise<ParsedContent> {
    const placeholders = this.memoizedParse(content)
    const processedContent = await this.replacePlaceholders(content, dashboards)

    return {
      content: processedContent,
      placeholders,
      dashboards: dashboards.filter(d =>
        placeholders.some(p => p.dashboardId === d.dashboard_id)
      )
    }
  }

  static getStats(content: string): {
    totalPlaceholders: number
    uniqueDashboards: number
    dashboardIds: string[]
  } {
    const placeholders = this.parsePlaceholders(content)
    const uniqueIds = [...new Set(placeholders.map(p => p.dashboardId))]

    return {
      totalPlaceholders: placeholders.length,
      uniqueDashboards: uniqueIds.length,
      dashboardIds: uniqueIds
    }
  }
}

// Convenience exports
export const parsePlaceholders = DunePlaceholderParser.parsePlaceholders.bind(DunePlaceholderParser)
export const extractDashboardIds = DunePlaceholderParser.extractDashboardIds.bind(DunePlaceholderParser)
export const replacePlaceholders = DunePlaceholderParser.replacePlaceholders.bind(DunePlaceholderParser)
export const validatePlaceholder = DunePlaceholderParser.validatePlaceholder.bind(DunePlaceholderParser)
export const parseContent = DunePlaceholderParser.parseContent.bind(DunePlaceholderParser)