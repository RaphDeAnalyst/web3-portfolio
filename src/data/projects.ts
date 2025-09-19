// Portfolio Projects Data
// To add a new project, simply add a new object to this array following the same structure

export interface Project {
  id?: string
  title: string
  description: string
  tech: string[]
  category: string
  status: 'Live' | 'Learning' | 'Complete' | 'Development' | 'Beta'
  demoUrl: string
  githubUrl: string
  duneUrl?: string
  blogPostSlug?: string
  metrics?: Record<string, string>
  features?: string[]
  challenges?: string
  learnings?: string
  featured?: boolean
  timeline?: '2022-2023' | '2024' | '2025'
  phase?: 'Traditional Analytics' | 'Exploratory Phase' | 'Web3 Analytics'
  image?: string
  imageAlt?: string
}

export const projects: Project[] = [
  // Test project to verify tech stack display
  {
    title: "Sample Analytics Dashboard",
    description: "A comprehensive analytics dashboard built with React and TypeScript, featuring real-time data visualization and interactive charts for tracking key performance metrics.",
    tech: ["React", "TypeScript", "Chart.js", "Tailwind CSS", "Next.js", "Supabase"],
    category: "Analytics",
    status: "Live",
    demoUrl: "https://my-new-portfolio.com",
    githubUrl: "https://github.com/matthewraphael/sample-analytics-dashboard",
    metrics: {
      "Users": "1K+",
      "Accuracy": "95%",
      "Performance": "Fast",
      "Uptime": "99.9%"
    },
    challenges: "Building real-time charts that could handle large datasets while maintaining smooth performance.",
    learnings: "Learned advanced React optimization techniques and efficient data handling patterns.",
    featured: true,
    timeline: "2024",
    phase: "Web3 Analytics"
  }
]

// Available categories for projects
export const projectCategories = [
  "All", 
  "Analytics", 
  "Smart Contracts", 
  "Dashboards", 
  "AI x Web3", 
  "DeFi", 
  "Learning"
]

// Template for adding new projects - copy this and fill in your details
export const newProjectTemplate: Project = {
  title: "Your Project Title",
  description: "Detailed description of what you built, what you learned, and the impact/results. Be specific about the problem you solved and your approach.",
  tech: ["Technology1", "Technology2", "Technology3"], // List all technologies used
  category: "Analytics", // Must be one of the categories above
  status: "Learning", // Live, Learning, Complete, Development, or Beta
  demoUrl: "https://example.com", // Link to live demo or "https://example.com" as placeholder
  githubUrl: "https://github.com/user/repo", // Link to GitHub repo or valid placeholder
  metrics: {
    // Add relevant metrics for your project
    // Examples: "timeframe: '2 months'", "accuracy: '85%'", "users: '50+'", etc.
    metric1: "value1",
    metric2: "value2"
  },
  featured: false // Set to true if you want this project highlighted
}