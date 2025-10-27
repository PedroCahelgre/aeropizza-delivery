const CACHE_NAME = 'aeropizza-v2';
const urlsToCache = [
  '/',
  '/cardapio',
  '/agendar',
  '/checkout',
  '/order-confirmation',
  '/admin',
  '/login-admin',
  '/manifest.json',
  '/favicon-footer.svg',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png',
  '/footer-logo.png',
  '/pizzas/margherita.jpg',
  '/pizzas/portuguesa.jpg',
  '/pizzas/calabresa.jpg',
  '/pizzas/quatro-queijos.jpg',
  '/pizzas/vegetariana.jpg',
  '/pizzas/frango-catupiry.jpg',
  '/pizzas/pepperoni.jpg',
  '/pizzas/chocolate.jpg',
  '/bebidas/coca-cola.jpg',
  '/bebidas/suco-laranja.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SW: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('SW: Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache successful responses
          if (event.request.url.includes('/api/') || 
              event.request.url.includes('/pizzas/') || 
              event.request.url.includes('/bebidas/') ||
              event.request.url.includes('/logo') ||
              event.request.url.includes('/icon-') ||
              event.request.url.includes('/favicon')) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch((error) => {
          console.log('SW: Network request failed, serving offline content:', error);
          
          // Offline fallback for API requests
          if (event.request.url.includes('/api/products')) {
            return new Response(JSON.stringify([
              {
                id: '1',
                name: 'Pizza Margherita',
                description: 'Molho de tomate, muçarela, manjericão',
                price: 35.90,
                image: '/pizzas/margherita.jpg',
                category: { name: 'Tradicionais' },
                preparationTime: 25,
                available: true
              },
              {
                id: '2',
                name: 'Pizza Calabresa',
                description: 'Molho de tomate, muçarela, calabresa, cebola',
                price: 38.90,
                image: '/pizzas/calabresa.jpg',
                category: { name: 'Tradicionais' },
                preparationTime: 30,
                available: true
              }
            ]), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          if (event.request.url.includes('/api/categories')) {
            return new Response(JSON.stringify([
              {
                id: '1',
                name: 'Pizzas',
                description: 'Nossas pizzas especiais',
                active: true
              },
              {
                id: '2',
                name: 'Bebidas',
                description: 'Refrigerantes e sucos',
                active: true
              }
            ]), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync for offline orders
  console.log('SW: Background sync triggered');
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova mensagem da AeroPizza!',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Pedido',
        icon: '/icon-96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AeroPizza', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/order-confirmation')
    );
  }
});