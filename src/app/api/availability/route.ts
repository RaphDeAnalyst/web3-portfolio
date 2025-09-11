import { NextRequest, NextResponse } from 'next/server'
import { DayAvailability } from '@/lib/availability-service'
import fs from 'fs'
import path from 'path'

// File-based storage for availability data (in production, use a database)
const AVAILABILITY_FILE = path.join(process.cwd(), 'data', 'availability.json')

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(AVAILABILITY_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read availability data from file
const readAvailabilityData = (): DayAvailability[] => {
  try {
    ensureDataDirectory()
    if (fs.existsSync(AVAILABILITY_FILE)) {
      const data = fs.readFileSync(AVAILABILITY_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading availability file:', error)
  }
  return []
}

// Write availability data to file
const writeAvailabilityData = (data: DayAvailability[]) => {
  try {
    ensureDataDirectory()
    fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing availability file:', error)
    throw error
  }
}

// Get default availability for a date
const getDefaultAvailability = (date: Date): DayAvailability => {
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
      slots: [{ start: '14:00', end: '16:00', timezone: 'UTC' }],
      bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min'
    }
  }
  
  // Default weekday availability
  return {
    date: dateStr,
    status: 'available',
    slots: [
      { start: '09:00', end: '12:00', timezone: 'UTC' },
      { start: '14:00', end: '17:00', timezone: 'UTC' }
    ],
    bookingUrl: 'https://calendly.com/matthewraphael-matthewraphael/30min'
  }
}

// GET /api/availability - Get all availability data or for a specific date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const date = searchParams.get('date')
    
    // Get availability for a specific date
    if (date) {
      const targetDate = new Date(date)
      const allAvailability = readAvailabilityData()
      const savedAvailability = allAvailability.find(a => a.date === date)
      const availability = savedAvailability || getDefaultAvailability(targetDate)
      return NextResponse.json(availability)
    }
    
    // Get all availability data
    const allAvailability = readAvailabilityData()
    
    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      const filteredAvailability = allAvailability.filter(a => {
        const availDate = new Date(a.date)
        return availDate >= start && availDate <= end
      })
      
      return NextResponse.json(filteredAvailability)
    }
    
    return NextResponse.json(allAvailability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

// POST /api/availability - Create or update availability for a specific date
export async function POST(request: NextRequest) {
  try {
    const dayData: DayAvailability = await request.json()
    
    // Validate required fields
    if (!dayData.date || !dayData.status) {
      return NextResponse.json(
        { error: 'Date and status are required' },
        { status: 400 }
      )
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dayData.date)) {
      return NextResponse.json(
        { error: 'Date must be in YYYY-MM-DD format' },
        { status: 400 }
      )
    }
    
    // Validate status
    const validStatuses = ['available', 'limited', 'busy', 'unavailable']
    if (!validStatuses.includes(dayData.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    // Validate time slots
    if (dayData.slots) {
      for (const slot of dayData.slots) {
        if (!slot.start || !slot.end || !slot.timezone) {
          return NextResponse.json(
            { error: 'All time slot fields (start, end, timezone) are required' },
            { status: 400 }
          )
        }
        
        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
          return NextResponse.json(
            { error: 'Time must be in HH:MM format' },
            { status: 400 }
          )
        }
      }
    }
    
    // Update file-based storage
    const allAvailability = readAvailabilityData()
    const existingIndex = allAvailability.findIndex(a => a.date === dayData.date)
    
    if (existingIndex >= 0) {
      allAvailability[existingIndex] = dayData
    } else {
      allAvailability.push(dayData)
    }
    
    writeAvailabilityData(allAvailability)
    
    return NextResponse.json(
      { message: 'Availability updated successfully', data: dayData },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}

// DELETE /api/availability - Delete availability for a specific date
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }
    
    // Delete from file-based storage
    const allAvailability = readAvailabilityData()
    const filteredAvailability = allAvailability.filter(a => a.date !== date)
    writeAvailabilityData(filteredAvailability)
    
    return NextResponse.json(
      { message: 'Availability deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json(
      { error: 'Failed to delete availability' },
      { status: 500 }
    )
  }
}