'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface TimeSlot {
  start: string
  end: string
  timezone: string
}

interface DayAvailability {
  date: string
  status: 'available' | 'limited' | 'busy' | 'unavailable'
  slots: TimeSlot[]
  bookingUrl?: string
  notes?: string
}

interface TooltipData {
  day: DayAvailability
  x: number
  y: number
  arrowPosition: 'left' | 'right'
}

export function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState<TooltipData | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
      }
    }
  }, [])

  // Your hardcoded weekly schedule
  const getAvailabilityForDate = (date: Date): DayAvailability => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
    
    if (isPast) {
      return { 
        date: dateStr, 
        status: 'unavailable', 
        slots: [] 
      }
    }
    
    // Your exact weekly schedule:
    // Monday-Friday: 09:00-17:00 WAT (Available)
    // Saturday: 10:00-13:00 WAT (Limited)
    // Sunday: Unavailable
    switch (dayOfWeek) {
      case 0: // Sunday
        return {
          date: dateStr,
          status: 'unavailable',
          slots: [],
          bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min',
          notes: 'Not available on Sundays'
        }
      
      case 1: // Monday
      case 2: // Tuesday  
      case 3: // Wednesday
      case 4: // Thursday
      case 5: // Friday
        return {
          date: dateStr,
          status: 'available',
          slots: [
            { start: '09:00', end: '17:00', timezone: 'WAT' }
          ],
          bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min',
          notes: 'Regular weekday availability'
        }
      
      case 6: // Saturday
      default:
        return {
          date: dateStr,
          status: 'limited',
          slots: [{ start: '10:00', end: '13:00', timezone: 'WAT' }],
          bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min',
          notes: 'Saturday limited hours'
        }
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

    // Clear tooltips and timeouts when navigating
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    setShowTooltip(false)
    setHoveredDate(null)
  }

  const handleDateMouseEnter = useCallback((day: Date, event: React.MouseEvent) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    // Clear any pending show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }

    const availability = getAvailabilityForDate(day)
    const rect = event.currentTarget.getBoundingClientRect()
    const tooltipWidth = 280
    const tooltipHeight = 180

    // Get the calendar container element (the parent div with max-w-sm)
    const calendarContainer = event.currentTarget.closest('.max-w-sm')
    if (!calendarContainer) return

    const containerRect = calendarContainer.getBoundingClientRect()

    // Default position: to the right of the date
    let x = rect.right + 10
    let y = rect.top + (rect.height / 2)
    let arrowPosition: 'left' | 'right' = 'left'

    // Keep tooltip within calendar container bounds
    // If tooltip would overflow on the right, position it to the left
    if (x + tooltipWidth > containerRect.right) {
      x = rect.left - tooltipWidth - 10
      arrowPosition = 'right'

      // If still overflowing left, clamp to container left edge with padding
      if (x < containerRect.left) {
        x = containerRect.left + 10
        arrowPosition = 'left'
      }
    }

    // Ensure tooltip doesn't overflow vertically
    const tooltipTop = y - tooltipHeight / 2
    const tooltipBottom = y + tooltipHeight / 2

    if (tooltipTop < containerRect.top) {
      y = containerRect.top + tooltipHeight / 2 + 10
    } else if (tooltipBottom > containerRect.bottom) {
      y = containerRect.bottom - tooltipHeight / 2 - 10
    }

    // Update tooltip data immediately for smooth transition
    setHoveredDate({
      day: availability,
      x: x,
      y: y,
      arrowPosition: arrowPosition
    })

    // Show tooltip with slight delay to prevent rapid flickering
    showTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 50)
  }, [])

  const handleDateMouseLeave = useCallback(() => {
    // Clear any pending show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }

    // Delay hiding to allow smooth transition between adjacent tooltips
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
      setHoveredDate(null)
    }, 150)
  }, [])

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
        return 'bg-accent-green'
      case 'limited':
        return 'bg-accent-warning'
      case 'busy':
        return 'bg-primary-800'
      default:
        return 'bg-primary-400'
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
        classes += 'hover:bg-accent-green/10 hover:border-accent-green/50 '
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
    <div className="relative max-w-sm mx-auto px-4 sm:px-0">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <div className="flex items-center space-x-2">
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
            className="px-3 py-1.5 text-sm font-medium rounded border border-border hover:border-accent-blue hover:bg-accent-blue/10 hover:text-accent-blue transition-all duration-200"
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
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-3 p-2 rounded bg-muted">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-cyber-500"></div>
          <span className="text-xs sm:text-sm text-foreground/80">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-accent-green"></div>
          <span className="text-xs sm:text-sm text-foreground/80">Limited</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span className="text-xs sm:text-sm text-foreground/80">Unavailable</span>
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
          onMouseEnter={() => {
            // Keep tooltip visible when mouse enters tooltip area
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
              hideTimeoutRef.current = null
            }
          }}
          onMouseLeave={() => {
            // Hide tooltip when mouse leaves tooltip area
            hideTimeoutRef.current = setTimeout(() => {
              setShowTooltip(false)
              setHoveredDate(null)
            }, 100)
          }}
        >
          {/* Tooltip Arrow */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rotate-45 bg-card border-border ${
              hoveredDate.arrowPosition === 'left'
                ? 'left-0 -translate-x-2 border-l border-b'
                : 'right-0 translate-x-2 border-r border-t'
            }`}
            style={{ zIndex: -1 }}
          />
          
          {/* Tooltip Content */}
          <div className="bg-card border border-border rounded-lg shadow-xl p-3 sm:p-4 min-w-[260px] max-w-[300px] sm:min-w-[280px] sm:max-w-[320px]">
            <div className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3">
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
                <div className="space-y-2 sm:space-y-3">
                  <div className="text-xs sm:text-sm text-foreground/70 font-medium">
                    {status === 'limited' ? 'Limited Availability:' : 'Available Times:'}
                  </div>
                  <div className="space-y-2">
                    {hoveredDate.day.slots.map((slot, index) => {
                      const slotBgColor = status === 'limited' ? 'bg-accent-warning/5' : 'bg-accent-green/5'
                      const slotBorderColor = status === 'limited' ? 'border-accent-warning/20' : 'border-accent-green/20'
                      const slotTextColor = status === 'limited' ? 'text-accent-warning' : 'text-accent-green'
                      const hoverBgColor = status === 'limited' ? 'hover:bg-accent-warning/10' : 'hover:bg-accent-green/10'
                      
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
                          <span className={`${slotTextColor} font-semibold text-xs sm:text-sm`}>
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </span>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-xs text-foreground/60 bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
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
                    <div className="text-xs sm:text-sm text-foreground/60 bg-muted p-2 rounded">
                      {hoveredDate.day.notes}
                    </div>
                  )}
                  
                  {/* Click to book note - only show for available/limited with booking URL */}
                  {hoveredDate.day.bookingUrl && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-primary-500 bg-primary-500/5 p-2 sm:p-3 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium">Click to book consultation</span>
                      </div>
                      <div className="text-xs text-center text-foreground/60 space-y-1">
                        <div>• Click any time slot to book that specific time</div>
                        <div>• Or click this date to select the day</div>
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
        <div className="text-xs sm:text-sm text-foreground/70 text-center space-y-1">
          <div>
            <span className="text-primary-500 font-medium">Tap</span> any available date to schedule
          </div>
          <div className="text-xs text-foreground/60">
            Date will be pre-selected in Calendly
          </div>
        </div>
      </div>

      {/* Fixed Schedule Information */}
      <div className="mt-4 p-3 rounded bg-gradient-to-r from-primary-500/5 to-cyber-500/5 border border-primary-500/20">
        <div className="text-xs sm:text-sm text-foreground/70 space-y-2">
          <div className="font-medium text-foreground mb-2 text-xs sm:text-sm">Regular Schedule (WAT):</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="truncate">Monday - Friday:</span>
              <span className="text-cyber-500 font-medium ml-2">9:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="truncate">Saturday:</span>
              <span className="text-accent-warning font-medium ml-2">10:00 AM - 1:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="truncate">Sunday:</span>
              <span className="text-gray-500 font-medium ml-2">Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}