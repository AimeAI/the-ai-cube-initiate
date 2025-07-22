// AI Cube Service Worker - v1.0.0
// Implements offline-first strategy with intelligent caching

const CACHE_VERSION = 'ai-cube-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const GAMES_CACHE = `${CACHE_VERSION}-games`;

// Critical assets for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/main.css',
  '/js/app.js',
  // Add fonts
  '/fonts/orbitron-v25-latin-regular.woff2',
  '/fonts/orbitron-v25-latin-700.woff2',
  // Add essential images
  '/images/logo.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Game assets to cache for offline play
const GAME_ASSETS = [
  '/games/snake-3',
  '/games/crystal-resonance', 
  '/games/neural-network-chamber',
  '/assets/models/',
  '/assets/textures/',
  '/assets/sounds/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache free games for offline play
      caches.open(GAMES_CACHE).then((cache) => {
        console.log('[Service Worker] Pre-caching free games');
        // Only cache free games to save space
        return cache.addAll([
          '/games/snake-3',
          '/games/crystal-resonance',
          '/games/neural-network-chamber'
        ]);
      })
    ])
  );
  
  // Force immediate activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('ai-cube-') && 
                   cacheName !== STATIC_CACHE &&
                   cacheName !== DYNAMIC_CACHE &&
                   cacheName !== GAMES_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Different strategies for different asset types
  if (url.origin === location.origin) {
    // HTML pages - Network first, fallback to cache
    if (request.headers.get('accept').includes('text/html')) {
      event.respondWith(networkFirstStrategy(request));
      return;
    }
    
    // Game assets - Cache first for performance
    if (url.pathname.startsWith('/games/') || 
        url.pathname.startsWith('/assets/')) {
      event.respondWith(cacheFirstStrategy(request));
      return;
    }
    
    // API calls - Network only with offline fallback
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkOnlyWithOfflineFallback(request));
      return;
    }
  }
  
  // Default - Stale while revalidate for everything else
  event.respondWith(staleWhileRevalidate(request));
});

// Caching Strategies

// Network first - Try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Cache first - Try cache, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request);
    return cachedResponse;
  }
  
  return fetchAndCache(request);
}

// Stale while revalidate - Return cache immediately, update in background
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((cache) => cache.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Network only with offline fallback
async function networkOnlyWithOfflineFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Return cached data or offline indicator
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline status for API calls
    return new Response(
      JSON.stringify({ 
        offline: true, 
        message: 'You are currently offline. Data will sync when connection is restored.' 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503 
      }
    );
  }
}

// Helper function to fetch and cache
async function fetchAndCache(request) {
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(
      request.url.includes('/games/') ? GAMES_CACHE : DYNAMIC_CACHE
    );
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncGameProgress());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New AI learning content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Go to Games Hub',
        icon: '/icons/games-96x96.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/icons/close-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AI Cube', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/games')
    );
  }
});

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

// Helper functions

async function syncGameProgress() {
  // Sync offline game progress when connection restored
  const cache = await caches.open('progress-cache');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const cachedResponse = await cache.match(request);
      const data = await cachedResponse.json();
      
      // Send to server
      await fetch('/api/sync-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Remove from cache after successful sync
      await cache.delete(request);
    } catch (error) {
      console.error('[Service Worker] Sync failed:', error);
    }
  }
}

async function checkForUpdates() {
  // Check for app updates
  const response = await fetch('/api/version');
  const data = await response.json();
  
  if (data.version !== CACHE_VERSION) {
    // Notify user of available update
    self.registration.showNotification('AI Cube Update Available', {
      body: 'New games and features are ready! Tap to update.',
      icon: '/icons/icon-192x192.png',
      tag: 'update-available',
      requireInteraction: true
    });
  }
}

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_GAME') {
    cacheGame(event.data.gameId);
  }
});

async function cacheGame(gameId) {
  const cache = await caches.open(GAMES_CACHE);
  const gameAssets = [
    `/games/${gameId}`,
    `/assets/games/${gameId}/models/`,
    `/assets/games/${gameId}/textures/`,
    `/assets/games/${gameId}/sounds/`
  ];
  
  try {
    await cache.addAll(gameAssets);
    // Notify client of successful caching
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'GAME_CACHED',
        gameId: gameId
      });
    });
  } catch (error) {
    console.error(`[Service Worker] Failed to cache game ${gameId}:`, error);
  }
}