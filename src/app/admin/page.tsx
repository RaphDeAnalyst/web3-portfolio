'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ActivityGraph } from '@/components/admin/activity-graph'
import { ActivityService } from '@/lib/activity-service'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProjects: 0,
    thisMonthActivity: 0,
    totalActivity: 0,
    streak: 0
  })

  useEffect(() => {
    // Load stats
    const loadStats = async () => {
      try {
        const blogPosts = await import('@/data/blog-posts')
        const projects = await import('@/data/projects')
        const activity = ActivityService.getActivity()
        
        const thisMonth = new Date().getMonth()
        const thisYear = new Date().getFullYear()
        const thisMonthActivity = activity.filter(a => {
          const date = new Date(a.date)
          return date.getMonth() === thisMonth && date.getFullYear() === thisYear
        }).length

        const streak = ActivityService.getCurrentStreak()
        
        setStats({
          totalPosts: blogPosts.blogPosts.length,
          totalProjects: projects.projects.length,
          thisMonthActivity,
          totalActivity: activity.length,
          streak
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
      icon: '📝',
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: null,
      color: 'bg-green-500',
      change: '+1 this month'
    },
    {
      title: 'This Month Activity',
      value: stats.thisMonthActivity,
      icon: null,
      color: 'bg-purple-500',
      change: 'posts & updates'
    },
    {
      title: 'Current Streak',
      value: `${stats.streak} days`,
      icon: null,
      color: 'bg-orange-500',
      change: 'keep it up!'
    }
  ]

  const recentActivity = [
    {
      type: 'post',
      title: 'Published "My First Week Learning Dune Analytics"',
      time: '2 hours ago',
      icon: '📝'
    },
    {
      type: 'project',
      title: 'Updated Ethereum Gas Price Analysis Dashboard',
      time: '1 day ago',
      icon: '💼'
    },
    {
      type: 'post',
      title: 'Published "Python for Blockchain Data: My Learning Path"',
      time: '3 days ago',
      icon: '📝'
    },
    {
      type: 'project',
      title: 'Added DeFi TVL Trend Analysis project',
      time: '5 days ago',
      icon: '💼'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground/70">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Activity Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Graph */}
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Activity Overview</h2>
            <div className="text-sm text-foreground/60">
              {stats.totalActivity} contributions in the last year
            </div>
          </div>
          <ActivityGraph />
        </div>

        {/* Recent Activity */}
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="text-lg flex-shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-foreground/60 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="space-y-3">
          <Link href="/admin/posts/new">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-cyber-500 hover:bg-cyber-500/5 transition-colors group">
              <span className="text-2xl group-hover:scale-110 transition-transform">📝</span>
              <div className="text-left">
                <div className="font-medium text-foreground">Create New Post</div>
                <div className="text-sm text-foreground/60">Write and publish a blog post</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/projects/new">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/5 transition-colors group">
              <span className="text-2xl group-hover:scale-110 transition-transform">💼</span>
              <div className="text-left">
                <div className="font-medium text-foreground">Add New Project</div>
                <div className="text-sm text-foreground/60">Showcase your latest work</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/media">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-500/5 transition-colors group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🖼️</span>
              <div className="text-left">
                <div className="font-medium text-foreground">Upload Media</div>
                <div className="text-sm text-foreground/60">Add images and files</div>
              </div>
            </button>
          </Link>
          
          <Link href="/admin/profile">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-500/5 transition-colors group">
              <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
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