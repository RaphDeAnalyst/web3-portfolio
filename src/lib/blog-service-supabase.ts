import { supabase, isSupabaseAvailable, type Blog } from './supabase'

// Transform Supabase Blog to legacy BlogPostData interface for compatibility
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
  origin?: 'default' | 'user'
}

class BlogServiceSupabase {
  // Transform Supabase Blog to BlogPostData
  private transformToBlogPostData(blog: Blog): BlogPostData {
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      content: blog.content,
      category: blog.category,
      tags: blog.tags,
      author: {
        name: blog.author_name,
        avatar: blog.author_avatar
      },
      date: blog.date,
      readTime: blog.read_time,
      status: blog.status,
      featured: blog.featured,
      featuredImage: blog.featured_image,
      views: blog.views,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
      origin: blog.origin
    }
  }

  // Transform BlogPostData to Supabase Blog format
  private transformToSupabaseBlog(postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>): Partial<Blog> {
    return {
      title: postData.title,
      slug: postData.slug,
      summary: postData.summary,
      content: postData.content,
      category: postData.category,
      tags: postData.tags,
      author_name: postData.author.name,
      author_avatar: postData.author.avatar,
      date: postData.date,
      read_time: postData.readTime,
      status: postData.status,
      featured: postData.featured || false,
      featured_image: postData.featuredImage,
      views: postData.views || 0,
      origin: postData.origin || 'user'
    }
  }

  // Get all blog posts
  async getAllPosts(): Promise<BlogPostData[]> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching blogs from Supabase:', error)
        return []
      }

      return data.map((blog: Blog) => this.transformToBlogPostData(blog))
    } catch (error) {
      console.error('Error in getAllPosts:', error)
      return []
    }
  }

  // Get published posts only
  async getPublishedPosts(): Promise<BlogPostData[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching published blogs:', error)
        return []
      }

      return data.map((blog: Blog) => this.transformToBlogPostData(blog))
    } catch (error) {
      console.error('Error in getPublishedPosts:', error)
      return []
    }
  }

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPostData | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error fetching blog by slug:', error)
        return null
      }

      return this.transformToBlogPostData(data)
    } catch (error) {
      console.error('Error in getPostBySlug:', error)
      return null
    }
  }

  // Get post by ID
  async getPostById(id: string): Promise<BlogPostData | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching blog by ID:', error)
        return null
      }

      return this.transformToBlogPostData(data)
    } catch (error) {
      console.error('Error in getPostById:', error)
      return null
    }
  }

  // Create or update a blog post
  async savePost(postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string): Promise<BlogPostData | null> {
    try {
      // Calculate read time if not provided
      let finalReadTime = postData.readTime
      if (!finalReadTime || finalReadTime === '5 min read') {
        const words = postData.content.split(/\s+/).length
        const calculatedReadTime = Math.max(1, Math.ceil(words / 200))
        finalReadTime = `${calculatedReadTime} min read`
      }

      const blogData = {
        ...this.transformToSupabaseBlog({
          ...postData,
          readTime: finalReadTime,
          origin: 'user' // All saved posts are user-created/modified
        })
      }

      let result

      if (existingId) {
        // Update existing post
        const { data, error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', existingId)
          .select()
          .single()

        if (error) {
          console.error('Error updating blog:', error)
          return null
        }
        result = data
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blogs')
          .insert([blogData])
          .select()
          .single()

        if (error) {
          console.error('Error creating blog:', error)
          return null
        }
        result = data
      }

      return this.transformToBlogPostData(result)
    } catch (error) {
      console.error('Error in savePost:', error)
      return null
    }
  }

  // Get featured blog posts (max 3)
  async getFeaturedPosts(): Promise<BlogPostData[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Error fetching featured posts:', error)
        return []
      }

      return data.map((blog: Blog) => this.transformToBlogPostData(blog))
    } catch (error) {
      console.error('Error in getFeaturedPosts:', error)
      return []
    }
  }

  // Update specific fields of a post (like featured status)
  async updatePostFields(id: string, updates: Partial<Pick<BlogPostData, 'featured' | 'status'>>): Promise<BlogPostData | null> {
    try {
      const updateData: Partial<Blog> = {}
      
      if (updates.featured !== undefined) {
        updateData.featured = updates.featured
      }
      if (updates.status !== undefined) {
        updateData.status = updates.status
      }
      
      // Mark as user-modified
      updateData.origin = 'user'

      const { data, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating blog fields:', error)
        return null
      }

      console.log(`Post field updated and marked as user-owned: ${data.title}`, updates)
      return this.transformToBlogPostData(data)
    } catch (error) {
      console.error('Error in updatePostFields:', error)
      return null
    }
  }

  // Delete a blog post
  async deletePost(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting blog:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deletePost:', error)
      return false
    }
  }

  // Get blog statistics
  async getStats() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('status, category')

      if (error) {
        console.error('Error fetching blog stats:', error)
        return {
          total: 0,
          published: 0,
          drafts: 0,
          categories: 0
        }
      }

      const published = data.filter((p: Blog) => p.status === 'published')
      const drafts = data.filter((p: Blog) => p.status === 'draft')
      const categories = [...new Set(data.map((p: Blog) => p.category))]

      return {
        total: data.length,
        published: published.length,
        drafts: drafts.length,
        categories: categories.length
      }
    } catch (error) {
      console.error('Error in getStats:', error)
      return {
        total: 0,
        published: 0,
        drafts: 0,
        categories: 0
      }
    }
  }

  // Generate unique slug from title
  async generateSlug(title: string, existingId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1

    // Check for duplicates (excluding current post if updating)
    while (true) {
      const { data, error } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', slug)
        .not('id', 'eq', existingId || 'none')

      if (error) {
        console.error('Error checking slug uniqueness:', error)
        break
      }

      if (data.length === 0) {
        break // Slug is unique
      }

      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  // Search posts
  async searchPosts(query: string, category?: string): Promise<BlogPostData[]> {
    try {
      let queryBuilder = supabase.from('blogs').select('*')

      // Apply category filter
      if (category && category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category)
      }

      // Apply search filter
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching blogs:', error)
        return []
      }

      // Filter by tags client-side since Supabase doesn't support array search easily
      let results = data.map((blog: Blog) => this.transformToBlogPostData(blog))
      
      if (query) {
        results = results.filter((post: BlogPostData) =>
          post.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
        )
      }

      return results
    } catch (error) {
      console.error('Error in searchPosts:', error)
      return []
    }
  }

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('category')

      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }

      const categories = [...new Set(data.map((p: Blog) => p.category))] as string[]
      return categories.sort()
    } catch (error) {
      console.error('Error in getCategories:', error)
      return []
    }
  }

  // Increment view count
  async incrementViews(slug: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_blog_views', { blog_slug: slug })
      
      if (error) {
        console.error('Error incrementing views:', error)
      }
    } catch (error) {
      console.error('Error in incrementViews:', error)
    }
  }
}

export const blogServiceSupabase = new BlogServiceSupabase()