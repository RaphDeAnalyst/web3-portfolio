// View Tracking Service
// Handles view count tracking using localStorage for persistence

interface ViewData {
  count: number
  lastViewed: string
  sessionViewed?: boolean
}

class ViewTrackingService {
  private readonly VIEWS_STORAGE_KEY = 'blog_post_views'
  private readonly SESSION_KEY = 'view_session'

  // Get view count for a specific post
  getViewCount(slug: string): number {
    const views = this.getAllViews()
    return views[slug]?.count || 0
  }

  // Get all view data
  private getAllViews(): Record<string, ViewData> {
    if (typeof window === 'undefined') return {}
    
    try {
      const stored = localStorage.getItem(this.VIEWS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error reading view data:', error)
      return {}
    }
  }

  // Save all view data
  private saveViews(views: Record<string, ViewData>): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.VIEWS_STORAGE_KEY, JSON.stringify(views))
    } catch (error) {
      console.error('Error saving view data:', error)
    }
  }

  // Check if this post was already viewed in this session
  private wasViewedInSession(slug: string): boolean {
    if (typeof window === 'undefined') return false

    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY)
      const viewedPosts = sessionData ? JSON.parse(sessionData) : []
      return viewedPosts.includes(slug)
    } catch (error) {
      return false
    }
  }

  // Mark post as viewed in this session
  private markViewedInSession(slug: string): void {
    if (typeof window === 'undefined') return

    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY)
      const viewedPosts = sessionData ? JSON.parse(sessionData) : []
      
      if (!viewedPosts.includes(slug)) {
        viewedPosts.push(slug)
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(viewedPosts))
      }
    } catch (error) {
      console.error('Error marking session view:', error)
    }
  }

  // Increment view count for a post (with session throttling)
  incrementView(slug: string): number {
    // Don't count multiple views in the same session
    if (this.wasViewedInSession(slug)) {
      return this.getViewCount(slug)
    }

    const views = this.getAllViews()
    const currentData = views[slug] || { count: 0, lastViewed: '', sessionViewed: false }
    
    // Increment the count
    const newData: ViewData = {
      count: currentData.count + 1,
      lastViewed: new Date().toISOString(),
      sessionViewed: true
    }
    
    views[slug] = newData
    this.saveViews(views)
    
    // Mark as viewed in this session
    this.markViewedInSession(slug)
    
    return newData.count
  }

  // Get view count with formatted number (e.g., 1.2k, 1.5M)
  getFormattedViewCount(slug: string): string {
    const count = this.getViewCount(slug)
    
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1) + 'k'
    return (count / 1000000).toFixed(1) + 'M'
  }

  // Admin: Reset views for a post
  resetViews(slug: string): void {
    const views = this.getAllViews()
    delete views[slug]
    this.saveViews(views)
  }

  // Admin: Set custom view count
  setViewCount(slug: string, count: number): void {
    const views = this.getAllViews()
    views[slug] = {
      count: Math.max(0, count),
      lastViewed: new Date().toISOString()
    }
    this.saveViews(views)
  }

  // Get all posts with their view counts (for admin dashboard)
  getAllPostViews(): Array<{ slug: string; count: number; lastViewed: string }> {
    const views = this.getAllViews()
    return Object.entries(views).map(([slug, data]) => ({
      slug,
      count: data.count,
      lastViewed: data.lastViewed
    }))
  }
}

// Export singleton instance
export const viewTracker = new ViewTrackingService()