/* NOOR service worker — Sprint 7 */
const NOOR_SW_VERSION = '0.7.0';
const STATIC_CACHE = `noor-static-${NOOR_SW_VERSION}`;
const RUNTIME_CACHE = `noor-runtime-${NOOR_SW_VERSION}`;

const CORE_ASSETS = [
  '/today',
  '/offline.html',
  '/manifest.json',
  '/icons/noor-mark.svg',
  '/version.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('noor-') && key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname === '/version.json') {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => caches.match('/version.json'))
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) || (await caches.match('/today')) || caches.match('/offline.html');
        })
    );
    return;
  }

  const cacheableDestinations = new Set(['script', 'style', 'image', 'font', 'manifest']);
  if (cacheableDestinations.has(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return response;
        });
      })
    );
  }
});
