import { NextRequest, NextResponse } from 'next/server'
import { AvailabilityService } from '@/lib/availability-service'

// GET /api/availability/stats - Get availability statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')
    const yearParam = searchParams.get('year')
    
    const month = monthParam ? parseInt(monthParam) : undefined
    const year = yearParam ? parseInt(yearParam) : undefined
    
    // Validate month if provided
    if (month !== undefined && (month < 0 || month > 11)) {
      return NextResponse.json(
        { error: 'Month must be between 0 and 11' },
        { status: 400 }
      )
    }
    
    // Validate year if provided
    if (year !== undefined && (year < 2020 || year > 2030)) {
      return NextResponse.json(
        { error: 'Year must be between 2020 and 2030' },
        { status: 400 }
      )
    }
    
    const stats = AvailabilityService.getAvailabilityStats(month, year)
    
    return NextResponse.json({
      ...stats,
      month: month ?? new Date().getMonth(),
      year: year ?? new Date().getFullYear()
    })
  } catch (error) {
    console.error('Error fetching availability stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability statistics' },
      { status: 500 }
    )
  }
}