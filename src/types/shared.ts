// Shared types to avoid importing Supabase types in non-admin routes

export interface Project {
  id?: string
  title: string
  description: string
  image?: string
  tech: string[]
  category: string
  status: 'Live' | 'Development' | 'Beta' | 'Completed' | 'Learning' | 'Complete'
  demoUrl?: string
  githubUrl?: string
  duneUrl?: string
  blogPostSlug?: string
  metrics?: Record<string, string>
  features?: string[]
  challenges?: string
  learnings?: string
  featured?: boolean
  timeline?: '2022-2023' | '2024' | '2025'
  phase?: 'Traditional Analytics' | 'Exploratory Phase' | 'Web3 Analytics'
  featuredCount?: number
  onImageClick?: () => void
}

export interface ProfileData {
  id?: string
  name: string
  email?: string
  avatar?: string
  bio?: string
  title?: string
  location?: string
  website?: string
  github?: string
  twitter?: string
  linkedin?: string
  resume?: string
  story?: string
  skills?: string[] | null
  tools?: string[]
  values?: string[]
  experience?: ExperienceItem[]
  education?: EducationItem[]
  created_at?: string
  updated_at?: string
}

export interface ExperienceItem {
  title: string
  company: string
  startDate: string
  endDate?: string
  description: string
  skills?: string[]
}

export interface EducationItem {
  degree: string
  school: string
  year: string
  description?: string
}

export interface SocialLink {
  name: string
  url: string
  icon?: React.ReactNode
}

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