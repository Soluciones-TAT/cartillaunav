// Service Worker para Cartilla de Emergencia UNAV
const CACHE_NAME = 'unav-cartilla-v1.0.0';
const urlsToCache = [
  'https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/init.aspx',
  'https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/cartilla-app-styles.css',
  'https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/app.js',
  // Bootstrap CSS
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
  // Bootstrap JS
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  // AngularJS
  'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.30/angular-ui-router.min.js',
  // Iconos
  'https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/icons/icon-192x192.png',
  'https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('❌ Error cacheando archivos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Estrategia: Network First para SharePoint, Cache First para recursos estáticos
  if (event.request.url.includes('sharepoint.com')) {
    // Network First para SharePoint (datos dinámicos)
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Si la respuesta es válida, guardarla en cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, buscar en cache
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // Si no está en cache, mostrar página offline
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
            });
        })
    );
  } else {
    // Cache First para recursos estáticos (CSS, JS, imágenes)
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then(response => {
              // Guardar en cache si es una respuesta válida
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            });
        })
    );
  }
});

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificaciones push (opcional para futuras mejoras)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Cartilla UNAV', options)
    );
  }
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/init.aspx')
  );
});