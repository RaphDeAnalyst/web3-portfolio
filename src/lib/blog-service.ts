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
      {
        id: '1',
        title: "My First Week Learning Dune Analytics",
        summary: "Documenting my journey learning blockchain data analysis through Dune Analytics. From basic SQL queries to creating my first dashboard, here's what I discovered about on-chain data.",
        date: "Dec 20, 2024",
        readTime: "6 min read",
        tags: ["Learning", "Dune-Analytics", "SQL", "Web3", "Beginner"],
        slug: "first-week-learning-dune-analytics",
        category: "Learning",
        featured: true,
        status: 'published',
        author: { name: "Data Analyst", avatar: "/avatar.jpg" },
        content: "# My First Week Learning Dune Analytics\n\nThis week marked an exciting milestone in my Web3 journey as I dove deep into Dune Analytics...",
        createdAt: "2024-12-20T00:00:00.000Z",
        updatedAt: "2024-12-20T00:00:00.000Z"
      },
      {
        id: '2',
        title: "Python for Blockchain Data: My Learning Path",
        summary: "How I'm applying my existing Python skills to blockchain data analysis. From Web3.py to pandas manipulation of on-chain data, here's my structured approach to learning.",
        date: "Dec 15, 2024",
        readTime: "8 min read",
        tags: ["Python", "Web3", "Learning", "Data-Analysis", "Blockchain"],
        slug: "python-blockchain-data-learning-path",
        category: "Learning",
        status: 'published',
        author: { name: "Data Analyst", avatar: "/avatar.jpg" },
        content: "# Python for Blockchain Data: My Learning Path\n\nTransitioning from traditional data analysis to blockchain data has been an exciting challenge...",
        createdAt: "2024-12-15T00:00:00.000Z",
        updatedAt: "2024-12-15T00:00:00.000Z"
      },
      {
        id: '3',
        title: "Traditional Data Analytics vs Web3: What's Different?",
        summary: "A comparison of traditional data analytics and Web3 analytics from someone transitioning between them. Key differences in data sources, tools, and analytical approaches.",
        date: "Dec 10, 2024",
        readTime: "10 min read",
        tags: ["Web3", "Analytics", "Comparison", "Traditional-Finance", "Career-Transition"],
        slug: "traditional-vs-web3-data-analytics",
        category: "Analytics",
        featured: true,
        status: 'published',
        author: { name: "Data Analyst", avatar: "/avatar.jpg" },
        content: "# Traditional Data Analytics vs Web3: What's Different?\n\nHaving worked in traditional finance data analytics for several years...",
        createdAt: "2024-12-10T00:00:00.000Z",
        updatedAt: "2024-12-10T00:00:00.000Z"
      }
    ]
  }

  // Get all blog posts
  getAllPosts(): BlogPostData[] {
    if (typeof window === 'undefined') return this.getDefaultPosts()
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
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
}

export const blogService = new BlogService()