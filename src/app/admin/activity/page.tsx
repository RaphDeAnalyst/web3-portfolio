'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ActivityGraph } from '@/components/admin/activity-graph'
import { ActivityService, Activity } from '@/lib/activity-service'

export default function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'update' as const,
    title: '',
    description: '',
    intensity: 2 as const
  })

  useEffect(() => {
    setActivities(ActivityService.getActivity())
  }, [])

  const stats = ActivityService.getActivityStats()

  const handleAddActivity = () => {
    if (!newActivity.title.trim()) return

    const activity = ActivityService.addActivity({
      date: newActivity.date,
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.description,
      intensity: newActivity.intensity
    })

    setActivities(ActivityService.getActivity())
    setNewActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'update',
      title: '',
      description: '',
      intensity: 2
    })
    setShowAddForm(false)
  }

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      ActivityService.deleteActivity(id)
      setActivities(ActivityService.getActivity())
    }
  }

  const recentActivities = activities
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)


  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 3: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 4: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const intensityLabels = {
    1: 'Light',
    2: 'Medium',
    3: 'High',
    4: 'Intense'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Tracker</h1>
          <p className="text-foreground/70 mt-1">Track and visualize your productivity</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200 flex items-center space-x-2"
        >
          <span>Add Activity</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">Total Activity</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-foreground/60 mt-1">All time contributions</p>
        </div>

        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">Current Streak</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
          <p className="text-xs text-foreground/60 mt-1">consecutive days</p>
        </div>

        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">This Month</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
          <p className="text-xs text-foreground/60 mt-1">activities this month</p>
        </div>

        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">Monthly Avg</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{Math.round(stats.averagePerMonth)}</p>
          <p className="text-xs text-foreground/60 mt-1">average per month</p>
        </div>
      </div>

      {/* Activity Graph & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Graph */}
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Activity Graph</h2>
          <ActivityGraph year={selectedYear} />
        </div>

        {/* Recent Activities */}
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Activities</h2>
            <Link 
              href="/admin/activity/all"
              className="text-sm text-primary-500 hover:text-primary-400 font-medium flex items-center space-x-1 transition-colors"
            >
              <span>See All</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-800">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-medium text-foreground">{activity.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getIntensityColor(activity.intensity)}`}>
                        {intensityLabels[activity.intensity]}
                      </span>
                    </div>
                    
                    {activity.description && (
                      <p className="text-sm text-foreground/70 mb-2">{activity.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-foreground/60">
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{activity.type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="text-foreground/40 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Delete activity"
                  >
Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">No activities yet</h3>
              <p className="text-foreground/60 mb-6">Start tracking your work to see your progress</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200"
              >
                <span>Add First Activity</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Add Activity</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                >
                  <option value="post">Blog Post</option>
                  <option value="project">Project</option>
                  <option value="media">Media</option>
                  <option value="update">Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What did you work on?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add more details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background text-foreground focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Intensity</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      onClick={() => setNewActivity(prev => ({ ...prev, intensity: level as any }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newActivity.intensity === level
                          ? 'bg-cyber-500 text-white'
                          : 'border border-gray-300 dark:border-gray-700 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {intensityLabels[level as keyof typeof intensityLabels]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  disabled={!newActivity.title.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}