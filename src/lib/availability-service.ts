export interface TimeSlot {
  start: string // "09:00"
  end: string   // "17:00" 
  timezone: string // "WAT"
}

export interface DayAvailability {
  date: string // "2025-01-15"
  status: 'available' | 'limited' | 'busy' | 'unavailable'
  slots: TimeSlot[]
  bookingUrl?: string
  notes?: string
}

export interface WeeklyTemplate {
  name: string
  days: {
    [key: string]: {
      status: 'available' | 'limited' | 'busy' | 'unavailable'
      slots: TimeSlot[]
    }
  }
}

const STORAGE_KEY = 'availability-data'
const TEMPLATES_KEY = 'availability-templates'

export class AvailabilityService {
  // Get all availability data
  static getAvailability(): DayAvailability[] {
    if (typeof window === 'undefined') return []
    
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading availability data:', error)
      return []
    }
  }

  // Save availability data
  static saveAvailability(availability: DayAvailability[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(availability))
    } catch (error) {
      console.error('Error saving availability data:', error)
    }
  }

  // Get availability for a specific date
  static getAvailabilityForDate(date: Date): DayAvailability | null {
    // Use local date to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    const allAvailability = this.getAvailability()
    return allAvailability.find(a => a.date === dateStr) || null
  }

  // Update or create availability for a specific date
  static updateDayAvailability(dayData: DayAvailability): void {
    const allAvailability = this.getAvailability()
    const existingIndex = allAvailability.findIndex(a => a.date === dayData.date)
    
    if (existingIndex >= 0) {
      allAvailability[existingIndex] = dayData
    } else {
      allAvailability.push(dayData)
    }
    
    this.saveAvailability(allAvailability)
  }

  // Delete availability for a specific date
  static deleteDayAvailability(date: string): void {
    const allAvailability = this.getAvailability()
    const filtered = allAvailability.filter(a => a.date !== date)
    this.saveAvailability(filtered)
  }

  // Get default availability for a date (business logic)
  static getDefaultAvailability(date: Date): DayAvailability {
    // Use local date to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
    
    if (isPast) {
      return { 
        date: dateStr, 
        status: 'unavailable', 
        slots: [] 
      }
    }
    
    if (isWeekend) {
      return { 
        date: dateStr, 
        status: 'limited', 
        slots: [{ start: '14:00', end: '16:00', timezone: 'WAT' }],
        bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min'
      }
    }
    
    // Default weekday availability
    return {
      date: dateStr,
      status: 'available',
      slots: [
        { start: '09:00', end: '12:00', timezone: 'WAT' },
        { start: '13:00', end: '17:00', timezone: 'WAT' }
      ],
      bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min'
    }
  }

  // Get effective availability (combines saved data with defaults)
  static getEffectiveAvailability(date: Date): DayAvailability {
    const savedAvailability = this.getAvailabilityForDate(date)
    return savedAvailability || this.getDefaultAvailability(date)
  }

  // Bulk update availability for a date range
  static bulkUpdateAvailability(startDate: Date, endDate: Date, template: Partial<DayAvailability>): void {
    const allAvailability = this.getAvailability()
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const existingIndex = allAvailability.findIndex(a => a.date === dateStr)
      
      const dayData: DayAvailability = {
        date: dateStr,
        status: template.status || 'available',
        slots: template.slots || [],
        bookingUrl: template.bookingUrl,
        notes: template.notes
      }
      
      if (existingIndex >= 0) {
        allAvailability[existingIndex] = dayData
      } else {
        allAvailability.push(dayData)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    this.saveAvailability(allAvailability)
  }

  // Weekly template management
  static getWeeklyTemplates(): WeeklyTemplate[] {
    if (typeof window === 'undefined') return []
    
    try {
      const data = localStorage.getItem(TEMPLATES_KEY)
      return data ? JSON.parse(data) : this.getDefaultTemplates()
    } catch (error) {
      console.error('Error loading templates:', error)
      return this.getDefaultTemplates()
    }
  }

  static saveWeeklyTemplate(template: WeeklyTemplate): void {
    if (typeof window === 'undefined') return
    
    const templates = this.getWeeklyTemplates()
    const existingIndex = templates.findIndex(t => t.name === template.name)
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template
    } else {
      templates.push(template)
    }
    
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  static deleteWeeklyTemplate(templateName: string): void {
    const templates = this.getWeeklyTemplates()
    const filtered = templates.filter(t => t.name !== templateName)
    
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  // Apply weekly template to a date range
  static applyWeeklyTemplate(templateName: string, startDate: Date, weeks: number = 4): void {
    const templates = this.getWeeklyTemplates()
    const template = templates.find(t => t.name === templateName)
    
    if (!template) {
      throw new Error(`Template "${templateName}" not found`)
    }
    
    const allAvailability = this.getAvailability()
    const currentDate = new Date(startDate)
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day]
        const templateDay = template.days[dayName]
        
        if (templateDay) {
          const dateStr = currentDate.toISOString().split('T')[0]
          const existingIndex = allAvailability.findIndex(a => a.date === dateStr)
          
          const dayData: DayAvailability = {
            date: dateStr,
            status: templateDay.status,
            slots: [...templateDay.slots],
            bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min'
          }
          
          if (existingIndex >= 0) {
            allAvailability[existingIndex] = dayData
          } else {
            allAvailability.push(dayData)
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
    
    this.saveAvailability(allAvailability)
  }

  // Get default templates
  private static getDefaultTemplates(): WeeklyTemplate[] {
    return [
      {
        name: 'Standard Business Hours',
        days: {
          monday: {
            status: 'available',
            slots: [
              { start: '09:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '17:00', timezone: 'WAT' }
            ]
          },
          tuesday: {
            status: 'available',
            slots: [
              { start: '09:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '17:00', timezone: 'WAT' }
            ]
          },
          wednesday: {
            status: 'available',
            slots: [
              { start: '09:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '17:00', timezone: 'WAT' }
            ]
          },
          thursday: {
            status: 'available',
            slots: [
              { start: '09:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '17:00', timezone: 'WAT' }
            ]
          },
          friday: {
            status: 'available',
            slots: [
              { start: '09:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '17:00', timezone: 'WAT' }
            ]
          },
          saturday: {
            status: 'limited',
            slots: [
              { start: '10:00', end: '13:00', timezone: 'WAT' }
            ]
          },
          sunday: {
            status: 'unavailable',
            slots: []
          }
        }
      },
      {
        name: 'Extended Hours',
        days: {
          monday: {
            status: 'available',
            slots: [
              { start: '08:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '18:00', timezone: 'WAT' }
            ]
          },
          tuesday: {
            status: 'available',
            slots: [
              { start: '08:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '18:00', timezone: 'WAT' }
            ]
          },
          wednesday: {
            status: 'available',
            slots: [
              { start: '08:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '18:00', timezone: 'WAT' }
            ]
          },
          thursday: {
            status: 'available',
            slots: [
              { start: '08:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '18:00', timezone: 'WAT' }
            ]
          },
          friday: {
            status: 'available',
            slots: [
              { start: '08:00', end: '12:00', timezone: 'WAT' },
              { start: '13:00', end: '16:00', timezone: 'WAT' }
            ]
          },
          saturday: {
            status: 'limited',
            slots: [
              { start: '10:00', end: '13:00', timezone: 'WAT' }
            ]
          },
          sunday: {
            status: 'unavailable',
            slots: []
          }
        }
      }
    ]
  }

  // Get availability statistics
  static getAvailabilityStats(month?: number, year?: number): {
    available: number
    limited: number
    busy: number
    unavailable: number
    totalSlots: number
  } {
    const allAvailability = this.getAvailability()
    const now = new Date()
    const targetMonth = month ?? now.getMonth()
    const targetYear = year ?? now.getFullYear()
    
    const monthAvailability = allAvailability.filter(a => {
      const date = new Date(a.date)
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear
    })
    
    const stats = {
      available: 0,
      limited: 0,
      busy: 0,
      unavailable: 0,
      totalSlots: 0
    }
    
    monthAvailability.forEach(day => {
      stats[day.status]++
      stats.totalSlots += day.slots.length
    })
    
    return stats
  }
}

export default AvailabilityService