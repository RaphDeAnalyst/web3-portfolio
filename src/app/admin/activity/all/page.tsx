'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ActivityService, Activity } from '@/lib/activity-service'

export default function AllActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const loadedActivities = ActivityService.getActivity()
    setActivities(loadedActivities)
    setFilteredActivities(loadedActivities)
  }, [])

  // Filter and search activities
  useEffect(() => {
    let filtered = activities

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => b.date.localeCompare(a.date))

    setFilteredActivities(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [activities, searchTerm, filterType])

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      ActivityService.deleteActivity(id)
      setActivities(ActivityService.getActivity())
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝'
      case 'project': return '💼'
      case 'media': return '🖼️'
      case 'update': return '📈'
      default: return '📊'
    }
  }

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

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage)

  const stats = ActivityService.getActivityStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link 
              href="/admin/activity"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">All Activities</h1>
          </div>
          <p className="text-foreground/70">Complete history of your tracked activities</p>
        </div>
        <div className="text-sm text-foreground/60">
          {filteredActivities.length} of {activities.length} activities
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Search Activities</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
            />
          </div>

          {/* Filter by Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
            >
              <option value="all">All Types</option>
              <option value="post">📝 Blog Posts</option>
              <option value="project">💼 Projects</option>
              <option value="media">🖼️ Media</option>
              <option value="update">📈 Updates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        {paginatedActivities.length > 0 ? (
          <div className="space-y-4">
            {paginatedActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-800">
                <span className="text-2xl flex-shrink-0">{getTypeIcon(activity.type)}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getIntensityColor(activity.intensity)}`}>
                      {intensityLabels[activity.intensity]}
                    </span>
                  </div>
                  
                  {activity.description && (
                    <p className="text-sm text-foreground/70 mb-3">{activity.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-foreground/60">
                    <span>{new Date(activity.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span className="capitalize">{activity.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="text-foreground/40 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Delete activity"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm || filterType !== 'all' ? 'No matching activities found' : 'No activities yet'}
            </h3>
            <p className="text-foreground/60">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start tracking your work to see your progress'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-foreground/60">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredActivities.length)} of {filteredActivities.length}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      page === currentPage
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}