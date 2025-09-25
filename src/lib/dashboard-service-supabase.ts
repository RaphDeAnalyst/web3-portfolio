import { supabase, isSupabaseAvailable } from './supabase'
import { logger } from './logger'
import type { Dashboard, CreateDashboardInput, UpdateDashboardInput, ChartEmbed } from '../types/dashboard'

export class DashboardServiceSupabase {
  async getAllDashboards(): Promise<Dashboard[]> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning empty dashboard list')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        logger.error('Error fetching dashboards:', error)
        throw new Error(`Failed to fetch dashboards: ${error.message}`)
      }

      // Get initial results
      let result = data || []

      // Apply featured-first sorting (same logic as getDashboardsWithEmbeds)
      result = result.sort((a: Dashboard, b: Dashboard) => {
        // Convert undefined featured to false for consistent comparison
        const aFeatured = a.featured === true
        const bFeatured = b.featured === true

        // First, sort by featured status (featured items first)
        if (aFeatured !== bFeatured) {
          return aFeatured ? -1 : 1 // if a is featured, it comes first (negative), if b is featured, it comes first (positive)
        }

        // Then, sort by sort_order within each group (ascending)
        const aOrder = a.sort_order ?? 999999 // treat null/undefined as very high number
        const bOrder = b.sort_order ?? 999999

        // If both have the same sort_order, sort by title alphabetically for consistency
        if (aOrder === bOrder) {
          return a.title.localeCompare(b.title)
        }

        return aOrder - bOrder
      })


      return result
    } catch (error) {
      logger.error('Error in getAllDashboards:', error)
      throw error
    }
  }

  async getActiveDashboards(): Promise<Dashboard[]> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning empty dashboard list')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        logger.error('Error fetching active dashboards:', error)
        throw new Error(`Failed to fetch active dashboards: ${error.message}`)
      }

      return data || []
    } catch (error) {
      logger.error('Error in getActiveDashboards:', error)
      throw error
    }
  }

  async getDashboardByKey(dashboardId: string): Promise<Dashboard | null> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning null dashboard')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('dashboard_id', dashboardId)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        logger.error('Error fetching dashboard by key:', error)
        throw new Error(`Failed to fetch dashboard: ${error.message}`)
      }

      return data
    } catch (error) {
      logger.error('Error in getDashboardByKey:', error)
      throw error
    }
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning null dashboard')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        logger.error('Error fetching dashboard by ID:', error)
        throw new Error(`Failed to fetch dashboard: ${error.message}`)
      }

      return data
    } catch (error) {
      logger.error('Error in getDashboardById:', error)
      throw error
    }
  }

  async createDashboard(dashboardData: CreateDashboardInput): Promise<Dashboard> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      // Validate embed URL if provided
      if (dashboardData.embed_url && !this.validateEmbedUrl(dashboardData.embed_url)) {
        throw new Error('Invalid embed URL. Must be from dune.com or dune.xyz with /embeds/ path')
      }

      // Validate embed URLs array if provided
      if (dashboardData.embed_urls && Array.isArray(dashboardData.embed_urls) && dashboardData.embed_urls.length > 0 && !this.validateEmbedUrls(dashboardData.embed_urls)) {
        throw new Error('Invalid embed URLs. All URLs must be from dune.com or dune.xyz with /embeds/ path')
      }

      const { data, error } = await supabase
        .from('dashboards')
        .insert([dashboardData])
        .select('*')
        .single()

      if (error) {
        logger.error('Error creating dashboard:', {
          error,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          dashboardData
        })
        throw new Error(`Failed to create dashboard: ${error.message} (Code: ${error.code})`)
      }

      logger.info('Dashboard created successfully', { id: data.id })
      return data
    } catch (error) {
      logger.error('Error in createDashboard:', error)
      throw error
    }
  }

  async updateDashboard(updateData: UpdateDashboardInput): Promise<Dashboard> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      // Validate embed URL if provided
      if (updateData.embed_url && !this.validateEmbedUrl(updateData.embed_url)) {
        throw new Error('Invalid embed URL. Must be from dune.com or dune.xyz with /embeds/ path')
      }

      // Validate embed URLs array if provided
      if (updateData.embed_urls && Array.isArray(updateData.embed_urls) && updateData.embed_urls.length > 0 && !this.validateEmbedUrls(updateData.embed_urls)) {
        throw new Error('Invalid embed URLs. All URLs must be from dune.com or dune.xyz with /embeds/ path')
      }

      const { id, ...updateFields } = updateData
      const { data, error } = await supabase
        .from('dashboards')
        .update({
          ...updateFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        logger.error('Error updating dashboard:', error)
        throw new Error(`Failed to update dashboard: ${error.message}`)
      }

      logger.info('Dashboard updated successfully', { id })
      return data
    } catch (error) {
      logger.error('Error in updateDashboard:', error)
      throw error
    }
  }

  async deleteDashboard(id: string): Promise<boolean> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', id)

      if (error) {
        logger.error('Error deleting dashboard:', error)
        throw new Error(`Failed to delete dashboard: ${error.message}`)
      }

      logger.info('Dashboard deleted successfully', { id })
      return true
    } catch (error) {
      logger.error('Error in deleteDashboard:', error)
      throw error
    }
  }

  async getDashboardsByCategory(category: string): Promise<Dashboard[]> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning empty dashboard list')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        logger.error('Error fetching dashboards by category:', error)
        throw new Error(`Failed to fetch dashboards: ${error.message}`)
      }

      return data || []
    } catch (error) {
      logger.error('Error in getDashboardsByCategory:', error)
      throw error
    }
  }

  async getDashboardsWithEmbeds(bustCache = false): Promise<Dashboard[]> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning empty dashboard list')
      return []
    }

    try {
      // Build query step by step to ensure no accidental featured filtering
      let query = supabase
        .from('dashboards')
        .select('*')

      // Explicitly filter for active dashboards
      query = query.eq('is_active', true)

      // Filter for dashboards with embed URLs (legacy embed_url OR new embed_urls)
      query = query.or('embed_url.not.is.null,embed_urls.not.is.null')

      // Explicitly include both featured AND non-featured dashboards
      // (no featured filter at all)

      // Order by sort_order only - featured sorting will be handled client-side
      // (Supabase boolean ordering can be unreliable with NULL/undefined values)
      query = query.order('sort_order', { ascending: true })

      // Add cache-busting parameter when requested (for fresh data after updates)
      if (bustCache) {
        // Force a fresh query by adding a timestamp-based filter that doesn't affect results
        const cacheKey = `cache_bust_${Date.now()}`
        logger.info(`Cache-busting dashboard query: ${cacheKey}`)
        query = query.limit(1000).offset(0)
      }

      const { data, error } = await query

      if (error) {
        logger.error('Error fetching dashboards with embeds:', error)
        throw new Error(`Failed to fetch dashboards: ${error.message}`)
      }

      // Get initial results
      let result = data || []

      // Client-side sorting to ensure proper featured/sort_order handling
      // This handles undefined featured values and provides consistent sorting
      result = result.sort((a: Dashboard, b: Dashboard) => {
        // Convert undefined featured to false for consistent comparison
        const aFeatured = a.featured === true
        const bFeatured = b.featured === true

        // First, sort by featured status (featured items first)
        if (aFeatured !== bFeatured) {
          return aFeatured ? -1 : 1 // if a is featured, it comes first (negative), if b is featured, it comes first (positive)
        }

        // Then, sort by sort_order within each group (ascending)
        const aOrder = a.sort_order ?? 999999 // treat null/undefined as very high number
        const bOrder = b.sort_order ?? 999999

        // If both have the same sort_order, sort by title alphabetically for consistency
        if (aOrder === bOrder) {
          return a.title.localeCompare(b.title)
        }

        return aOrder - bOrder
      })


      return result
    } catch (error) {
      logger.error('Error in getDashboardsWithEmbeds:', error)
      throw error
    }
  }

  async searchDashboards(query: string, category?: string): Promise<Dashboard[]> {
    if (!isSupabaseAvailable()) {
      logger.warn('Supabase not available, returning empty dashboard list')
      return []
    }

    try {
      let queryBuilder = supabase
        .from('dashboards')
        .select('*')
        .eq('is_active', true)

      // Add text search
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
        )
      }

      // Add category filter
      if (category) {
        queryBuilder = queryBuilder.eq('category', category)
      }

      const { data, error } = await queryBuilder.order('sort_order', { ascending: true })

      if (error) {
        logger.error('Error searching dashboards:', error)
        throw new Error(`Failed to search dashboards: ${error.message}`)
      }

      return data || []
    } catch (error) {
      logger.error('Error in searchDashboards:', error)
      throw error
    }
  }

  validateEmbedUrl(url: string): boolean {
    try {
      const parsed = new URL(url)
      const allowedDomains = ['dune.com', 'dune.xyz']
      const requiredPathPrefix = '/embeds/'

      return allowedDomains.includes(parsed.hostname) &&
             parsed.pathname.startsWith(requiredPathPrefix)
    } catch {
      return false
    }
  }

  validateEmbedUrls(urls: string[] | ChartEmbed[]): boolean {
    if (!Array.isArray(urls)) return false

    return urls.every(item => {
      if (typeof item === 'string') {
        return this.validateEmbedUrl(item)
      } else if (typeof item === 'object' && item !== null && 'url' in item) {
        return this.validateEmbedUrl(item.url)
      }
      return false
    })
  }

  // Helper method to get all embed URLs from a dashboard (legacy + new format)
  getAllEmbedUrls(dashboard: Dashboard): string[] {
    const urls: string[] = []

    // Prioritize new multiple embed URLs if exists
    if (dashboard.embed_urls && Array.isArray(dashboard.embed_urls) && dashboard.embed_urls.length > 0) {
      dashboard.embed_urls.forEach(item => {
        if (typeof item === 'string') {
          urls.push(item)
        } else if (typeof item === 'object' && item !== null && 'url' in item) {
          urls.push(item.url)
        }
      })
    }
    // Fallback to legacy single embed URL only if no embed_urls array
    else if (dashboard.embed_url && typeof dashboard.embed_url === 'string') {
      urls.push(dashboard.embed_url)
    }

    return urls.filter(url => url && url.trim() !== '')
  }

  // Helper method to check if dashboard has any embed URLs
  hasEmbedUrls(dashboard: Dashboard): boolean {
    // Prioritize embed_urls array over legacy embed_url
    if (dashboard.embed_urls && Array.isArray(dashboard.embed_urls) && dashboard.embed_urls.length > 0) {
      // Check if any chart has a valid URL
      return dashboard.embed_urls.some(item => {
        if (typeof item === 'string') {
          return item.trim() !== ''
        } else if (typeof item === 'object' && item !== null && 'url' in item) {
          return item.url && item.url.trim() !== ''
        }
        return false
      })
    }
    return !!(dashboard.embed_url && dashboard.embed_url.trim() !== '')
  }

  // Helper method to get all ChartEmbed objects from a dashboard
  getAllChartEmbeds(dashboard: Dashboard): ChartEmbed[] {
    const charts: ChartEmbed[] = []

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
          charts.push(item as ChartEmbed)
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

  async updateEmbedUrl(id: string, embedUrl: string): Promise<void> {
    if (!this.validateEmbedUrl(embedUrl)) {
      throw new Error('Invalid embed URL. Must be from dune.com or dune.xyz with /embeds/ path')
    }

    await this.updateDashboard({ id, embed_url: embedUrl })
  }

  async compactSortOrders(featured: boolean): Promise<void> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      // Get all dashboards in the specified group
      const allDashboards = await this.getAllDashboards()
      const groupDashboards = allDashboards.filter((d: Dashboard) =>
        featured ? d.featured === true : d.featured !== true
      )

      // Sort by current sort_order to maintain relative positioning
      const sortedDashboards = groupDashboards.sort((a, b) => {
        const aOrder = a.sort_order ?? 999999
        const bOrder = b.sort_order ?? 999999
        return aOrder - bOrder
      })

      // Reassign sort_order as continuous sequence: 0, 1, 2, 3...
      const updates = sortedDashboards.map((dashboard, index) => ({
        id: dashboard.id,
        sort_order: index
      }))

      // Batch update all dashboards in this group
      for (const update of updates) {
        await supabase
          .from('dashboards')
          .update({
            sort_order: update.sort_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id)
      }

      logger.info(`Compacted sort orders for ${featured ? 'featured' : 'non-featured'} group`, {
        groupType: featured ? 'featured' : 'non-featured',
        updatedCount: updates.length,
        newSequence: updates.map(u => u.sort_order)
      })
    } catch (error) {
      logger.error('Error compacting sort orders:', error)
      throw error
    }
  }

  async getStats(): Promise<{
    total: number
    active: number
    withEmbeds: number
    categories: Record<string, number>
  }> {
    if (!isSupabaseAvailable()) {
      return { total: 0, active: 0, withEmbeds: 0, categories: {} }
    }

    try {
      const [totalResult, activeResult, embedsResult, allDashboards] = await Promise.all([
        supabase.from('dashboards').select('id', { count: 'exact', head: true }),
        supabase.from('dashboards').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('dashboards').select('id', { count: 'exact', head: true }).or('embed_url.not.is.null,embed_urls.not.is.null'),
        supabase.from('dashboards').select('category').eq('is_active', true)
      ])

      const categories: Record<string, number> = {}
      if (allDashboards.data) {
        allDashboards.data.forEach((dashboard: any) => {
          if (dashboard.category) {
            categories[dashboard.category] = (categories[dashboard.category] || 0) + 1
          }
        })
      }

      return {
        total: totalResult.count || 0,
        active: activeResult.count || 0,
        withEmbeds: embedsResult.count || 0,
        categories
      }
    } catch (error) {
      logger.error('Error getting dashboard stats:', error)
      return { total: 0, active: 0, withEmbeds: 0, categories: {} }
    }
  }
}

export const dashboardServiceSupabase = new DashboardServiceSupabase()