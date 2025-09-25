import { logger } from './logger'
// GitHub Comments Service
// Fetches comment counts from GitHub Issues API for Utterances-powered comments

interface GitHubIssue {
  number: number
  title: string
  body: string
  comments: number
  state: 'open' | 'closed'
  html_url: string
}

interface CommentCache {
  [key: string]: {
    count: number
    timestamp: number
    url?: string
  }
}

class GitHubCommentsService {
  private readonly REPO_OWNER = 'RaphDeAnalyst'
  private readonly REPO_NAME = 'web3-portfolio'
  private readonly CACHE_KEY = 'github_comments_cache'
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
  private readonly API_BASE = 'https://api.github.com'

  // Get cached comment data
  private getCache(): CommentCache {
    if (typeof window === 'undefined') return {}
    
    try {
      const cached = localStorage.getItem(this.CACHE_KEY)
      return cached ? JSON.parse(cached) : {}
    } catch (error) {
      logger.error('Error reading comment cache:', error)
      return {}
    }
  }

  // Save comment data to cache
  private setCache(cache: CommentCache): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      logger.error('Error saving comment cache:', error)
    }
  }

  // Check if cached data is still valid
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  // Get comment count from cache if valid
  private getCachedCount(slug: string): number | null {
    const cache = this.getCache()
    const cached = cache[slug]
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.count
    }
    
    return null
  }

  // Fetch all Utterances issues from GitHub
  private async fetchUtterancesIssues(): Promise<GitHubIssue[]> {
    // Try multiple approaches to find Utterances issues
    const possibleLabels = ['utterances', 'utterance', '💬 blog-comment']
    let allIssues: GitHubIssue[] = []
    
    // First try with utterances label
    for (const label of possibleLabels) {
      try {
        const url = `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/issues?labels=${encodeURIComponent(label)}&state=all&per_page=100`
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'web3-portfolio-blog'
          }
        })

        if (response.ok) {
          const issues = await response.json()
          logger.info(`Found ${issues.length} issues with label: ${label}`)
          allIssues.push(...issues)
        }
      } catch (error) {
        logger.warn(`Error fetching issues with label ${label}`, error as Error)
      }
    }

    // If no labeled issues found, try to get all issues and filter by content
    if (allIssues.length === 0) {
      logger.info('No labeled issues found, fetching all issues to search for blog comments...')
      
      const url = `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/issues?state=all&per_page=100`
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'web3-portfolio-blog'
        }
      })

      if (response.ok) {
        const issues = await response.json()
        logger.info(`Found ${issues.length} total issues, filtering for blog-related ones...`)
        
        // Filter issues that look like blog comments (contain blog URLs)
        allIssues = issues.filter((issue: GitHubIssue) => 
          issue.body && issue.body.includes('/blog/')
        )
        
        logger.info(`Filtered to ${allIssues.length} blog-related issues`)
      }
    }

    // Log issue details for debugging
    allIssues.forEach(issue => {
      logger.info('GitHub issue details', {
        number: issue.number,
        title: issue.title,
        comments: issue.comments,
        bodyPreview: issue.body.substring(0, 200) + '...'
      })
    })

    return allIssues
  }

  // Extract blog post slug from Utterances issue body
  private extractSlugFromIssue(issue: GitHubIssue): string | null {
    if (!issue.body) return null
    
    // Try multiple patterns for different Utterances formats
    const patterns = [
      // Standard Utterances format: # [Title](https://site.com/blog/slug)
      /https?:\/\/[^\/]+\/blog\/([^)?\s#]+)/,
      // Direct URL: https://site.com/blog/slug
      /\/blog\/([^\/\s#?]+)/,
      // With trailing parameters: /blog/slug?param=value
      /\/blog\/([^\/\s#?]+)(?:[?#]|$)/
    ]
    
    for (const pattern of patterns) {
      const match = issue.body.match(pattern)
      if (match && match[1]) {
        const slug = match[1].replace(/[)#?&].*$/, '').trim()
        logger.info(`Extracted slug "${slug}" from issue #${issue.number}`)
        return slug
      }
    }
    
    logger.info(`Could not extract slug from issue #${issue.number}`, { body: issue.body.substring(0, 100) })
    return null
  }

  // Get comment count for a specific blog post slug
  async getCommentCount(slug: string): Promise<number> {
    logger.info(`Fetching comment count for slug: ${slug}`)
    
    // Check cache first
    const cachedCount = this.getCachedCount(slug)
    if (cachedCount !== null) {
      logger.info(`Using cached count for ${slug}: ${cachedCount}`)
      return cachedCount
    }

    try {
      // Fetch fresh data from GitHub
      logger.info('Fetching fresh data from GitHub API...')
      const issues = await this.fetchUtterancesIssues()
      const cache = this.getCache()
      const now = Date.now()
      
      let foundMatch = false

      // Update cache for all issues
      issues.forEach(issue => {
        const issueSlug = this.extractSlugFromIssue(issue)
        if (issueSlug) {
          logger.info(`Caching slug "${issueSlug}" with ${issue.comments} comments`)
          cache[issueSlug] = {
            count: issue.comments,
            timestamp: now,
            url: issue.html_url
          }
          
          if (issueSlug === slug) {
            foundMatch = true
            logger.info(`✅ Found match for slug "${slug}" with ${issue.comments} comments`)
          }
        }
      })

      // Also cache this specific slug even if no issue found yet
      if (!cache[slug]) {
        logger.info(`No issue found for slug "${slug}", caching as 0 comments`)
        cache[slug] = {
          count: 0,
          timestamp: now
        }
      }

      this.setCache(cache)
      
      const finalCount = cache[slug].count
      logger.info(`Final count for slug "${slug}": ${finalCount}`)
      return finalCount

    } catch (error) {
      logger.error('Error fetching GitHub comments:', error)
      
      // Return cached value even if expired, or 0 if no cache
      const cache = this.getCache()
      const fallbackCount = cache[slug]?.count || 0
      logger.info(`Using fallback count for ${slug}: ${fallbackCount}`)
      return fallbackCount
    }
  }

  // Get formatted comment count string
  async getFormattedCommentCount(slug: string): Promise<string> {
    const count = await this.getCommentCount(slug)
    
    if (count === 0) return '0'
    if (count === 1) return '1'
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1) + 'k'
    return (count / 1000000).toFixed(1) + 'M'
  }

  // Get comment URL for a specific blog post
  getCommentUrl(slug: string): string | null {
    const cache = this.getCache()
    return cache[slug]?.url || null
  }

  // Preload comment counts for multiple posts (batch operation)
  async preloadCommentCounts(slugs: string[]): Promise<void> {
    // Check which slugs need fresh data
    const needsRefresh = slugs.filter(slug => this.getCachedCount(slug) === null)
    
    if (needsRefresh.length === 0) return

    try {
      // Fetch once and update cache for all posts
      await this.fetchUtterancesIssues()
    } catch (error) {
      logger.error('Error preloading comment counts:', error)
    }
  }

  // Clear comment cache (for development/debugging)
  clearCache(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.CACHE_KEY)
    logger.info('GitHub comments cache cleared')
  }

  // Debug: Log current cache contents
  debugCache(): void {
    const cache = this.getCache()
    logger.info('Current GitHub comments cache:', cache)
  }
}

// Export singleton instance
export const githubComments = new GitHubCommentsService()

