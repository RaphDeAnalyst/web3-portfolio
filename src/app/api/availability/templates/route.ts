import { NextRequest, NextResponse } from 'next/server'
import { AvailabilityService, WeeklyTemplate } from '@/lib/availability-service'

// GET /api/availability/templates - Get all weekly templates
export async function GET() {
  try {
    const templates = AvailabilityService.getWeeklyTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/availability/templates - Create or update a weekly template
export async function POST(request: NextRequest) {
  try {
    const template: WeeklyTemplate = await request.json()
    
    // Validate template structure
    if (!template.name || !template.days) {
      return NextResponse.json(
        { error: 'Template name and days are required' },
        { status: 400 }
      )
    }
    
    // Validate template name
    if (template.name.trim().length < 1 || template.name.length > 50) {
      return NextResponse.json(
        { error: 'Template name must be between 1 and 50 characters' },
        { status: 400 }
      )
    }
    
    // Validate days structure
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const validStatuses = ['available', 'limited', 'busy', 'unavailable']
    
    for (const [dayName, dayData] of Object.entries(template.days)) {
      if (!validDays.includes(dayName.toLowerCase())) {
        return NextResponse.json(
          { error: `Invalid day name: ${dayName}` },
          { status: 400 }
        )
      }
      
      if (!validStatuses.includes(dayData.status)) {
        return NextResponse.json(
          { error: `Invalid status for ${dayName}: ${dayData.status}` },
          { status: 400 }
        )
      }
      
      // Validate time slots
      if (dayData.slots) {
        for (const slot of dayData.slots) {
          if (!slot.start || !slot.end || !slot.timezone) {
            return NextResponse.json(
              { error: `Invalid time slot for ${dayName}` },
              { status: 400 }
            )
          }
          
          // Validate time format
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
          if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
            return NextResponse.json(
              { error: `Invalid time format for ${dayName}` },
              { status: 400 }
            )
          }
        }
      }
    }
    
    AvailabilityService.saveWeeklyTemplate(template)
    
    return NextResponse.json(
      { message: 'Template saved successfully', template },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving template:', error)
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    )
  }
}

// DELETE /api/availability/templates - Delete a weekly template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateName = searchParams.get('name')
    
    if (!templateName) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      )
    }
    
    // Check if template exists
    const templates = AvailabilityService.getWeeklyTemplates()
    const templateExists = templates.some(t => t.name === templateName)
    
    if (!templateExists) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    AvailabilityService.deleteWeeklyTemplate(templateName)
    
    return NextResponse.json(
      { message: 'Template deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}