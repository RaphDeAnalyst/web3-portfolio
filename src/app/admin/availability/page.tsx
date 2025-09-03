'use client'

import { useState, useEffect } from 'react'
import { AvailabilityService, TimeSlot, DayAvailability } from '@/lib/availability-service'

interface TooltipData {
  day: DayAvailability
  x: number
  y: number
}

export default function AvailabilityAdmin() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingDay, setEditingDay] = useState<DayAvailability | null>(null)
  const [stats, setStats] = useState({
    available: 0,
    limited: 0,
    busy: 0,
    unavailable: 0,
    totalSlots: 0
  })

  // Load availability data from API
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        // Fetch from API
        const response = await fetch('/api/availability')
        if (response.ok) {
          const apiData = await response.json()
          setAvailability(apiData)
        }
        
        // Update localStorage to keep admin panel in sync
        const localData = AvailabilityService.getAvailability()
        
        // Merge API data with local data (API takes precedence)
        const mergedData = [...apiData]
        localData.forEach(localItem => {
          const exists = apiData.some(apiItem => apiItem.date === localItem.date)
          if (!exists) {
            mergedData.push(localItem)
          }
        })
        
        // Save merged data to both local and API
        AvailabilityService.saveAvailability(mergedData)
        
        const currentStats = AvailabilityService.getAvailabilityStats(
          currentDate.getMonth(),
          currentDate.getFullYear()
        )
        setStats(currentStats)
      } catch (error) {
        console.error('Error loading availability:', error)
        // Fallback to localStorage if API fails
        const localData = AvailabilityService.getAvailability()
        setAvailability(localData)
        
        const currentStats = AvailabilityService.getAvailabilityStats(
          currentDate.getMonth(),
          currentDate.getFullYear()
        )
        setStats(currentStats)
      }
    }

    loadAvailability()
  }, [currentDate])

  // Get availability for a specific date using the service
  const getAvailabilityForDate = (date: Date): DayAvailability => {
    return AvailabilityService.getEffectiveAvailability(date)
  }

  // Get calendar grid for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDay = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const handleDateClick = (day: Date) => {
    // Use local date to avoid timezone issues
    const year = day.getFullYear()
    const month = String(day.getMonth() + 1).padStart(2, '0')
    const dayNum = String(day.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${dayNum}`
    
    const dayAvailability = getAvailabilityForDate(day)
    
    setSelectedDate(dateStr)
    setEditingDay(dayAvailability)
    setShowEditor(true)
  }

  const handleSaveAvailability = async (updatedDay: DayAvailability) => {
    try {
      // Save to API first
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDay),
      })
      
      if (response.ok) {
        // Save using the localStorage service for admin panel consistency
        AvailabilityService.updateDayAvailability(updatedDay)
        
        // Update local state
        const updatedAvailability = availability.filter(a => a.date !== updatedDay.date)
        updatedAvailability.push(updatedDay)
        setAvailability(updatedAvailability)
        
        // Update stats
        const currentStats = AvailabilityService.getAvailabilityStats(
          currentDate.getMonth(),
          currentDate.getFullYear()
        )
        setStats(currentStats)
        
        // Close editor
        setShowEditor(false)
        setSelectedDate(null)
        setEditingDay(null)
      } else {
        console.error('Failed to save availability to API')
        alert('Failed to save availability. Please try again.')
      }
    } catch (error) {
      console.error('Error saving availability:', error)
      alert('Failed to save availability. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'limited':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-green-500/50 hover:border-green-500'
      case 'limited':
        return 'border-yellow-500/50 hover:border-yellow-500'
      case 'busy':
        return 'border-red-500/50 hover:border-red-500'
      default:
        return 'border-gray-400/50 hover:border-gray-400'
    }
  }

  const getDateClasses = (day: Date, dayAvailability: DayAvailability) => {
    const isCurrentMonth = day.getMonth() === currentDate.getMonth()
    const isToday = day.toDateString() === new Date().toDateString()
    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))
    // Use local date to avoid timezone issues for comparison
    const year = day.getFullYear()
    const month = String(day.getMonth() + 1).padStart(2, '0')
    const dayNum = String(day.getDate()).padStart(2, '0')
    const dayDateStr = `${year}-${month}-${dayNum}`
    const isSelected = selectedDate === dayDateStr
    
    let classes = 'relative w-full h-16 flex flex-col items-center justify-center text-sm font-medium rounded-lg border-2 transition-all duration-200 cursor-pointer '
    
    if (!isCurrentMonth) {
      classes += 'text-foreground/30 border-transparent hover:border-gray-300 '
    } else if (isPast) {
      classes += 'text-foreground/40 border-gray-200 cursor-not-allowed '
    } else {
      classes += `text-foreground ${getStatusBorder(dayAvailability.status)} hover:scale-105 hover:shadow-md `
    }
    
    if (isSelected) {
      classes += 'ring-2 ring-primary-500 ring-offset-2 '
    }
    
    if (isToday && !isSelected) {
      classes += 'ring-2 ring-cyber-500 ring-offset-1 '
    }
    
    return classes
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Availability Management</h1>
          <p className="text-foreground/70">Manage your consultation availability and booking schedule.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">
            Set Weekly Template
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-primary-500 hover:text-primary-500 transition-colors">
            Bulk Edit
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white text-xl">
              📅
            </div>
            <span className="text-2xl font-bold text-foreground">{stats.available}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Available Days</h3>
          <p className="text-sm text-foreground/60">This month</p>
        </div>
        
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center text-white text-xl">
              ⏰
            </div>
            <span className="text-2xl font-bold text-foreground">{stats.limited}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Limited Days</h3>
          <p className="text-sm text-foreground/60">Partial availability</p>
        </div>
        
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center text-white text-xl">
              🚫
            </div>
            <span className="text-2xl font-bold text-foreground">{stats.busy}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Busy Days</h3>
          <p className="text-sm text-foreground/60">No availability</p>
        </div>
        
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xl">
              📊
            </div>
            <span className="text-2xl font-bold text-foreground">{stats.totalSlots}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Time Slots</h3>
          <p className="text-sm text-foreground/60">Total available</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Legend */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-foreground/80">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-foreground/80">Limited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-foreground/80">Busy</span>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-500 transition-colors duration-200"
              >
                Today
              </button>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-foreground/60">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {getCalendarDays().map((day, index) => {
            const dayAvailability = getAvailabilityForDate(day)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))
            
            return (
              <div key={index} className="aspect-square">
                <div
                  className={getDateClasses(day, dayAvailability)}
                  onClick={() => !isPast && isCurrentMonth && handleDateClick(day)}
                >
                  <span className="text-lg font-semibold">{day.getDate()}</span>
                  
                  {/* Status indicator */}
                  {isCurrentMonth && !isPast && (
                    <div className={`w-2 h-2 rounded-full mt-1 ${getStatusColor(dayAvailability.status)}`}></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Day Editor Modal */}
      {showEditor && editingDay && (
        <DayEditor
          day={editingDay}
          onSave={handleSaveAvailability}
          onClose={() => {
            setShowEditor(false)
            setSelectedDate(null)
            setEditingDay(null)
          }}
        />
      )}
    </div>
  )
}

// Day Editor Component
function DayEditor({ 
  day, 
  onSave, 
  onClose 
}: { 
  day: DayAvailability
  onSave: (day: DayAvailability) => void
  onClose: () => void
}) {
  const [status, setStatus] = useState(day.status)
  const [slots, setSlots] = useState<TimeSlot[]>(day.slots)
  const [notes, setNotes] = useState(day.notes || '')
  const [bookingUrl, setBookingUrl] = useState(day.bookingUrl || 'https://calendly.com/matthewraphael/consultation')

  const addTimeSlot = () => {
    setSlots([...slots, { start: '09:00', end: '17:00', timezone: 'UTC' }])
  }

  const removeTimeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = slots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    )
    setSlots(updatedSlots)
  }

  const handleSave = () => {
    onSave({
      ...day,
      status,
      slots,
      notes: notes.trim() || undefined,
      bookingUrl: bookingUrl.trim() || undefined
    })
  }

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-foreground">Edit Availability</h3>
            <p className="text-foreground/70">{formatDate(day.date)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Status</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'available', label: 'Available', color: 'green', icon: '✅' },
                { value: 'limited', label: 'Limited', color: 'yellow', icon: '⚠️' },
                { value: 'busy', label: 'Busy', color: 'red', icon: '🚫' },
                { value: 'unavailable', label: 'Unavailable', color: 'gray', icon: '❌' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value as any)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    status === option.value
                      ? `border-${option.color}-500 bg-${option.color}-500/10`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium text-foreground">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {(status === 'available' || status === 'limited') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-foreground">Time Slots</label>
                <button
                  onClick={addTimeSlot}
                  className="px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Slot
                </button>
              </div>
              
              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-background text-foreground"
                    />
                    <span className="text-foreground/60">to</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-background text-foreground"
                    />
                    <select
                      value={slot.timezone}
                      onChange={(e) => updateTimeSlot(index, 'timezone', e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-background text-foreground"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                      <option value="GMT">GMT</option>
                    </select>
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="p-1 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {slots.length === 0 && (
                  <div className="text-center py-6 text-foreground/50">
                    No time slots added. Click "Add Slot" to add availability.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking URL */}
          {(status === 'available' || status === 'limited') && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Booking URL</label>
              <input
                type="url"
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                placeholder="https://calendly.com/matthewraphael/consultation"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes or instructions..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-foreground hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}