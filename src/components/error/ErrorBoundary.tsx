'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  section?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    logger.error(`Error in ${this.props.section || 'component'}`, error, {
      section: this.props.section,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    })
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service (e.g., Sentry, LogRocket)
      // sendErrorToService(error, errorInfo, this.props.section)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[200px] bg-background/50 border border-red-200/50 dark:border-red-800/50 rounded-2xl">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground">
              Something went wrong
            </h3>
            <p className="text-foreground/70 max-w-md">
              {this.props.section 
                ? `There was an error loading the ${this.props.section} section.`
                : 'An unexpected error occurred.'
              }
            </p>
            
            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-800 dark:text-red-300 overflow-auto">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}