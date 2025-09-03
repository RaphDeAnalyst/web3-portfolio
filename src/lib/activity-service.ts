export interface Activity {
  id: string
  date: string // YYYY-MM-DD format
  type: 'post' | 'project' | 'update' | 'media'
  title: string
  description?: string
  intensity: 1 | 2 | 3 | 4 // 1=light, 2=medium, 3=high, 4=intense
}

export class ActivityService {
  private static readonly STORAGE_KEY = 'portfolio-activity'

  // Get all activity
  static getActivity(): Activity[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Add new activity
  static addActivity(activity: Omit<Activity, 'id'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const activities = this.getActivity()
    
    // Check if there's already activity for this date
    const existingIndex = activities.findIndex(a => a.date === activity.date && a.type === activity.type)
    
    if (existingIndex >= 0) {
      // Update existing activity with higher intensity
      activities[existingIndex] = {
        ...activities[existingIndex],
        intensity: Math.max(activities[existingIndex].intensity, activity.intensity) as 1 | 2 | 3 | 4,
        title: activity.title,
        description: activity.description
      }
    } else {
      activities.push(newActivity)
    }

    this.saveActivity(activities)
    return newActivity
  }

  // Update activity
  static updateActivity(id: string, updates: Partial<Activity>): void {
    const activities = this.getActivity()
    const index = activities.findIndex(a => a.id === id)
    
    if (index >= 0) {
      activities[index] = { ...activities[index], ...updates }
      this.saveActivity(activities)
    }
  }

  // Delete activity
  static deleteActivity(id: string): void {
    const activities = this.getActivity().filter(a => a.id !== id)
    this.saveActivity(activities)
  }

  // Get activity for a specific date
  static getActivityForDate(date: string): Activity[] {
    return this.getActivity().filter(a => a.date === date)
  }

  // Get activity for a date range
  static getActivityForDateRange(startDate: string, endDate: string): Activity[] {
    return this.getActivity().filter(a => a.date >= startDate && a.date <= endDate)
  }

  // Get current streak
  static getCurrentStreak(): number {
    const activities = this.getActivity()
    if (activities.length === 0) return 0

    // Sort activities by date (most recent first)
    const sortedActivities = activities.sort((a, b) => b.date.localeCompare(a.date))
    
    // Get unique dates
    const uniqueDates = Array.from(new Set(sortedActivities.map(a => a.date))).sort().reverse()
    
    if (uniqueDates.length === 0) return 0

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    // Start counting from today or yesterday
    let streakStart = uniqueDates[0] === today ? today : (uniqueDates[0] === yesterday ? yesterday : null)
    
    if (!streakStart) return 0

    let streak = 0
    const startDate = new Date(streakStart)
    
    for (let i = 0; i < 365; i++) { // Check up to a year
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() - i)
      const dateString = currentDate.toISOString().split('T')[0]
      
      if (uniqueDates.includes(dateString)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  // Get activity stats
  static getActivityStats() {
    const activities = this.getActivity()
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    
    const thisYearActivities = activities.filter(a => new Date(a.date).getFullYear() === currentYear)
    const thisMonthActivities = activities.filter(a => {
      const date = new Date(a.date)
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth
    })

    const typeStats = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: activities.length,
      thisYear: thisYearActivities.length,
      thisMonth: thisMonthActivities.length,
      streak: this.getCurrentStreak(),
      byType: typeStats,
      averagePerMonth: thisYearActivities.length / 12
    }
  }

  // Generate last 365 days of data for activity graph (GitHub style)
  static getYearData(year?: number): { date: string; intensity: number; activities: Activity[] }[] {
    const activities = this.getActivity()
    const data: { date: string; intensity: number; activities: Activity[] }[] = []

    // If year is specified, show that full year (for year selector)
    if (year && year !== new Date().getFullYear()) {
      const yearStart = new Date(year, 0, 1)
      const yearEnd = new Date(year, 11, 31)

      for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0]
        const dayActivities = activities.filter(a => a.date === dateString)
        
        // Calculate intensity based on number and type of activities
        let intensity = 0
        if (dayActivities.length > 0) {
          const maxIntensity = Math.max(...dayActivities.map(a => a.intensity))
          const activityCount = dayActivities.length
          
          if (activityCount === 1) intensity = Math.min(maxIntensity, 2)
          else if (activityCount === 2) intensity = Math.min(maxIntensity + 1, 3)
          else intensity = 4
        }

        data.push({
          date: dateString,
          intensity,
          activities: dayActivities
        })
      }
    } else {
      // Default: show last 365 days ending today (GitHub style)
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 364) // 365 days total (364 days back + today)

      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0]
        const dayActivities = activities.filter(a => a.date === dateString)
        
        // Calculate intensity based on number and type of activities
        let intensity = 0
        if (dayActivities.length > 0) {
          const maxIntensity = Math.max(...dayActivities.map(a => a.intensity))
          const activityCount = dayActivities.length
          
          if (activityCount === 1) intensity = Math.min(maxIntensity, 2)
          else if (activityCount === 2) intensity = Math.min(maxIntensity + 1, 3)
          else intensity = 4
        }

        data.push({
          date: dateString,
          intensity,
          activities: dayActivities
        })
      }
    }

    return data
  }

  // Initialize with some sample data if empty
  static initializeSampleData(): void {
    const activities = this.getActivity()
    if (activities.length > 0) return

    const sampleActivities: Omit<Activity, 'id'>[] = [
      {
        date: new Date().toISOString().split('T')[0],
        type: 'post',
        title: 'Updated portfolio website',
        intensity: 2
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'project',
        title: 'Added new project',
        intensity: 3
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'post',
        title: 'Published blog post',
        intensity: 4
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'update',
        title: 'Updated project documentation',
        intensity: 1
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'project',
        title: 'Completed data analysis project',
        intensity: 4
      }
    ]

    sampleActivities.forEach(activity => this.addActivity(activity))
  }

  // Save activities to localStorage
  private static saveActivity(activities: Activity[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities))
    } catch (error) {
      console.error('Failed to save activities:', error)
    }
  }

  // Track blog post creation/update
  static trackBlogPost(title: string, isUpdate = false): void {
    this.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'post',
      title: isUpdate ? `Updated: ${title}` : `Published: ${title}`,
      intensity: isUpdate ? 2 : 3
    })
  }

  // Track project creation/update
  static trackProject(title: string, isUpdate = false): void {
    this.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'project',
      title: isUpdate ? `Updated: ${title}` : `Added: ${title}`,
      intensity: isUpdate ? 2 : 4
    })
  }

  // Track media upload
  static trackMedia(filename: string): void {
    this.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'media',
      title: `Uploaded: ${filename}`,
      intensity: 1
    })
  }
}