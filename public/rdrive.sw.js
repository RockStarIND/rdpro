const CACHE_NAME = "RDRIVE v0.2.0";

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll([
          '/favicon.ico',
          '/offline.mp4',
          '/offline.html'
        ]);
      })
  );
});

self.addEventListener('fetch', event => {
    // Only call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            // First, try to use the navigation preload response if it's
            // supported.
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              return preloadResponse;
            }

            // Always try the network first.
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // catch is only triggered if an exception is thrown, which is
            // likely due to a network error.
            // If fetch() returns a valid HTTP response with a response code in
            // the 4xx or 5xx range, the catch() will NOT be called.
            console.log("Fetch failed; returning offline page instead.", error);

            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match('/offline.html');
            return cachedResponse;
          }
        })()
      );
    } else {
      event.respondWith(
        (async () => {
          let networkResponse;
          try {
            networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            const cache = await caches.open(CACHE_NAME);
            if(/favicon.ico/.test(event.request.url)){
              return await cache.match('/favicon.ico');
            } else if(/offline.mp4/.test(event.request.url)){
              return await cache.match('/offline.mp4');
            }
            return networkResponse; 
          }
        })()
      )     
    }
});