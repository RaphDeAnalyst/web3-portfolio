'use client'

import { useState, useEffect } from 'react'

interface TimeSlot {
  start: string // "09:00"
  end: string   // "17:00"
  timezone: string // "UTC"
}

interface DayAvailability {
  date: string // "2025-01-15"
  status: 'available' | 'limited' | 'busy' | 'unavailable'
  slots: TimeSlot[]
  bookingUrl?: string
  notes?: string
}

interface TooltipData {
  day: DayAvailability
  x: number
  y: number
}

export function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState<TooltipData | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Sample availability data - in a real app, this would come from an API
  const sampleAvailability: DayAvailability[] = [
    // January 2025 sample data
    {
      date: '2025-01-06',
      status: 'available',
      slots: [
        { start: '09:00', end: '12:00', timezone: 'UTC' },
        { start: '14:00', end: '17:00', timezone: 'UTC' }
      ],
      bookingUrl: 'https://calendly.com/web3dev/consultation'
    },
    {
      date: '2025-01-07',
      status: 'limited',
      slots: [
        { start: '10:00', end: '11:30', timezone: 'UTC' }
      ],
      bookingUrl: 'https://calendly.com/web3dev/consultation'
    },
    {
      date: '2025-01-08',
      status: 'busy',
      slots: [],
      notes: 'Client project deadline'
    },
    {
      date: '2025-01-09',
      status: 'available',
      slots: [
        { start: '09:00', end: '12:00', timezone: 'UTC' },
        { start: '13:00', end: '16:00', timezone: 'UTC' }
      ],
      bookingUrl: 'https://calendly.com/web3dev/consultation'
    },
    {
      date: '2025-01-10',
      status: 'available',
      slots: [
        { start: '08:00', end: '11:00', timezone: 'UTC' },
        { start: '15:00', end: '18:00', timezone: 'UTC' }
      ],
      bookingUrl: 'https://calendly.com/web3dev/consultation'
    }
  ]

  // Get availability for a specific date
  const getAvailabilityForDate = (date: Date): DayAvailability => {
    const dateStr = date.toISOString().split('T')[0]
    const availability = sampleAvailability.find(a => a.date === dateStr)
    
    if (availability) return availability
    
    // Default availability for dates not specified
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
    
    if (isPast) {
      return { date: dateStr, status: 'unavailable', slots: [] }
    }
    
    if (isWeekend) {
      return { date: dateStr, status: 'limited', slots: [{ start: '14:00', end: '16:00', timezone: 'UTC' }] }
    }
    
    // Default weekday availability
    return {
      date: dateStr,
      status: 'available',
      slots: [
        { start: '09:00', end: '12:00', timezone: 'UTC' },
        { start: '14:00', end: '17:00', timezone: 'UTC' }
      ],
      bookingUrl: 'https://calendly.com/web3dev/consultation'
    }
  }

  // Get calendar grid for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday
    
    const days = []
    const currentDay = new Date(startDate)
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
    setHoveredDate(null)
  }

  const handleDateMouseEnter = (day: Date, event: React.MouseEvent) => {
    const availability = getAvailabilityForDate(day)
    const rect = event.currentTarget.getBoundingClientRect()
    
    const x = rect.right + 10
    const y = rect.top + (rect.height / 2)
    
    setHoveredDate({
      day: availability,
      x: x,
      y: y
    })
    setShowTooltip(true)
  }

  const handleDateMouseLeave = () => {
    setShowTooltip(false)
    setHoveredDate(null)
  }

  const handleDateClick = (day: Date) => {
    const availability = getAvailabilityForDate(day)
    if (availability.bookingUrl && availability.status !== 'busy' && availability.status !== 'unavailable') {
      window.open(availability.bookingUrl, '_blank')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-cyber-500'
      case 'limited':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getDateClasses = (day: Date, availability: DayAvailability) => {
    const isCurrentMonth = day.getMonth() === currentDate.getMonth()
    const isToday = day.toDateString() === new Date().toDateString()
    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))
    
    let classes = 'relative w-full h-12 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 '
    
    if (!isCurrentMonth) {
      classes += 'text-foreground/30 '
    } else if (isPast) {
      classes += 'text-foreground/40 cursor-not-allowed '
    } else {
      classes += 'text-foreground cursor-pointer hover:scale-105 hover:shadow-lg '
      
      // Add status-specific hover effects
      if (availability.status === 'available') {
        classes += 'hover:bg-cyber-500/10 hover:border-cyber-500/50 '
      } else if (availability.status === 'limited') {
        classes += 'hover:bg-yellow-500/10 hover:border-yellow-500/50 '
      } else if (availability.status === 'busy') {
        classes += 'hover:bg-red-500/10 hover:border-red-500/50 cursor-not-allowed '
      }
    }
    
    if (isToday) {
      classes += 'ring-2 ring-primary-500 '
    }
    
    classes += 'border border-border '
    
    return classes
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg border border-border hover:border-cyber-500 hover:bg-cyber-500/10 transition-colors duration-200"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-border hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-500 transition-colors duration-200"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg border border-border hover:border-cyber-500 hover:bg-cyber-500/10 transition-colors duration-200"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6 p-4 rounded-lg bg-muted">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-cyber-500"></div>
          <span className="text-foreground/80">Available</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-foreground/80">Limited</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-foreground/80">Busy</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-foreground/60">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getCalendarDays().map((day, index) => {
          const availability = getAvailabilityForDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))
          
          return (
            <div key={index} className="aspect-square">
              <div
                className={getDateClasses(day, availability)}
                onMouseEnter={(e) => !isPast && isCurrentMonth && handleDateMouseEnter(day, e)}
                onMouseLeave={handleDateMouseLeave}
                onClick={() => !isPast && isCurrentMonth && handleDateClick(day)}
              >
                <span>{day.getDate()}</span>
                
                {/* Status indicator */}
                {isCurrentMonth && !isPast && (
                  <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${getStatusColor(availability.status)}`}></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      
      {/* Hover Tooltip */}
      {showTooltip && hoveredDate && (
        <div
          className="fixed z-50"
          style={{
            left: hoveredDate.x,
            top: hoveredDate.y,
            transform: 'translateY(-50%)', // Center vertically with the date
          }}
        >
          {/* Tooltip Arrow */}
          <div 
            className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-4 h-4 rotate-45 bg-card border-l border-b border-border"
            style={{ zIndex: -1 }}
          />
          
          {/* Tooltip Content */}
          <div className="bg-card border border-border rounded-lg shadow-xl p-5 min-w-[280px] max-w-[320px]">
            <div className="text-base font-semibold text-foreground mb-3">
              {new Date(hoveredDate.day.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            {hoveredDate.day.slots.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-foreground/70 font-medium">Available Times:</div>
                <div className="space-y-2">
                  {hoveredDate.day.slots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-cyber-500/5 border border-cyber-500/20">
                      <span className="text-cyber-500 font-semibold text-sm">
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                      </span>
                      <span className="text-xs text-foreground/60 bg-muted px-2 py-1 rounded-full">
                        {slot.timezone}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Click to book note */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-center space-x-2 text-primary-500 bg-primary-500/5 p-3 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span className="text-sm font-medium">Click this date to book consultation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-500 font-medium">
                    {hoveredDate.day.status === 'busy' ? 'No availability' : 'Fully booked'}
                  </span>
                </div>
                {hoveredDate.day.notes && (
                  <div className="text-sm text-foreground/60 bg-muted p-2 rounded-md">
                    {hoveredDate.day.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      <div className="mt-6 p-4 rounded-lg bg-primary-500/5 border border-primary-500/20 md:hidden">
        <div className="text-sm text-foreground/70 text-center">
          <span className="text-primary-500 font-medium">Tap</span> any available date to schedule a consultation
        </div>
      </div>
    </div>
  )
}