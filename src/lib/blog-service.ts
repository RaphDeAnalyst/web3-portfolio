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
  createdAt?: string
  updatedAt?: string
}

class BlogService {
  private readonly STORAGE_KEY = 'blog_posts'
  private readonly CONTENT_KEY = 'blog_content'

  // Initialize with default posts from data files
  private getDefaultPosts(): BlogPostData[] {
    return [
      // No demo posts - start with a clean slate
      // Add posts through the admin panel or import from blog-posts.ts
    ]
  }

  // Get all blog posts
  getAllPosts(): BlogPostData[] {
    if (typeof window === 'undefined') return this.getDefaultPosts()
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const posts = JSON.parse(stored)
        // Update any old "Data Analyst" author names to "Matthew Raphael"
        const updatedPosts = posts.map((post: BlogPostData) => {
          if (post.author.name === 'Data Analyst') {
            return {
              ...post,
              author: {
                ...post.author,
                name: 'Matthew Raphael'
              }
            }
          }
          return post
        })
        
        // Save updated posts back to localStorage if changes were made
        const hasChanges = posts.some((post: BlogPostData) => post.author.name === 'Data Analyst')
        if (hasChanges) {
          this.savePosts(updatedPosts)
        }
        
        return updatedPosts
      }
    } catch (error) {
      console.error('Error loading blog posts from localStorage:', error)
    }
    
    // Initialize with default posts
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

  // Save posts to localStorage
  private savePosts(posts: BlogPostData[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts))
    } catch (error) {
      console.error('Error saving blog posts to localStorage:', error)
    }
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
      updatedAt: now
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