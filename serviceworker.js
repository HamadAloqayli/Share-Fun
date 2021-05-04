const CACHE_NAME = "version-1";
const assets = [
                '/',
                '/index.html',
                '/Login',
                '/Signup',
                '/Profile',
                '/Groups',
                '/Favorite',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
                'https://code.jquery.com/jquery-3.5.1.slim.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js',
                'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
            ];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(assets);
            })
    )
});

// Activate the SW
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cacheRes) => {
                return cacheRes || fetch(event.request)
            })
    )
});
