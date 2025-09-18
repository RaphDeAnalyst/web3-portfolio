/**
 * Production-safe logging utility
 * Logs to console in development, can be extended for production logging services
 */

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isTest = process.env.NODE_ENV === 'test'

  private shouldLog(): boolean {
    return this.isDevelopment || this.isTest
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog()) {
      if (context) {
        // eslint-disable-next-line no-console
        console.info(`ℹ️ ${message}`, context)
      } else {
        // eslint-disable-next-line no-console
        console.info(`ℹ️ ${message}`)
      }
    }
  }

  error(message: string, error?: Error | any, context?: LogContext): void {
    if (this.shouldLog()) {
      const logData = {
        ...context,
        ...(error && {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
        }),
      }

      if (Object.keys(logData).length > 0) {
        // eslint-disable-next-line no-console
        console.error(`❌ ${message}`, logData)
      } else {
        // eslint-disable-next-line no-console
        console.error(`❌ ${message}`)
      }
    }

    // In production, this could send to error tracking service (Sentry, etc.)
    // this.sendToErrorService(message, error, context)
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog()) {
      if (context) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ ${message}`, context)
      } else {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ ${message}`)
      }
    }
  }

  success(message: string, context?: LogContext): void {
    if (this.shouldLog()) {
      if (context) {
        // eslint-disable-next-line no-console
        console.log(`✅ ${message}`, context)
      } else {
        // eslint-disable-next-line no-console
        console.log(`✅ ${message}`)
      }
    }
  }

  // For API routes and server-side logging where we need some production logging
  serverLog(level: 'info' | 'error' | 'warn', message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}`

    switch (level) {
      case 'error':
        // eslint-disable-next-line no-console
        console.error(logMessage, context || '')
        break
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(logMessage, context || '')
        break
      default:
        // eslint-disable-next-line no-console
        console.log(logMessage, context || '')
    }
  }
}

export const logger = new Logger()