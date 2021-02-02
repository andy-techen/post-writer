var cacheName = 'baobee-pwa';
var filesToCache = [
    '/',
    '/index.html',
    '/assets/styles/style.css',
    '/assets/scripts/writer.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(filesToCache);
            })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request)
            .then(function (response) {
                return response || fetch(e.request);
            })
    );
});