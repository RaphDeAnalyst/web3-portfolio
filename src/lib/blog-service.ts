// Blog Post Management Service
// Handles CRUD operations for blog posts using localStorage for persistence

export interface BlogPostData {
  id?: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  date: string
  readTime: string
  status: 'draft' | 'published'
  featured?: boolean
  featuredImage?: string
  views?: number
  lastViewedAt?: string
  createdAt?: string
  updatedAt?: string
  origin?: 'default' | 'user' // Track whether post is default or user-created
}

class BlogService {
  private readonly STORAGE_KEY = 'blog_posts'
  private readonly CONTENT_KEY = 'blog_content'
  private readonly BACKUP_KEY = 'blog_posts_backup'
  private readonly METADATA_KEY = 'blog_metadata'

  // Initialize with default posts from data files
  private getDefaultPosts(): BlogPostData[] {
    return [
      {
        id: 'blockchain-the-backbone-of-the-digital-revolution',
        title: 'Blockchain: The Backbone of the Digital Revolution',
        slug: 'blockchain-the-backbone-of-the-digital-revolution',
        summary: 'Blockchain is a decentralized, secure digital ledger technology that enables transparent, secure, and immutable record-keeping across distributed networks.',
        content: `# Blockchain: The Backbone of the Digital Revolution

Blockchain technology has emerged as one of the most revolutionary innovations of our time. At its core, blockchain is a decentralized, secure digital ledger that enables transparent, secure, and immutable record-keeping across distributed networks.

## What is Blockchain?

A blockchain is essentially a chain of blocks, where each block contains a collection of transactions or data. What makes it unique is that it's distributed across multiple computers (nodes) in a network, making it virtually impossible to hack or manipulate.

## Key Features

### Decentralization
Unlike traditional systems that rely on a central authority, blockchain distributes control across the entire network.

### Security
Advanced cryptographic techniques ensure that data cannot be altered once it's been recorded.

### Transparency
All transactions are visible to network participants, creating unprecedented transparency.

## Applications Beyond Cryptocurrency

While most people know blockchain through Bitcoin and other cryptocurrencies, the technology has applications in:

- Supply chain management
- Healthcare records
- Voting systems
- Digital identity verification
- Smart contracts

## The Future of Web3

As we move towards a more decentralized internet (Web3), blockchain technology will continue to play a crucial role in reshaping how we interact, transact, and share information online.

The potential is limitless, and we're just scratching the surface of what's possible with this revolutionary technology.`,
        category: 'Web3',
        tags: ['Blockchain', 'Web3', 'Decentralization', 'Technology'],
        author: {
          name: 'Matthew Raphael',
          avatar: '/avatar.jpg'
        },
        date: '2025-09-11',
        readTime: '5 min read',
        status: 'published' as const,
        featured: false,
        featuredImage: undefined,
        createdAt: '2025-09-11T00:00:00.000Z',
        updatedAt: '2025-09-11T00:00:00.000Z',
        origin: 'default' as const
      }
    ]
  }

  // Smart merge function to combine existing posts with defaults
  private mergePostsWithDefaults(existingPosts: BlogPostData[]): BlogPostData[] {
    const defaultPosts = this.getDefaultPosts()
    const merged = [...existingPosts]
    
    // Add default posts only if they don't exist or if they're default posts that need updating
    defaultPosts.forEach(defaultPost => {
      const existingIndex = merged.findIndex(post => 
        post.id === defaultPost.id || post.slug === defaultPost.slug
      )
      
      if (existingIndex === -1) {
        // Default post doesn't exist, add it
        merged.push(defaultPost)
      } else {
        // Default post exists - check if we should preserve user modifications
        const existingPost = merged[existingIndex]
        
        // If post has been modified by user (origin=user) or if it's a default post that was edited, preserve it
        if (existingPost.origin === 'user') {
          // User-created or user-modified post - NEVER overwrite
          console.log(`Preserving user-modified post: ${existingPost.title}`)
          // Leave it completely alone
        } else if (existingPost.origin === 'default') {
          // This is still a default post, but preserve any user changes to featured/status
          // Only update content/metadata, never user-controlled fields
          console.log(`Updating default post metadata while preserving user settings: ${existingPost.title}`)
          merged[existingIndex] = {
            ...defaultPost,
            // Always preserve user-controlled fields from existing post
            featured: existingPost.featured,
            status: existingPost.status,
            // Keep existing updatedAt to show when user last modified it
            updatedAt: existingPost.updatedAt
          }
        }
      }
    })
    
    return merged
  }

