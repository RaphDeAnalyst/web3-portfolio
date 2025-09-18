// Service Worker for Matthew Raphael's Web3 Portfolio
// Provides offline functionality and caching strategies

const CACHE_NAME = 'web3-portfolio-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/about',
  '/portfolio',
  '/blog',
  '/contact',
  '/favicon.ico',
  '/site.webmanifest',
  '/apple-touch-icon-dark.png',
  '/favicon_dark-192x192.png',
  '/favicon_dark-512x512.png'
]

// Assets to cache dynamically
const DYNAMIC_CACHE_PATTERNS = [
  '/api/',
  '/_next/static/',
  '/_next/image/'
]

// Assets that should never be cached
const NEVER_CACHE = [
  '/admin',
  '/api/admin',
  '/api/keep-alive'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('[SW] Error caching static assets:', err)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker')

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old cache versions
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Cache cleanup complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip caching for admin routes and sensitive APIs
  if (NEVER_CACHE.some(path => url.pathname.startsWith(path))) {
    return fetch(request)
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request))
  }
})

// Handle GET requests with appropriate caching strategy
async function handleGetRequest(request) {
  const url = new URL(request.url)

  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(request)) {
      return await cacheFirst(request)
    }

    // Strategy 2: Stale While Revalidate for pages and API data
    if (isPageOrAPI(request)) {
      return await staleWhileRevalidate(request)
    }

    // Strategy 3: Network First for everything else
    return await networkFirst(request)

  } catch (error) {
    console.error('[SW] Fetch error:', error)
    return await getOfflineFallback(request)
  }
}

// Cache First Strategy - for static assets that rarely change
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await fetch(request)
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE)
    cache.put(request, networkResponse.clone())
  }

  return networkResponse
}

// Stale While Revalidate Strategy - for pages and API data
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  return cachedResponse || await networkResponsePromise
}

// Network First Strategy - for real-time data
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.includes('/_next/static/') ||
         url.pathname.includes('/favicon') ||
         url.pathname.includes('.png') ||
         url.pathname.includes('.ico') ||
         url.pathname.includes('.svg') ||
         url.pathname.includes('.webmanifest')
}

function isPageOrAPI(request) {
  const url = new URL(request.url)
  return STATIC_ASSETS.includes(url.pathname) ||
         url.pathname.startsWith('/api/') ||
         url.pathname.includes('/_next/data/')
}

// Offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url)

  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match('/') ||
                           await caches.match('/offline.html')

    if (offlineResponse) {
      return offlineResponse
    }
  }

  // Return cached version if available
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  // Fallback error response
  return new Response('Offline - Content not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

// Message handling for cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting()
        break
      case 'CACHE_CLEAR':
        clearAllCaches()
        break
      case 'CACHE_CURRENT_PAGE':
        if (event.data.url) {
          cacheResource(event.data.url)
        }
        break
    }
  }
})

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  )
  console.log('[SW] All caches cleared')
}

// Cache a specific resource
async function cacheResource(url) {
  const cache = await caches.open(DYNAMIC_CACHE)
  try {
    await cache.add(url)
    console.log('[SW] Cached resource:', url)
  } catch (error) {
    console.error('[SW] Failed to cache resource:', url, error)
  }
}

console.log('[SW] Service Worker loaded')