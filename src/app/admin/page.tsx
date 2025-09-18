'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  FileText,
  Rocket,
  Star,
  Award,
  RefreshCw,
  Plus,
  Upload,
  Calendar,
  User
} from 'lucide-react'
import { logger } from '@/lib/logger'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProjects: 0,
    featuredPosts: 0,
    featuredProjects: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    // Load stats using the service switcher
    const loadStats = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { blogService, projectService } = await import('@/lib/service-switcher')
        const [blogPosts, projects] = await Promise.all([
          blogService.getAllPosts(),
          projectService.getAllProjects()
        ])
        
        // Count featured items
        const featuredPosts = blogPosts.filter(post => post.featured).length
        const featuredProjects = projects.filter(project => project.featured).length
        
        setStats({
          totalPosts: blogPosts.length,
          totalProjects: projects.length,
          featuredPosts,
          featuredProjects
        })
      } catch (error) {
        logger.error('Error loading stats:', error)
      } finally {
        setLoading(false)
        setLastUpdated(new Date())
      }
    }

    loadStats()
  }, [])

  const handleRefreshStats = async () => {
    setLoading(true)
    try {
      // Dynamic import to avoid SSR issues
      const { blogService, projectService } = await import('@/lib/service-switcher')
      const [blogPosts, projects] = await Promise.all([
        blogService.getAllPosts(),
        projectService.getAllProjects()
      ])
      
      // Count featured items
      const featuredPosts = blogPosts.filter(post => post.featured).length
      const featuredProjects = projects.filter(project => project.featured).length
      
      setStats({
        totalPosts: blogPosts.length,
        totalProjects: projects.length,
        featuredPosts,
        featuredProjects
      })
    } catch (error) {
      logger.error('Error refreshing stats:', error)
    } finally {
      setLoading(false)
      setLastUpdated(new Date())
    }
  }

  const statCards = [
    {
      title: 'Total Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500',
      change: 'published content',
      link: '/admin/posts'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Rocket,
      color: 'bg-green-500',
      change: 'portfolio items',
      link: '/admin/projects'
    },
    {
      title: 'Featured Posts',
      value: stats.featuredPosts,
      icon: Star,
      color: 'bg-purple-500',
      change: 'featured on homepage',
      link: '/admin/posts'
    },
    {
      title: 'Featured Projects',
      value: stats.featuredProjects,
      icon: Award,
      color: 'bg-yellow-500',
      change: 'highlighted work',
      link: '/admin/projects'
    }
  ]


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-foreground/70">Welcome back! Here's your content overview.</p>
          {lastUpdated && (
            <p className="text-sm text-foreground/50 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleRefreshStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-foreground bg-background hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Link key={index} href={stat.link}>
              <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary-500/30 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent size={24} />
                  </div>
                  <span className="text-2xl font-bold text-foreground group-hover:text-primary-500 transition-colors duration-200">
                    {loading ? '...' : stat.value}
                  </span>
                </div>
                <h3 className="font-medium text-foreground mb-1 group-hover:text-foreground/90">{stat.title}</h3>
                <p className="text-sm text-foreground/60 group-hover:text-foreground/80">{stat.change}</p>
              </div>
            </Link>
          )
        })}
      </div>


      {/* Quick Actions */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
        <div className="space-y-3">
          <Link href="/admin/posts/new">
            <button className="w-full flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-cyber-500 hover:bg-cyber-500/5 transition-colors group min-h-[64px]">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyber-500/10 flex items-center justify-center text-cyber-500 group-hover:bg-cyber-500/20 transition-colors">
                <Plus size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Create New Post</div>
                <div className="text-sm text-foreground/60">Write and publish a blog post</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/projects/new">
            <button className="w-full flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-accent-blue hover:bg-accent-blue/5 transition-all duration-200 group shadow-lg shadow-accent-blue/20 min-h-[64px]">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue/20 transition-colors">
                <Rocket size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Add New Project</div>
                <div className="text-sm text-foreground/60">Showcase your latest work</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/media">
            <button className="w-full flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-500/5 transition-colors group min-h-[64px]">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                <Upload size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Upload Media</div>
                <div className="text-sm text-foreground/60">Add images and files</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/availability">
            <button className="w-full flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-colors group min-h-[64px]">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                <Calendar size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Manage Availability</div>
                <div className="text-sm text-foreground/60">Set consultation times and schedule</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/profile">
            <button className="w-full flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-500/5 transition-colors group min-h-[64px]">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500/20 transition-colors">
                <User size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Manage Profile</div>
                <div className="text-sm text-foreground/60">Update your profile and avatar</div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}