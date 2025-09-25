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
    demoUrl: "https://matthewraphael.xyz",
    githubUrl: "https://github.com/matthewraphael/web3-portfolio",
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
