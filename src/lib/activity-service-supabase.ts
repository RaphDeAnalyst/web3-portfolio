import { supabase, type Activity as SupabaseActivity } from './supabase'

export interface Activity {
  id: string
  date: string // YYYY-MM-DD format
  type: 'post' | 'project' | 'update' | 'media'
  title: string
  description?: string
  intensity: 1 | 2 | 3 | 4 // 1=light, 2=medium, 3=high, 4=intense
}

export class ActivityServiceSupabase {
  // Transform Supabase Activity to legacy Activity interface
  private static transformToActivity(activity: SupabaseActivity): Activity {
    return {
      id: activity.id,
      date: activity.date,
      type: activity.type as 'post' | 'project' | 'update' | 'media',
      title: activity.title,
      intensity: activity.intensity as 1 | 2 | 3 | 4
    }
  }

  // Transform Activity to Supabase format
  private static transformToSupabaseActivity(activity: Omit<Activity, 'id'>): Partial<SupabaseActivity> {
    return {
      date: activity.date,
      type: activity.type,
      title: activity.title,
      intensity: activity.intensity
    }
  }

  // Get all activity
  static async getActivity(): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching activities from Supabase:', error)
        return []
      }

      return data.map(activity => this.transformToActivity(activity))
    } catch (error) {
      console.error('Error in getActivity:', error)
      return []
    }
  }

  // Add new activity
  static async addActivity(activity: Omit<Activity, 'id'>): Promise<Activity | null> {
    try {
      // Check if there's already activity for this date and type
      const { data: existing, error: existingError } = await supabase
        .from('activities')
        .select('*')
        .eq('date', activity.date)
        .eq('type', activity.type)
        .single()

      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking existing activity:', existingError)
      }

      if (existing) {
        // Update existing activity with higher intensity
        const updatedIntensity = Math.max(existing.intensity, activity.intensity)
        const { data: updated, error: updateError } = await supabase
          .from('activities')
          .update({
            intensity: updatedIntensity,
            title: activity.title
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating activity:', updateError)
          return null
        }

        return this.transformToActivity(updated)
      } else {
        // Insert new activity
        const activityData = this.transformToSupabaseActivity(activity)
        const { data: newActivity, error: insertError } = await supabase
          .from('activities')
          .insert([activityData])
          .select()
          .single()

        if (insertError) {
          console.error('Error inserting activity:', insertError)
          return null
        }

        return this.transformToActivity(newActivity)
      }
    } catch (error) {
      console.error('Error in addActivity:', error)
      return null
    }
  }

  // Update activity
  static async updateActivity(id: string, updates: Partial<Activity>): Promise<void> {
    try {
      const updateData: Partial<SupabaseActivity> = {}
      
      if (updates.date) updateData.date = updates.date
      if (updates.type) updateData.type = updates.type
      if (updates.title) updateData.title = updates.title
      if (updates.intensity) updateData.intensity = updates.intensity

      const { error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating activity:', error)
      }
    } catch (error) {
      console.error('Error in updateActivity:', error)
    }
  }

  // Delete activity
  static async deleteActivity(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting activity:', error)
      }
    } catch (error) {
      console.error('Error in deleteActivity:', error)
    }
  }

  // Get activity for a specific date
  static async getActivityForDate(date: string): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('date', date)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching activities for date:', error)
        return []
      }

      return data.map(activity => this.transformToActivity(activity))
    } catch (error) {
      console.error('Error in getActivityForDate:', error)
      return []
    }
  }

  // Get activity for a date range
  static async getActivityForDateRange(startDate: string, endDate: string): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching activities for date range:', error)
        return []
      }

      return data.map(activity => this.transformToActivity(activity))
    } catch (error) {
      console.error('Error in getActivityForDateRange:', error)
      return []
    }
  }

  // Get current streak
  static async getCurrentStreak(): Promise<number> {
    try {
      const activities = await this.getActivity()
      if (activities.length === 0) return 0

      // Get unique dates
      const uniqueDates = Array.from(new Set(activities.map(a => a.date))).sort().reverse()
      
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
    } catch (error) {
      console.error('Error in getCurrentStreak:', error)
      return 0
    }
  }

  // Get activity stats
  static async getActivityStats() {
    try {
      const activities = await this.getActivity()
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

      const streak = await this.getCurrentStreak()

      return {
        total: activities.length,
        thisYear: thisYearActivities.length,
        thisMonth: thisMonthActivities.length,
        streak,
        byType: typeStats,
        averagePerMonth: thisYearActivities.length / 12
      }
    } catch (error) {
      console.error('Error in getActivityStats:', error)
      return {
        total: 0,
        thisYear: 0,
        thisMonth: 0,
        streak: 0,
        byType: {},
        averagePerMonth: 0
      }
    }
  }

  // Generate last 365 days of data for activity graph (GitHub style)
  static async getYearData(year?: number): Promise<{ date: string; intensity: number; activities: Activity[] }[]> {
    try {
      const activities = await this.getActivity()
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
    } catch (error) {
      console.error('Error in getYearData:', error)
      return []
    }
  }

  // Initialize with some sample data if empty
  static async initializeSampleData(): Promise<void> {
    try {
      const activities = await this.getActivity()
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

      for (const activity of sampleActivities) {
        await this.addActivity(activity)
      }
    } catch (error) {
      console.error('Error initializing sample data:', error)
    }
  }

  // Track blog post creation/update
  static async trackBlogPost(title: string, isUpdate = false): Promise<void> {
    await this.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'post',
      title: isUpdate ? `Updated: ${title}` : `Published: ${title}`,
      intensity: isUpdate ? 2 : 3
    })
  }

  // Track project creation/update
  static async trackProject(title: string, isUpdate = false): Promise<void> {
    await this.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'project',
      title: isUpdate ? `Updated: ${title}` : `Added: ${title}`,
      intensity: isUpdate ? 2 : 4
    })
  }

  // Track media upload
  static async trackMedia(filename: string): Promise<void> {
    await this.addActivity({
      date: new Date().toISOString().split('T')[0],
      type: 'media',
      title: `Uploaded: ${filename}`,
      intensity: 1
    })
  }
}

export const activityServiceSupabase = new ActivityServiceSupabase()