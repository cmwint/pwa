var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [];

self.addEventListener('install', function(e){
    console.log('[Service Worker] install');
    e.waitUntil(
        // open up caches object and populate it with the files that need to be cached
        caches.open(cacheName).then(function(cache){
            console.log('[Serivce Worker] caching app shell');
            // add response to cache
            return cache.addAll(filesToCache);
        })
    )
})

self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
})