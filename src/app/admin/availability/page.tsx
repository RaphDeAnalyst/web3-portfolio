'use client'

import { useState } from 'react'
import { Calendar, Clock, ExternalLink, Settings, RefreshCw } from 'lucide-react'

export default function AvailabilityManagement() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefreshCalendar = () => {
    setIsLoading(true)
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 1000)
  }

  const quickActions = [
    {
      title: 'Open Calendly Dashboard',
      description: 'Manage your availability settings, time slots, and booking preferences',
      icon: <Settings className="w-6 h-6" />,
      action: () => window.open('https://calendly.com/app/scheduled_events/user/me', '_blank'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'View Scheduled Events',
      description: 'See all upcoming consultations and meetings',
      icon: <Calendar className="w-6 h-6" />,
      action: () => window.open('https://calendly.com/app/scheduled_events/user/me', '_blank'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Manage Event Types',
      description: 'Configure different types of consultations and their durations',
      icon: <Clock className="w-6 h-6" />,
      action: () => window.open('https://calendly.com/app/event_types/user/me', '_blank'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ]

  const currentSchedule = [
    { day: 'Monday - Friday', time: '9:00 AM - 5:00 PM WAT', status: 'Available', color: 'text-green-600' },
    { day: 'Saturday', time: '10:00 AM - 1:00 PM WAT', status: 'Limited', color: 'text-yellow-600' },
    { day: 'Sunday', time: 'Not Available', status: 'Closed', color: 'text-red-600' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Availability Management
          </h1>
          <p className="text-foreground/70">
            Manage your consultation schedule and booking settings through Calendly integration.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleRefreshCalendar}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-foreground bg-background hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
      </div>

      {/* Current Schedule Overview */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">Current Schedule</h2>
        <div className="space-y-4">
          {currentSchedule.map((schedule, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex-1">
                <div className="font-medium text-foreground">{schedule.day}</div>
                <div className="text-sm text-foreground/60">{schedule.time}</div>
              </div>
              <div className={`mt-2 sm:mt-0 text-sm font-medium ${schedule.color}`}>
                {schedule.status}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Live Calendar Integration</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your availability is automatically synced with Calendly. Changes made in Calendly will be reflected across your portfolio.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`group p-6 rounded-lg ${action.color} ${action.hoverColor} text-white transition-all duration-200 hover:scale-105 hover:shadow-lg text-left`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-white/20">{action.icon}</div>
                <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Calendar Preview */}
      <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Calendar Preview</h2>
          <button
            onClick={() => window.open('https://calendly.com/matthewraphael-matthewraphael', '_blank')}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Full Calendar <ExternalLink className="ml-1 w-4 h-4" />
          </button>
        </div>

        {/* Calendar Widget */}
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <iframe
            src="https://calendly.com/matthewraphael-matthewraphael/30min?embed_domain=localhost&embed_type=Inline"
            width="100%"
            height="700"
            frameBorder="0"
            title="Calendly Scheduling"
            className="w-full"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-foreground/60">
            This is a preview of your public booking calendar. Visitors can use this to schedule consultations.
          </p>
        </div>
      </div>

      {/* Settings & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integration Status */}
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Integration Status</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-foreground">Calendly Connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-foreground">Portfolio Calendar Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-foreground">Contact Form Integrated</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Pro Tips</h3>
          <div className="space-y-3 text-sm text-foreground/70">
            <div className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Set buffer times between meetings to avoid back-to-back bookings</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Use different event types for different consultation lengths</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Enable email confirmations and reminders in Calendly settings</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Sync with your Google Calendar to avoid double bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}