// Blog Posts Data
// To add a new blog post, add a new object to this array and create corresponding content in blog-content.ts

export interface BlogPost {
  title: string
  summary: string
  date: string // Format: "MMM DD, YYYY" (e.g., "Dec 15, 2024")
  readTime: string // Format: "X min read" (e.g., "8 min read")
  tags: string[]
  slug: string // Must be unique, URL-friendly (lowercase, hyphens instead of spaces)
  category: string
  featured?: boolean
  author: {
    name: string
  }
}

export const blogPosts: BlogPost[] = [
  // Add your blog posts here
  // Use the template below or create through the admin panel
]

// Available categories for blog posts
export const blogCategories = [
  "All",
  "Learning", 
  "Analytics", 
  "Web3", 
  "Tutorial", 
  "AI"
]

// Template for adding new blog posts - copy this and fill in your details
export const newBlogPostTemplate: BlogPost = {
  title: "Your Blog Post Title",
  summary: "A compelling 1-2 sentence summary that will appear in the blog list. Make it engaging and descriptive.",
  date: "Dec 25, 2024", // Use format: "MMM DD, YYYY"
  readTime: "5 min read", // Estimate based on content length
  tags: ["Tag1", "Tag2", "Tag3"], // 3-5 relevant tags for search/filtering
  slug: "your-post-url-slug", // Must be unique, lowercase, use hyphens
  category: "Learning", // Must be one of the categories above
  featured: false, // Set to true to feature prominently
  author: { name: "Matthew Raphael" }
}