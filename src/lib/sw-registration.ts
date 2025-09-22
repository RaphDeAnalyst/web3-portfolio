/**
 * Service Worker Registration and Management
 * Handles PWA functionality and offline caching
 */

import { logger } from '@/lib/logger'

interface ServiceWorkerManager {
  register(): Promise<void>
  unregister(): Promise<boolean>
  update(): Promise<void>
  clearCache(): Promise<void>
  isSupported(): boolean
}

class ServiceWorkerManagerImpl implements ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null

  /**
   * Check if service workers are supported in this browser
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator
  }

  /**
   * Register the service worker
   */
  async register(): Promise<void> {
    if (!this.isSupported()) {
      logger.info('Service Worker not supported in this browser')
      return
    }

    try {
      // Only register in production or when explicitly enabled
      const shouldRegister = process.env.NODE_ENV === 'production' ||
                             process.env.NEXT_PUBLIC_SW_ENABLED === 'true'

      if (!shouldRegister) {
        logger.info('Service Worker disabled in development')
        return
      }

      logger.info('Registering service worker')

      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      logger.success('Service Worker registered successfully', { scope: this.registration.scope })

      // Listen for updates
      this.registration.addEventListener('updatefound', this.handleUpdateFound.bind(this))

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', this.handleControllerChange.bind(this))

      // Check for waiting service worker
      if (this.registration.waiting) {
        this.showUpdateAvailable()
      }

    } catch (error) {
      logger.error('Service Worker registration failed', error)
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const result = await this.registration.unregister()
      logger.success('Service Worker unregistered', { result })
      return result
    } catch (error) {
      logger.error('Service Worker unregistration failed', error)
      return false
    }
  }

  /**
   * Update the service worker
   */
  async update(): Promise<void> {
    if (!this.registration) {
      logger.warn('No service worker registered')
      return
    }

    try {
      await this.registration.update()
      logger.info('Service Worker update check completed')
    } catch (error) {
      logger.error('Service Worker update failed', error)
    }
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    if (!this.isSupported()) {
      return
    }

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      logger.success('All caches cleared')

      // Notify service worker to clear its caches too
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_CLEAR'
        })
      }
    } catch (error) {
      logger.error('Cache clearing failed', error)
    }
  }

  /**
   * Handle service worker update found
   */
  private handleUpdateFound(): void {
    logger.info('Service Worker update found')

    if (!this.registration) return

    const newWorker = this.registration.installing

    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker installed and ready
          this.showUpdateAvailable()
        }
      })
    }
  }

  /**
   * Handle controller change (new service worker activated)
   */
  private handleControllerChange(): void {
    logger.info('Service Worker controller changed')

    // Reload the page to ensure the new service worker is used
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  /**
   * Show update available notification
   */
  private showUpdateAvailable(): void {
    logger.info('Service Worker update available')

    // Dispatch custom event for the app to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sw-update-available', {
        detail: {
          registration: this.registration
        }
      }))
    }
  }

  /**
   * Activate waiting service worker
   */
  activateWaitingWorker(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  /**
   * Cache the current page
   */
  cacheCurrentPage(): void {
    if (navigator.serviceWorker.controller && typeof window !== 'undefined') {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_CURRENT_PAGE',
        url: window.location.href
      })
    }
  }
}

// Export singleton instance
export const serviceWorkerManager: ServiceWorkerManager = new ServiceWorkerManagerImpl()

// Auto-register when module is imported (only in browser)
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for non-blocking registration
  const registerWhenIdle = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        serviceWorkerManager.register()
      }, { timeout: 2000 })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        serviceWorkerManager.register()
      }, 100)
    }
  }

  // Wait for page load then register during idle time
  if (document.readyState === 'complete') {
    registerWhenIdle()
  } else {
    window.addEventListener('load', registerWhenIdle)
  }
}

// Listen for app updates
if (typeof window !== 'undefined') {
  window.addEventListener('sw-update-available', (event: any) => {
    // Use requestIdleCallback to avoid blocking user interactions
    const handleUpdate = () => {
      const updateConfirmed = window.confirm(
        'A new version of the app is available. Would you like to refresh to get the latest features?'
      )

      if (updateConfirmed && serviceWorkerManager instanceof ServiceWorkerManagerImpl) {
        ;(serviceWorkerManager as any).activateWaitingWorker()
      }
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(handleUpdate, { timeout: 1000 })
    } else {
      setTimeout(handleUpdate, 50)
    }
  })
}