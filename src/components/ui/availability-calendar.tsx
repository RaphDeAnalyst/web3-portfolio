'use client'

import { useState, useEffect } from 'react'
import { AvailabilityService, TimeSlot, DayAvailability } from '@/lib/availability-service'

interface TooltipData {
  day: DayAvailability
  x: number
  y: number
}

export function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState<TooltipData | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<number>(Date.now())

  // Fetch availability data from API
  const fetchAvailability = async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      
      // Use cache busting parameter to ensure fresh data
      const cacheParam = forceRefresh ? `&_force=${Date.now()}` : `?_t=${Date.now()}`
      const response = await fetch(`/api/availability${cacheParam}`, {
        // Prevent caching at browser level for real-time updates
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvailabilityData(data)
        setLastFetch(Date.now())
      } else {
        console.error('Failed to fetch availability:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchAvailability(true) // Force refresh on mount
    
    // Auto-refresh every 30 seconds to catch admin changes
    const intervalId = setInterval(() => fetchAvailability(true), 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  // Get availability for a specific date
  const getAvailabilityForDate = (date: Date): DayAvailability => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    const savedAvailability = availabilityData.find(a => a.date === dateStr)
    
    if (savedAvailability) {
      return savedAvailability
    }
    
    // Fallback to service default logic for dates not explicitly set
    return AvailabilityService.getDefaultAvailability(date)
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
    const tooltipWidth = 280
    const tooltipHeight = 180
    
    let x = rect.right + 10
    let y = rect.top + (rect.height / 2)
    
    // Keep tooltip within viewport bounds
    if (x + tooltipWidth > window.innerWidth) {
      x = rect.left - tooltipWidth - 10
    }
    
    if (y + tooltipHeight / 2 > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - 10
    }
    
    if (y - tooltipHeight / 2 < 0) {
      y = tooltipHeight / 2 + 10
    }
    
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

  // Build Calendly URL with date pre-selection
  const buildCalendlyUrl = (baseUrl: string, selectedDate: Date, timeSlot?: TimeSlot): string => {
    if (!baseUrl) return ''
    
    // Format date as YYYY-MM-DD for Calendly
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    // Build URL with date parameter
    const separator = baseUrl.includes('?') ? '&' : '?'
    let url = `${baseUrl}${separator}date=${dateStr}`
    
    // Optionally add time parameter if specific slot provided
    if (timeSlot) {
      url += `&time=${timeSlot.start}`
    }
    
    return url
  }

  const handleDateClick = (day: Date) => {
    const availability = getAvailabilityForDate(day)
    if (availability.bookingUrl && availability.status !== 'busy' && availability.status !== 'unavailable') {
      const calendlyUrl = buildCalendlyUrl(availability.bookingUrl, day)
      window.open(calendlyUrl, '_blank')
    }
  }

  // Handle time slot click for enhanced booking experience
  const handleTimeSlotClick = (day: Date, timeSlot: TimeSlot, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent date click from firing
    const availability = getAvailabilityForDate(day)
    if (availability.bookingUrl && availability.status !== 'busy' && availability.status !== 'unavailable') {
      const calendlyUrl = buildCalendlyUrl(availability.bookingUrl, day, timeSlot)
      window.open(calendlyUrl, '_blank')
      setShowTooltip(false) // Close tooltip after click
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
    
    let classes = 'relative w-full h-10 flex items-center justify-center text-sm font-medium rounded transition-all duration-200 '
    
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative max-w-sm mx-auto">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2 text-foreground/60">Loading availability...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-sm mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Refresh button */}
          <button
            onClick={() => fetchAvailability(true)}
            disabled={isLoading}
            className="p-1.5 rounded border border-border hover:border-primary-500 hover:bg-primary-500/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh availability"
          >
            <svg className={`w-4 h-4 text-foreground ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 rounded border border-border hover:border-cyber-500 hover:bg-cyber-500/10 transition-colors duration-200"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium rounded border border-border hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-500 transition-colors duration-200"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 rounded border border-border hover:border-cyber-500 hover:bg-cyber-500/10 transition-colors duration-200"
            aria-label="Next month"
          >
            <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mb-3 p-2 rounded bg-muted">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-cyber-500"></div>
          <span className="text-sm text-foreground/80">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-foreground/80">Limited</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm text-foreground/80">Busy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span className="text-sm text-foreground/80">Unavailable</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-6 flex items-center justify-center text-sm font-medium text-foreground/60">
            {day.substring(0, 3)}
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
          <div className="bg-card border border-border rounded-lg shadow-xl p-4 min-w-[280px] max-w-[320px]">
            <div className="text-base font-semibold text-foreground mb-3">
              {(() => {
                const [year, month, day] = hoveredDate.day.date.split('-').map(Number)
                const date = new Date(year, month - 1, day) // month is 0-indexed
                return date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })
              })()}
            </div>
            
            {(() => {
              const status = hoveredDate.day.status
              const hasSlots = hoveredDate.day.slots.length > 0
              
              if (status === 'unavailable') {
                return (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-gray-500 font-medium text-sm">Unavailable</span>
                    </div>
                    {hoveredDate.day.notes && (
                      <div className="text-sm text-foreground/60 bg-muted p-2 rounded">
                        {hoveredDate.day.notes}
                      </div>
                    )}
                  </div>
                )
              }
              
              if (status === 'busy' || !hasSlots) {
                return (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-red-500 font-medium text-sm">
                        {status === 'busy' ? 'No availability' : 'Fully booked'}
                      </span>
                    </div>
                    {hoveredDate.day.notes && (
                      <div className="text-sm text-foreground/60 bg-muted p-2 rounded">
                        {hoveredDate.day.notes}
                      </div>
                    )}
                  </div>
                )
              }
              
              // Available or Limited with slots
              return (
                <div className="space-y-3">
                  <div className="text-sm text-foreground/70 font-medium">
                    {status === 'limited' ? 'Limited Availability:' : 'Available Times:'}
                  </div>
                  <div className="space-y-2">
                    {hoveredDate.day.slots.map((slot, index) => {
                      const slotBgColor = status === 'limited' ? 'bg-yellow-500/5' : 'bg-cyber-500/5'
                      const slotBorderColor = status === 'limited' ? 'border-yellow-500/20' : 'border-cyber-500/20'
                      const slotTextColor = status === 'limited' ? 'text-yellow-500' : 'text-cyber-500'
                      const hoverBgColor = status === 'limited' ? 'hover:bg-yellow-500/10' : 'hover:bg-cyber-500/10'
                      
                      // Create date object for this slot
                      const [year, month, day] = hoveredDate.day.date.split('-').map(Number)
                      const slotDate = new Date(year, month - 1, day)
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all duration-200 ${slotBgColor} ${slotBorderColor} ${hoverBgColor} hover:scale-[1.02] hover:shadow-sm`}
                          onClick={(e) => handleTimeSlotClick(slotDate, slot, e)}
                          title="Click to book this specific time"
                        >
                          <span className={`${slotTextColor} font-semibold text-sm`}>
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-foreground/60 bg-muted px-2 py-1 rounded-full">
                              {slot.timezone}
                            </span>
                            <svg className={`w-3 h-3 ${slotTextColor} opacity-60`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {hoveredDate.day.notes && (
                    <div className="text-sm text-foreground/60 bg-muted p-2 rounded">
                      {hoveredDate.day.notes}
                    </div>
                  )}
                  
                  {/* Click to book note - only show for available/limited with booking URL */}
                  {hoveredDate.day.bookingUrl && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-primary-500 bg-primary-500/5 p-3 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="text-sm font-medium">Click to book consultation</span>
                      </div>
                      <div className="text-xs text-center text-foreground/60 space-y-1">
                        <div>• Click on any time slot above to book that specific time</div>
                        <div>• Or click this date to select the day and choose your time</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      <div className="mt-4 p-3 rounded bg-primary-500/5 border border-primary-500/20 md:hidden">
        <div className="text-sm text-foreground/70 text-center space-y-1">
          <div>
            <span className="text-primary-500 font-medium">Tap</span> any available date to schedule a consultation
          </div>
          <div className="text-xs text-foreground/60">
            Date will be pre-selected in Calendly for faster booking
          </div>
        </div>
      </div>
    </div>
  )
}