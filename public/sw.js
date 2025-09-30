// Service Worker for PWA functionality
const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css", "/manifest.json"];

// Install event - cache resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version or fetch from network
            return response || fetch(event.request);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle push notifications
self.addEventListener("push", (event) => {
    console.log("Push event received:", event);

    const options = {
        body: event.data ? event.data.text() : "You have a new notification!",
        icon: "/icon-192x192.svg",
        badge: "/icon-192x192.svg",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [
            {
                action: "explore",
                title: "View Details",
                icon: "/icon-192x192.svg",
            },
            {
                action: "close",
                title: "Close",
                icon: "/icon-192x192.svg",
            },
        ],
    };

    event.waitUntil(self.registration.showNotification("PWA Notification", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
    console.log("Notification click received:", event);

    event.notification.close();

    if (event.action === "explore") {
        // Open the app
        event.waitUntil(clients.openWindow("/"));
    } else if (event.action === "close") {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(clients.openWindow("/"));
    }
});
