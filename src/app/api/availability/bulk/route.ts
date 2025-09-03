import { NextRequest, NextResponse } from 'next/server'
import { AvailabilityService, DayAvailability } from '@/lib/availability-service'

interface BulkUpdateRequest {
  startDate: string
  endDate: string
  template: Partial<DayAvailability>
}

interface TemplateApplyRequest {
  templateName: string
  startDate: string
  weeks?: number
}

// POST /api/availability/bulk - Bulk update availability for a date range
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'template') {
      // Apply weekly template
      const data: TemplateApplyRequest = await request.json()
      
      if (!data.templateName || !data.startDate) {
        return NextResponse.json(
          { error: 'Template name and start date are required' },
          { status: 400 }
        )
      }
      
      const startDate = new Date(data.startDate)
      const weeks = data.weeks || 4
      
      try {
        AvailabilityService.applyWeeklyTemplate(data.templateName, startDate, weeks)
        
        return NextResponse.json({
          message: `Applied template "${data.templateName}" for ${weeks} weeks starting from ${data.startDate}`
        })
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    }
    
    // Default bulk update
    const data: BulkUpdateRequest = await request.json()
    
    if (!data.startDate || !data.endDate || !data.template) {
      return NextResponse.json(
        { error: 'Start date, end date, and template are required' },
        { status: 400 }
      )
    }
    
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    
    if (startDate > endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      )
    }
    
    AvailabilityService.bulkUpdateAvailability(startDate, endDate, data.template)
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    return NextResponse.json({
      message: `Updated availability for ${daysDiff} days from ${data.startDate} to ${data.endDate}`
    })
    
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk update' },
      { status: 500 }
    )
  }
}