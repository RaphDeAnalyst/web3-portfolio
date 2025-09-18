/**
 * Service Worker Registration and Management
 * Handles PWA functionality and offline caching
 */

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
      console.info('[SW] Service Worker not supported in this browser')
      return
    }

    try {
      // Only register in production or when explicitly enabled
      const shouldRegister = process.env.NODE_ENV === 'production' ||
                             process.env.NEXT_PUBLIC_SW_ENABLED === 'true'

      if (!shouldRegister) {
        console.info('[SW] Service Worker disabled in development')
        return
      }

      console.log('[SW] Registering service worker...')

      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('[SW] Service Worker registered successfully:', this.registration.scope)

      // Listen for updates
      this.registration.addEventListener('updatefound', this.handleUpdateFound.bind(this))

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', this.handleControllerChange.bind(this))

      // Check for waiting service worker
      if (this.registration.waiting) {
        this.showUpdateAvailable()
      }

    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error)
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
      console.log('[SW] Service Worker unregistered:', result)
      return result
    } catch (error) {
      console.error('[SW] Service Worker unregistration failed:', error)
      return false
    }
  }

  /**
   * Update the service worker
   */
  async update(): Promise<void> {
    if (!this.registration) {
      console.warn('[SW] No service worker registered')
      return
    }

    try {
      await this.registration.update()
      console.log('[SW] Service Worker update check completed')
    } catch (error) {
      console.error('[SW] Service Worker update failed:', error)
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
      console.log('[SW] All caches cleared')

      // Notify service worker to clear its caches too
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_CLEAR'
        })
      }
    } catch (error) {
      console.error('[SW] Cache clearing failed:', error)
    }
  }

  /**
   * Handle service worker update found
   */
  private handleUpdateFound(): void {
    console.log('[SW] Service Worker update found')

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
    console.log('[SW] Service Worker controller changed')

    // Reload the page to ensure the new service worker is used
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  /**
   * Show update available notification
   */
  private showUpdateAvailable(): void {
    console.log('[SW] Service Worker update available')

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
  // Wait for page load to avoid blocking initial render
  window.addEventListener('load', () => {
    serviceWorkerManager.register()
  })
}

// Listen for app updates
if (typeof window !== 'undefined') {
  window.addEventListener('sw-update-available', (event: any) => {
    // You can customize this notification
    const updateConfirmed = window.confirm(
      'A new version of the app is available. Would you like to refresh to get the latest features?'
    )

    if (updateConfirmed && serviceWorkerManager instanceof ServiceWorkerManagerImpl) {
      ;(serviceWorkerManager as any).activateWaitingWorker()
    }
  })
}