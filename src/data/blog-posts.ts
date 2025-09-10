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
  {
    title: "My First Week Learning Dune Analytics",
    summary: "Documenting my journey learning blockchain data analysis through Dune Analytics. From basic SQL queries to creating my first dashboard, here's what I discovered about on-chain data.",
    date: "Dec 20, 2024",
    readTime: "6 min read",
    tags: ["Learning", "Dune-Analytics", "SQL", "Web3", "Beginner"],
    slug: "first-week-learning-dune-analytics",
    category: "Learning",
    featured: true,
    author: { name: "Matthew Raphael" }
  },
  {
    title: "Python for Blockchain Data: My Learning Path",
    summary: "How I'm applying my existing Python skills to blockchain data analysis. From Web3.py to pandas manipulation of on-chain data, here's my structured approach to learning.",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    tags: ["Python", "Web3", "Learning", "Data-Analysis", "Blockchain"],
    slug: "python-blockchain-data-learning-path",
    category: "Learning",
    author: { name: "Matthew Raphael" }
  },
  {
    title: "Traditional Data Analytics vs Web3: What's Different?",
    summary: "A comparison of traditional data analytics and Web3 analytics from someone transitioning between them. Key differences in data sources, tools, and analytical approaches.",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    tags: ["Web3", "Analytics", "Comparison", "Traditional-Finance", "Career-Transition"],
    slug: "traditional-vs-web3-data-analytics",
    category: "Analytics",
    featured: true,
    author: { name: "Matthew Raphael" }
  },
  {
    title: "Solidity Basics: A Data Analyst's Perspective",
    summary: "Learning Solidity fundamentals while coming from a data background. How understanding smart contracts helps with better blockchain data analysis.",
    date: "Dec 5, 2024",
    readTime: "7 min read",
    tags: ["Solidity", "Smart-Contracts", "Learning", "Data-Analysis", "Web3"],
    slug: "solidity-basics-data-analyst-perspective",
    category: "Web3",
    author: { name: "Matthew Raphael" }
  },
  {
    title: "Building My First Crypto Portfolio Tracker",
    summary: "Step-by-step guide to building a personal cryptocurrency portfolio tracker using Python and Excel. Includes live price fetching and performance calculations.",
    date: "Nov 28, 2024",
    readTime: "12 min read",
    tags: ["Python", "Portfolio", "Crypto", "Excel", "Tutorial"],
    slug: "building-first-crypto-portfolio-tracker",
    category: "Tutorial",
    author: { name: "Matthew Raphael" }
  },
  {
    title: "Statistical Analysis in DeFi: APY vs Reality",
    summary: "Applying statistical analysis to DeFi yield farming data. How to evaluate risk-adjusted returns and identify sustainable vs unsustainable yield opportunities.",
    date: "Nov 20, 2024",
    readTime: "9 min read",
    tags: ["DeFi", "Statistics", "APY", "Risk-Analysis", "Yield-Farming"],
    slug: "statistical-analysis-defi-apy-reality",
    category: "Analytics",
    author: { name: "Matthew Raphael" }
  }
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