'use client'

import { useMemo } from 'react'

interface ContributionDay {
  date: string
  count: number
  activities: string[]
}

interface ContributionGraphProps {
  activities?: Array<{
    date: string
    intensity: number
    activities: Array<{
      type: string
      title: string
    }>
  }>
  className?: string
}

export function ContributionGraph({ activities = [], className = "" }: ContributionGraphProps) {
  const { contributionData, totalContributions } = useMemo(() => {
    // Generate last 365 days
    const days: ContributionDay[] = []
    const today = new Date()
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      // Find activities for this date
      const dayData = activities.find(activity => activity.date === dateString)
      
      days.push({
        date: dateString,
        count: dayData ? dayData.intensity : 0,
        activities: dayData ? dayData.activities.map(a => `${getActivityEmoji(a.type)} ${a.title}`) : []
      })
    }

    const total = activities.reduce((sum, day) => sum + day.intensity, 0)

    return { contributionData: days, totalContributions: total }
  }, [activities])

  const getActivityEmoji = (type: string) => {
    switch (type) {
      case 'post': return '📝'
      case 'project': return '🚀'
      case 'update': return '💼'
      case 'media': return '📷'
      default: return '📌'
    }
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count === 1) return 'bg-green-200 dark:bg-green-900'
    if (count <= 3) return 'bg-green-300 dark:bg-green-700'
    if (count <= 6) return 'bg-green-400 dark:bg-green-600'
    return 'bg-green-500 dark:bg-green-500'
  }

  // Group days by weeks
  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []
  
  contributionData.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay()
    
    if (index === 0) {
      // Fill empty spots at the beginning of first week
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', count: 0, activities: [] })
      }
    }
    
    currentWeek.push(day)
    
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })
  
  // Add remaining days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Activity Overview
          </h3>
          <p className="text-sm text-foreground/60">
            {totalContributions} contributions in the last year
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-2 text-xs text-foreground/60">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-green-200 dark:bg-green-900"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-green-300 dark:bg-green-700"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-green-400 dark:bg-green-600"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500 dark:bg-green-500"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Graph */}
      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-2 text-xs text-foreground/60">
          {months.map((month, idx) => (
            <div key={month} className="flex-1 text-left" style={{ marginLeft: idx === 0 ? '14px' : '0' }}>
              {month}
            </div>
          ))}
        </div>

        {/* Main graph */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col space-y-1 mr-2 text-xs text-foreground/60">
            {dayLabels.map((day, idx) => (
              <div key={day} className="h-2.5 flex items-center">
                {idx % 2 === 1 && <span className="text-xs">{day}</span>}
              </div>
            ))}
          </div>

          {/* Contribution squares */}
          <div className="flex space-x-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-2.5 h-2.5 rounded-sm border border-gray-200/50 dark:border-gray-700/50 ${
                      day.date ? getIntensityClass(day.count) : 'bg-transparent border-transparent'
                    }`}
                    title={day.date ? `${day.date}: ${day.count} contributions${day.activities.length > 0 ? '\n' + day.activities.join('\n') : ''}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity summary */}
      {totalContributions > 0 && (
        <div className="text-sm text-foreground/70">
          <div className="flex items-center space-x-4">
            <span>📝 {activities.reduce((sum, day) => sum + day.activities.filter(a => a.type === 'post').length, 0)} Blog posts</span>
            <span>🚀 {activities.reduce((sum, day) => sum + day.activities.filter(a => a.type === 'project').length, 0)} Projects</span>
            <span>💼 {activities.reduce((sum, day) => sum + day.activities.filter(a => a.type === 'update').length, 0)} Updates</span>
            <span>📷 {activities.reduce((sum, day) => sum + day.activities.filter(a => a.type === 'media').length, 0)} Media</span>
          </div>
        </div>
      )}
    </div>
  )
}