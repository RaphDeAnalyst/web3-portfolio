import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // We'll handle auth later if needed
  }
})

// Database type definitions
export interface Blog {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  tags: string[]
  author_name: string
  author_avatar?: string
  date: string
  read_time: string
  status: 'draft' | 'published'
  featured: boolean
  featured_image?: string
  views: number
  origin: 'default' | 'user'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  tech_stack: string[]
  status: string
  featured: boolean
  github_url?: string
  demo_url?: string
  dune_url?: string
  blog_post_slug?: string
  image?: string
  metrics?: Record<string, string>
  features?: string[]
  challenges?: string
  learnings?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  name: string
  bio: string
  skills: string[]
  tools: string[]
  values: string[]
  contact_email?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  avatar_url?: string
  resume_url?: string
  story?: string
  updated_at: string
}

export interface Media {
  id: string
  filename: string
  url: string
  type: string
  size: number
  alt_text?: string
  created_at: string
}

export interface Activity {
  id: string
  date: string
  type: string
  title: string
  intensity: number
  created_at: string
}