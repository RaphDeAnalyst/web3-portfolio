import { NextRequest, NextResponse } from 'next/server'
import { DayAvailability } from '@/lib/availability-service'
import fs from 'fs'
import path from 'path'

// File-based storage for availability data (same as main API route)
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

export async function POST(request: NextRequest) {
  try {
    const { updates } = await request.json()
    
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Invalid updates format' },
        { status: 400 }
      )
    }
    
    // Validate each update
    for (const update of updates) {
      if (!update.date || !update.status) {
        return NextResponse.json(
          { error: 'Each update must have date and status' },
          { status: 400 }
        )
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(update.date)) {
        return NextResponse.json(
          { error: 'Date must be in YYYY-MM-DD format' },
          { status: 400 }
        )
      }
      
      // Validate status
      const validStatuses = ['available', 'limited', 'busy', 'unavailable']
      if (!validStatuses.includes(update.status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
    }
    
    // Get existing availability data from file storage
    const existingAvailability = readAvailabilityData()
    
    // Apply bulk updates
    const updatedAvailability = [...existingAvailability]
    
    updates.forEach(update => {
      const existingIndex = updatedAvailability.findIndex(a => a.date === update.date)
      if (existingIndex !== -1) {
        // Update existing entry
        updatedAvailability[existingIndex] = {
          ...updatedAvailability[existingIndex],
          ...update
        }
      } else {
        // Add new entry
        updatedAvailability.push(update)
      }
    })
    
    // Save the updated data to file storage
    writeAvailabilityData(updatedAvailability)
    
    return NextResponse.json({ 
      success: true, 
      message: `Bulk updated ${updates.length} entries`,
      updatedCount: updates.length
    })
    
  } catch (error) {
    console.error('Bulk availability update error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk update' },
      { status: 500 }
    )
  }
}
