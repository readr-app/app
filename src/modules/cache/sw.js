
/* eslint "no-undef": 0 */

const CACHE_NAME = __COMMIT_SHA__;

const FILES = serviceWorkerOption.assets.concat(['/']);

self.addEventListener('install', evnt =>
    evnt.waitUntil(caches.open(CACHE_NAME)
        .then(cache => cache.addAll(FILES))
        .then(() => self.skipWaiting())));

self.addEventListener('activate', evnt =>
    evnt.waitUntil(caches.keys().then(cacheNames =>
        Promise.all(cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
            return null;
        }))).then(() => self.clients.claim())));

self.addEventListener('fetch', (evnt) => {
    if (evnt.request.method !== 'GET' ||
        evnt.request.url.indexOf('http') !== 0 ||
        evnt.request.url.indexOf('sockjs-node') > -1) {
        return null;
    }

    if (/\/article\/[a-z0-9]+/.test(evnt.request.url)) {
        return evnt.respondWith(caches.match('/'));
    }

    return evnt.respondWith(caches.match(evnt.request).then(response =>
        response || fetch(evnt.request)));
});
