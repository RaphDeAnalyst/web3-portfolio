'use client'

import { useState, useEffect } from 'react'
import { ActivityService } from '@/lib/activity-service'

interface ActivityGraphProps {
  year?: number
  showTooltip?: boolean
}

export function ActivityGraph({ year, showTooltip = true }: ActivityGraphProps) {
  const [data, setData] = useState<{ date: string; intensity: number; activities: any[] }[]>([])
  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear())
  const [hoveredCell, setHoveredCell] = useState<{ date: string; intensity: number; activities: any[] } | null>(null)

  useEffect(() => {
    // Initialize sample data on first load
    ActivityService.initializeSampleData()
    
    // Load year data
    const yearData = ActivityService.getYearData(selectedYear)
    setData(yearData)
  }, [selectedYear])

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Group data by weeks (GitHub style - Sunday start, proper week grouping)
  const getWeeklyData = () => {
    const weeks: ({ date: string; intensity: number; activities: any[] } | null)[][] = []
    
    if (data.length === 0) return weeks
    
    // Create a map for quick date lookup
    const dataMap = new Map(data.map(d => [d.date, d]))
    
    // For current year (365 days view), start from first Sunday before the data range
    const firstDate = new Date(data[0].date)
    const lastDate = new Date(data[data.length - 1].date)
    
    // Find the first Sunday at or before the first date
    const firstSunday = new Date(firstDate)
    firstSunday.setDate(firstDate.getDate() - firstDate.getDay())
    
    // Find the last Saturday at or after the last date
    const lastSaturday = new Date(lastDate)
    const daysUntilSaturday = (6 - lastDate.getDay()) % 7
    lastSaturday.setDate(lastDate.getDate() + daysUntilSaturday)
    
    let currentDate = new Date(firstSunday)
    
    while (currentDate <= lastSaturday) {
      const week: ({ date: string; intensity: number; activities: any[] } | null)[] = []
      
      // Add 7 days to the week
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const dayData = dataMap.get(dateStr)
        
        // Include data if it exists, otherwise null for padding days
        if (dayData) {
          week.push(dayData)
        } else if (currentDate >= firstDate && currentDate <= lastDate) {
          // Empty day within our data range
          week.push({ date: dateStr, intensity: 0, activities: [] })
        } else {
          // Padding days outside our data range
          week.push(null)
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      weeks.push(week)
    }

    return weeks
  }

  const getIntensityColor = (intensity: number): string => {
    switch (intensity) {
      case 0: return 'bg-[#ebedf0] dark:bg-[#161b22]'
      case 1: return 'bg-[#9be9a8] dark:bg-[#0e4429]'
      case 2: return 'bg-[#40c463] dark:bg-[#006d32]'
      case 3: return 'bg-[#30a14e] dark:bg-[#26a641]'
      case 4: return 'bg-[#216e39] dark:bg-[#39d353]'
      default: return 'bg-[#ebedf0] dark:bg-[#161b22]'
    }
  }

  const formatTooltipDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getContributionText = (count: number) => {
    if (count === 0) return 'No contributions'
    if (count === 1) return '1 contribution'
    return `${count} contributions`
  }

  const weeklyData = getWeeklyData()
  const stats = ActivityService.getActivityStats()

  return (
    <div className="space-y-4">
      {/* Year Selector */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70">
          {stats.total} contributions in {selectedYear}
        </div>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1 text-sm bg-gray-900 dark:bg-gray-800 text-white border border-gray-600 dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyber-500/20 focus:border-cyber-500"
        >
          {Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Graph */}
      <div className="relative">
        {/* Month Labels */}
        <div className="flex mb-2 text-xs text-foreground/60">
          <div className="w-8"></div> {/* Space for weekday labels */}
          <div className="flex relative" style={{ width: `${weeklyData.length * 11}px` }}>
            {weeklyData.map((week, weekIndex) => {
              // Get the first day of this week
              const firstDay = week.find(day => day !== null)
              if (!firstDay) return null
              
              const weekDate = new Date(firstDay.date)
              const month = weekDate.getMonth()
              const dayOfMonth = weekDate.getDate()
              
              // Show month label if it's the first week of the month or first week
              const showLabel = (dayOfMonth <= 7 && weekIndex === 0) || 
                               (dayOfMonth <= 7 && weekIndex > 0 && 
                                new Date(weeklyData[weekIndex - 1]?.find(d => d !== null)?.date || '').getMonth() !== month)
              
              return (
                <div key={weekIndex} className="relative" style={{ width: '13px' }}>
                  {showLabel && (
                    <div className="absolute text-xs text-foreground/60 whitespace-nowrap -ml-1">
                      {months[month]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="flex">
          {/* Weekday Labels */}
          <div className="flex flex-col text-xs text-foreground/60 pr-3">
            {['Mon', 'Wed', 'Fri'].map((day, index) => (
              <div key={day} className="h-[10px] mb-[3px] flex items-center" style={{ 
                marginTop: index === 0 ? '11px' : '14px' 
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Activity Cells */}
          <div className="flex gap-[2px] overflow-x-auto">
            {weeklyData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((dayData, dayIndex) => {
                  const isEmpty = !dayData
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-[9px] h-[9px] rounded-[1px] ${
                        isEmpty 
                          ? 'bg-transparent' 
                          : `${getIntensityColor(dayData.intensity)} hover:ring-1 hover:ring-black/20 dark:hover:ring-white/20 cursor-pointer transition-all`
                      }`}
                      onMouseEnter={() => dayData && setHoveredCell(dayData)}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={dayData ? `${formatTooltipDate(dayData.date)}: ${getContributionText(dayData.activities.length)}` : ''}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && hoveredCell && (
          <div className="absolute z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none"
               style={{ 
                 top: '100%', 
                 left: '50%', 
                 transform: 'translateX(-50%)',
                 marginTop: '8px'
               }}>
            <div className="font-medium mb-1">{formatTooltipDate(hoveredCell.date)}</div>
            <div className="text-gray-300 mb-2">
              {getContributionText(hoveredCell.activities.length)}
            </div>
            {hoveredCell.activities.length > 0 && (
              <div className="space-y-1">
                {hoveredCell.activities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="text-xs flex items-center space-x-2">
                    <span className="flex-shrink-0">
                      {activity.type === 'post' ? '📝' : 
                       activity.type === 'project' ? '💼' : 
                       activity.type === 'media' ? '🖼️' : '📈'}
                    </span>
                    <span className="truncate">{activity.title}</span>
                  </div>
                ))}
                {hoveredCell.activities.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{hoveredCell.activities.length - 3} more
                  </div>
                )}
              </div>
            )}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <div className="border-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end text-xs text-foreground/60 space-x-2">
        <span>Less</span>
        <div className="flex items-center space-x-[3px]">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[9px] h-[9px] rounded-[1px] ${getIntensityColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{stats.total}</div>
          <div className="text-xs text-foreground/60">Total contributions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{stats.streak}</div>
          <div className="text-xs text-foreground/60">Day streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{stats.thisMonth}</div>
          <div className="text-xs text-foreground/60">This month</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{Math.round(stats.averagePerMonth)}</div>
          <div className="text-xs text-foreground/60">Monthly avg</div>
        </div>
      </div>
    </div>
  )
}