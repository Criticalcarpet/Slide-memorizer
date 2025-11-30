const CACHE_NAME = 'slide-memorizer-cache-v1';
const urlsToCache = [
  'learn.html',
  'index.html',
  'offline.html',
  'css/learn.css',
  'css/main.css',
  'css/nav.css',
  'js/data.js',
  'js/learn.js',
  'js/nav.js'
  // Don't include images here because they are external URLs
];

// Install SW and cache basic assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      // If not cached, fetch from network and cache it dynamically
      return fetch(event.request).then((response) => {
        // Only cache successful responses (status 200)
        if (response.status === 200 && response.type === 'basic' || response.url.startsWith('https://raw.githubusercontent.com/')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback if offline
        if (event.request.destination === 'document') {
          return caches.match('offline.html');
        }
      });
    })
  );
});