  // Get all blog posts
  getAllPosts(): BlogPostData[] {
    if (typeof window === 'undefined') return this.getDefaultPosts()
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const posts = JSON.parse(stored)
        
        // Migrate old posts without origin field
        const migratedPosts = posts.map((post: BlogPostData) => {
          let updatedPost = { ...post }
          
          // Add origin field if missing
          if (!post.origin) {
            // If it matches a default post ID/slug, mark as default, otherwise as user
            const defaultPosts = this.getDefaultPosts()
            const isDefault = defaultPosts.some(dp => dp.id === post.id || dp.slug === post.slug)
            updatedPost.origin = isDefault ? 'default' : 'user'
          }
          
          // Update any old "Data Analyst" author names to "Matthew Raphael"
          if (post.author.name === 'Data Analyst') {
            updatedPost = {
              ...updatedPost,
              author: {
                ...updatedPost.author,
                name: 'Matthew Raphael'
              }
            }
          }
          
          return updatedPost
        })
        
        // Merge with defaults to ensure default posts are available
        const finalPosts = this.mergePostsWithDefaults(migratedPosts)
        
        // Save if migrations were applied
        const needsSave = posts.some((post: BlogPostData) => 
          !post.origin || post.author.name === 'Data Analyst'
        ) || finalPosts.length !== migratedPosts.length
        
        if (needsSave) {
          this.savePosts(finalPosts)
        }
        
        return finalPosts
      }
    } catch (error) {
      console.error('Error loading blog posts from localStorage:', error)
    }
    
    // When no localStorage data exists, start with defaults but don't overwrite any existing state
    // This handles first-time setup without being destructive to cleared cache scenarios
    console.warn('No blog posts found in localStorage - initializing with defaults')
    const defaultPosts = this.getDefaultPosts()
    this.savePosts(defaultPosts)
    return defaultPosts
  }

  // Get published posts only
  getPublishedPosts(): BlogPostData[] {
    return this.getAllPosts().filter(post => post.status === 'published')
  }

  // Get post by slug
  getPostBySlug(slug: string): BlogPostData | null {
    const posts = this.getAllPosts()
    return posts.find(post => post.slug === slug) || null
  }

  // Get post by ID
  getPostById(id: string): BlogPostData | null {
    const posts = this.getAllPosts()
    return posts.find(post => post.id === id) || null
  }

  // Save posts to localStorage with backup
  private savePosts(posts: BlogPostData[]): void {
    if (typeof window === 'undefined') return
    
    try {
      // Save main data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts))
      
      // Create backup of user posts only
      const userPosts = posts.filter(p => p.origin === 'user')
      if (userPosts.length > 0) {
        localStorage.setItem(this.BACKUP_KEY, JSON.stringify(userPosts))
        
        // Update metadata
        const metadata = {
          lastBackup: new Date().toISOString(),
          userPostCount: userPosts.length,
          totalPostCount: posts.length
        }
        localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata))
      }
    } catch (error) {
      console.error('Error saving blog posts to localStorage:', error)
    }
  }

  // Detect if cache was lost and attempt recovery
  private detectAndRecoverFromCacheLoss(): BlogPostData[] | null {
    if (typeof window === 'undefined') return null
    
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY)
      const metadata = localStorage.getItem(this.METADATA_KEY)
      
      if (backup && metadata) {
        const userPosts = JSON.parse(backup)
        const meta = JSON.parse(metadata)
        
        console.warn(`Cache loss detected! Recovering ${userPosts.length} user posts from backup (last backup: ${meta.lastBackup})`)
        
        // Merge recovered user posts with current defaults
        return this.mergePostsWithDefaults(userPosts)
      }
    } catch (error) {
      console.error('Error during cache recovery:', error)
    }
    
    return null
  }

  // Create or update a blog post
  savePost(postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string): BlogPostData {
    const posts = this.getAllPosts()
    const now = new Date().toISOString()

    // Use provided read time or calculate if not provided
    let finalReadTime = postData.readTime
    if (!finalReadTime || finalReadTime === '5 min read') {
      const words = postData.content.split(/\s+/).length
      const calculatedReadTime = Math.max(1, Math.ceil(words / 200))
      finalReadTime = `${calculatedReadTime} min read`
    }

    const post: BlogPostData = {
      ...postData,
      id: existingId || Date.now().toString(),
      readTime: finalReadTime,
      createdAt: now,
      updatedAt: now,
      origin: 'user' // All saved posts are user-created/modified
    }

    if (existingId) {
      // Update existing post
      const index = posts.findIndex(p => p.id === existingId)
      if (index !== -1) {
        post.createdAt = posts[index].createdAt || now
        posts[index] = post
      } else {
        posts.push(post)
      }
    } else {
      // Create new post
      posts.unshift(post) // Add to beginning
    }

    this.savePosts(posts)
    return post
  }

  // Get featured blog posts (max 3)
  getFeaturedPosts(): BlogPostData[] {
    return this.getPublishedPosts()
      .filter(post => post.featured)
      .slice(0, 3)
  }

  // Update specific fields of a post (like featured status) and mark as user-modified
  updatePostFields(id: string, updates: Partial<Pick<BlogPostData, 'featured' | 'status'>>): BlogPostData | null {
    const posts = this.getAllPosts()
    const index = posts.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    const existingPost = posts[index]
    const updatedPost = {
      ...existingPost,
      ...updates,
      updatedAt: new Date().toISOString(),
      origin: 'user' as const // Mark as user-modified
    }
    
    posts[index] = updatedPost
    this.savePosts(posts)
    
    console.log(`Post field updated and marked as user-owned: ${updatedPost.title}`, updates)
    return updatedPost
  }

  // Delete a blog post
  deletePost(id: string): boolean {
    const posts = this.getAllPosts()
    const index = posts.findIndex(post => post.id === id)
    
    if (index !== -1) {
      posts.splice(index, 1)
      this.savePosts(posts)
      return true
    }
    
    return false
  }

  // Get blog statistics
  getStats() {
    const posts = this.getAllPosts()
    const published = posts.filter(p => p.status === 'published')
    const drafts = posts.filter(p => p.status === 'draft')
    const categories = [...new Set(posts.map(p => p.category))]

    return {
      total: posts.length,
      published: published.length,
      drafts: drafts.length,
      categories: categories.length
    }
  }

  // Generate unique slug from title
  generateSlug(title: string, existingId?: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const posts = this.getAllPosts()
    let slug = baseSlug
    let counter = 1

    // Check for duplicates (excluding current post if updating)
    while (posts.some(post => post.slug === slug && post.id !== existingId)) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  // Search posts
  searchPosts(query: string, category?: string): BlogPostData[] {
    const posts = this.getAllPosts()
    
    return posts.filter(post => {
      const matchesSearch = query === '' || 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesCategory = !category || category === 'all' || post.category === category

      return matchesSearch && matchesCategory
    })
  }

  // Get available categories
  getCategories(): string[] {
    const posts = this.getAllPosts()
    const categories = [...new Set(posts.map(p => p.category))]
    return categories.sort()
  }

  // Reset to clean state (for clearing demo data)
  resetToCleanState(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.CONTENT_KEY)
      console.log('Blog data reset to clean state')
    } catch (error) {
      console.error('Error resetting blog data:', error)
    }
  }
}

export const blogService = new BlogService()