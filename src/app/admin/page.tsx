'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProjects: 0
  })

  useEffect(() => {
    // Load stats
    const loadStats = async () => {
      try {
        const blogPosts = await import('@/data/blog-posts')
        const projects = await import('@/data/projects')
        
        setStats({
          totalPosts: blogPosts.blogPosts.length,
          totalProjects: projects.projects.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Total Blog Posts',
      value: stats.totalPosts,
      icon: null,
      color: 'bg-blue-500',
      change: 'published content'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: null,
      color: 'bg-green-500',
      change: 'portfolio items'
    }
  ]


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground/70">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            </div>
            <h3 className="font-medium text-foreground mb-1">{stat.title}</h3>
            <p className="text-sm text-foreground/60">{stat.change}</p>
          </div>
        ))}
      </div>


      {/* Quick Actions */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="space-y-3">
          <Link href="/admin/posts/new">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-cyber-500 hover:bg-cyber-500/5 transition-colors group">
              <div className="text-left">
                <div className="font-medium text-foreground">Create New Post</div>
                <div className="text-sm text-foreground/60">Write and publish a blog post</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/projects/new">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/5 transition-colors group">
              <div className="text-left">
                <div className="font-medium text-foreground">Add New Project</div>
                <div className="text-sm text-foreground/60">Showcase your latest work</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/media">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-500/5 transition-colors group">
              <div className="text-left">
                <div className="font-medium text-foreground">Upload Media</div>
                <div className="text-sm text-foreground/60">Add images and files</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/availability">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-colors group">
              <div className="text-left">
                <div className="font-medium text-foreground">Manage Availability</div>
                <div className="text-sm text-foreground/60">Set consultation times and schedule</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/profile">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-500/5 transition-colors group">
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