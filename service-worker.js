// ---------------------------------------
// Service Worker - Slide Memorizer (ES-module safe)
// ---------------------------------------

const CACHE_NAME = "slide-memorizer-cache-v12";

// Basic files to always cache
const CORE_ASSETS = [
  "index.html",
  "learn.html",
  "offline.html",
  "css/learn.css",
  "css/main.css",
  "css/nav.css",
  "js/data.js",
  "js/learn.js",
  "js/nav.js"
];

// ---------------------------------------------------
// Helper: Load data.js (as text) and extract image URLs
// ---------------------------------------------------
async function extractImageURLs() {
  try {
    const res = await fetch("js/data.js");
    const text = await res.text();

    // Remove ES module export
    const cleaned = text.replace("export const data =", "const data =");

    // Evaluate safe inside SW scope
    let data = {};
    eval(cleaned); // now SW has "data" object

    const urls = [];
    data.slides.forEach(slide => {
      slide.image.forEach(url => urls.push(url));
    });

    return urls;
  } catch (err) {
    console.error("Failed to load data.js in SW:", err);
    return [];
  }
}

// ---------------------------------------------------
// INSTALL — Precache core assets + slide images
// ---------------------------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache core files
      await cache.addAll(CORE_ASSETS);

      // Cache slide images extracted from original data.js
      const imageURLs = await extractImageURLs();

      for (const url of imageURLs) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("Could not cache image:", url);
        }
      }
    })()
  );
});

// ---------------------------------------------------
// ACTIVATE — Cleanup old caches
// ---------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ---------------------------------------------------
// FETCH — Network-first, cache fallback
// ---------------------------------------------------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((liveResponse) => {
        // Cache successful GET responses
        if (liveResponse.ok && event.request.method === "GET") {
          const copy = liveResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return liveResponse;
      })
      .catch(() => {
        // offline fallback → try cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;

          if (event.request.destination === "document") {
            return caches.match("offline.html");
          }
        });
      })
  );
});
