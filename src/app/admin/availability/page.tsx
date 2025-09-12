'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [stats, setStats] = useState({
    available: 0,
    limited: 0,
    busy: 0,
    unavailable: 0,
    totalSlots: 0
  })
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)
  const [bulkUpdateType, setBulkUpdateType] = useState<'weekdays' | 'saturdays'>('weekdays')
  const [bulkStatus, setBulkStatus] = useState<'available' | 'limited' | 'busy' | 'unavailable'>('available')
  const [bulkSlots, setBulkSlots] = useState<TimeSlot[]>([
    { start: '09:00', end: '12:00', timezone: 'WAT' },
    { start: '13:00', end: '17:00', timezone: 'WAT' }
  ])
  const [isBulkSaving, setIsBulkSaving] = useState(false)

  // Load availability data from API
  const loadAvailability = useCallback(async () => {
      try {
        let apiData: any[] = []
        
        // Fetch from API
        const response = await fetch('/api/availability')
        if (response.ok) {
          apiData = await response.json()
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
        setAvailability(mergedData)
        
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
  }, [currentDate])

  useEffect(() => {
    loadAvailability()
  }, [loadAvailability])

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
    setIsSaving(true)
    setSaveMessage(null)
    
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
        // Update local state immediately for better UX
        const updatedAvailability = availability.filter(a => a.date !== updatedDay.date)
        updatedAvailability.push(updatedDay)
        setAvailability(updatedAvailability)
        
        // Update stats
        const currentStats = AvailabilityService.getAvailabilityStats(
          currentDate.getMonth(),
          currentDate.getFullYear()
        )
        setStats(currentStats)
        
        // Show success message
        setSaveMessage({
          type: 'success',
          text: `✅ Availability updated for ${new Date(updatedDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        })
        
        // Close editor after a brief delay
        setTimeout(() => {
          setShowEditor(false)
          setSelectedDate(null)
          setEditingDay(null)
          setSaveMessage(null)
        }, 1500)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setSaveMessage({
          type: 'error',
          text: `❌ Failed to save: ${errorData.error || 'Unknown error'}`
        })
      }
    } catch (error) {
      console.error('Error saving availability:', error)
      setSaveMessage({
        type: 'error',
        text: '❌ Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Bulk update functions
  const handleBulkUpdate = async () => {
    setIsBulkSaving(true)
    setSaveMessage(null)
    
    try {
      // Generate dates for the next 90 days to cover weekdays/saturdays
      const today = new Date()
      const dates: string[] = []
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
        
        if (bulkUpdateType === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) {
          // Monday to Friday
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          dates.push(`${year}-${month}-${day}`)
        } else if (bulkUpdateType === 'saturdays' && dayOfWeek === 6) {
          // Saturday
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          dates.push(`${year}-${month}-${day}`)
        }
      }
      
      // Create availability objects for all dates
      const bulkAvailabilityData = dates.map(date => ({
        date,
        status: bulkStatus,
        slots: [...bulkSlots],
        bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min',
        notes: `Bulk updated: ${bulkUpdateType} set to ${bulkStatus}`
      }))
      
      // Save to API
      const response = await fetch('/api/availability/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: bulkAvailabilityData })
      })
      
      if (response.ok) {
        // Update local state immediately for better UX
        const updatedAvailability = [...availability]
        bulkAvailabilityData.forEach(newDay => {
          const existingIndex = updatedAvailability.findIndex(a => a.date === newDay.date)
          if (existingIndex !== -1) {
            updatedAvailability[existingIndex] = newDay
          } else {
            updatedAvailability.push(newDay)
          }
        })
        setAvailability(updatedAvailability)
        
        // Force refresh availability data from API to ensure consistency
        await loadAvailability()
        
        // Update stats
        const currentStats = AvailabilityService.getAvailabilityStats(
          currentDate.getMonth(),
          currentDate.getFullYear()
        )
        setStats(currentStats)
        
        setSaveMessage({
          type: 'success',
          text: `✅ Bulk updated ${dates.length} ${bulkUpdateType} to ${bulkStatus} status`
        })
        
        // Close bulk editor after delay
        setTimeout(() => {
          setShowBulkUpdate(false)
          setSaveMessage(null)
        }, 2000)
      } else {
        setSaveMessage({
          type: 'error',
          text: '❌ Failed to bulk update. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error during bulk update:', error)
      setSaveMessage({
        type: 'error',
        text: '❌ Network error during bulk update.'
      })
    } finally {
      setIsBulkSaving(false)
    }
  }
  
  const updateBulkTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = bulkSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    )
    setBulkSlots(updatedSlots)
  }
  
  const addBulkTimeSlot = () => {
    setBulkSlots([...bulkSlots, { start: '09:00', end: '17:00', timezone: 'WAT' }])
  }
  
  const removeBulkTimeSlot = (index: number) => {
    setBulkSlots(bulkSlots.filter((_, i) => i !== index))
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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Availability Management</h1>
          <p className="text-sm sm:text-base text-foreground/70">Manage your consultation availability and booking schedule.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200 flex items-center space-x-2">
            <span>Set Weekly Template</span>
          </button>
          <button 
            onClick={() => setShowBulkUpdate(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200 flex items-center space-x-2"
          >
            <span>Bulk Edit</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white text-xl">
              📅
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.available}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Available Days</h3>
          <p className="text-sm text-foreground/60">This month</p>
        </div>
        
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center text-white text-xl">
              ⏰
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.limited}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Limited Days</h3>
          <p className="text-sm text-foreground/60">Partial availability</p>
        </div>
        
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center text-white text-xl">
              🚫
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.busy}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Busy Days</h3>
          <p className="text-sm text-foreground/60">No availability</p>
        </div>
        
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xl">
              📊
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.totalSlots}</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Time Slots</h3>
          <p className="text-sm text-foreground/60">Total available</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8 shadow-sm">
        {/* Calendar Header - Mobile Responsive */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center sm:text-left">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          {/* Navigation - Mobile Optimized */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-colors duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-500 transition-colors duration-200"
            >
              Today
            </button>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-colors duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend - Mobile Stacked */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:space-x-6 mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-foreground/80">Available</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-foreground/80">Limited</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-foreground/80">Busy</span>
          </div>
        </div>

        {/* Calendar Grid - Mobile Responsive */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4 mb-4">
          {dayNames.map((day, index) => (
            <div key={day} className="h-6 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-semibold text-foreground/60">
              <span className="sm:hidden">{day.slice(0, 1)}</span>
              <span className="hidden sm:inline lg:hidden">{day.slice(0, 2)}</span>
              <span className="hidden lg:inline">{day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4">
          {getCalendarDays().map((day, index) => {
            const dayAvailability = getAvailabilityForDate(day)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))
            
            return (
              <div key={index} className="aspect-square">
                <div
                  className={`${getDateClasses(day, dayAvailability)} min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[4rem]`}
                  onClick={() => !isPast && isCurrentMonth && handleDateClick(day)}
                >
                  <span className="text-xs sm:text-sm lg:text-lg font-semibold">{day.getDate()}</span>
                  
                  {/* Status indicator - Responsive Size */}
                  {isCurrentMonth && !isPast && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-0.5 sm:mt-1 ${getStatusColor(dayAvailability.status)}`}></div>
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
            setSaveMessage(null)
          }}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      )}

      {/* Bulk Update Modal - Mobile Responsive */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-background rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Bulk Update Availability</h2>
                  <p className="text-foreground/70 text-xs sm:text-sm mt-1">
                    Update multiple days at once for the next 90 days
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowBulkUpdate(false)
                    setSaveMessage(null)
                  }}
                  className="self-end sm:self-auto p-2 text-foreground/60 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Bulk Update Type - Mobile Responsive */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Update Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setBulkUpdateType('weekdays')}
                    className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-colors ${
                      bulkUpdateType === 'weekdays'
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="font-medium text-sm sm:text-base">All Weekdays</div>
                    <div className="text-xs sm:text-sm text-foreground/60">Monday - Friday</div>
                  </button>
                  <button
                    onClick={() => setBulkUpdateType('saturdays')}
                    className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-colors ${
                      bulkUpdateType === 'saturdays'
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="font-medium text-sm sm:text-base">All Saturdays</div>
                    <div className="text-xs sm:text-sm text-foreground/60">Saturday only</div>
                  </button>
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Status</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-foreground focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Time Slots */}
              {bulkStatus !== 'unavailable' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-foreground">Time Slots</label>
                    <button
                      onClick={addBulkTimeSlot}
                      className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Add Slot
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {bulkSlots.map((slot, index) => (
                      <div key={index} className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateBulkTimeSlot(index, 'start', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-foreground text-sm"
                          />
                          <span className="text-foreground/60 text-sm">to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateBulkTimeSlot(index, 'end', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-foreground text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={slot.timezone}
                            onChange={(e) => updateBulkTimeSlot(index, 'timezone', e.target.value)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-foreground text-sm"
                          >
                            <option value="WAT">WAT</option>
                            <option value="UTC">UTC</option>
                            <option value="EST">EST</option>
                            <option value="PST">PST</option>
                          </select>
                          {bulkSlots.length > 1 && (
                            <button
                              onClick={() => removeBulkTimeSlot(index)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Message */}
              {saveMessage && (
                <div className={`p-3 rounded-lg ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'
                }`}>
                  {saveMessage.text}
                </div>
              )}

              {/* Actions - Mobile Responsive */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs sm:text-sm text-foreground/60 text-center sm:text-left">
                  This will update {bulkUpdateType} for the next 90 days
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => {
                      setShowBulkUpdate(false)
                      setSaveMessage(null)
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg hover:border-gray-400 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkUpdate}
                    disabled={isBulkSaving}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>{isBulkSaving ? 'Updating...' : 'Apply Bulk Update'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Day Editor Component
function DayEditor({ 
  day, 
  onSave, 
  onClose,
  isSaving,
  saveMessage
}: { 
  day: DayAvailability
  onSave: (day: DayAvailability) => void
  onClose: () => void
  isSaving?: boolean
  saveMessage?: {type: 'success' | 'error', text: string} | null
}) {
  const [status, setStatus] = useState(day.status)
  const [slots, setSlots] = useState<TimeSlot[]>(day.slots)
  const [notes, setNotes] = useState(day.notes || '')
  const [bookingUrl, setBookingUrl] = useState(day.bookingUrl || 'https://calendly.com/matthewraphael-matthewraphael/30min')

  const addTimeSlot = () => {
    setSlots([...slots, { start: '09:00', end: '17:00', timezone: 'WAT' }])
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
                      <option value="WAT">WAT</option>
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
                placeholder="https://calendly.com/your-link"
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
              placeholder="Add notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          {/* Save Message */}
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              saveMessage.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {saveMessage.text}
            </div>
          )}
          
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-foreground hover:border-gray-400 dark:hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}