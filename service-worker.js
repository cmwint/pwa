// name should be updated with every file change so you are loading new content
var cacheName = 'weatherPWA-step-6-2';

var dataCacheName = 'weatherData-v1';

var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
  ];

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
    // update cache whenever app shell files change
    // TODO increment cache name variable at the top of the file to make this work

    console.log('[Service Worker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[Service Worker] removing old cache', key);
                    return caches.delete(key);
                }
            }))
        })
    );
    // lets you actiavte the service worker faster
    return self.clients.claim();
})

// code intercepting the request
self.addEventListener('fetch', function(e){
    // serving the app shell from the cache
    console.log('[Service Worker] fetch', e.request.url);
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if (e.request.url.indexOf(dataUrl) > -1) {
        // cache-then-network strategy
        // app is asking for fresh weather data
        e.respondWith (
            caches.open(dataCacheName).then(function(cache){
                return fetch(e.request).then(function(response){
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        // cache-falling-back-to-network strategy
        // app is asking for shell files
        e.respondWith (
            // reviewing the web request that trigger the fetch event
            // is it available in the cache?
            caches.match(e.request).then(function(response){
                return response || fetch(e.request);
            })
        )
    }
})