// PWABuilder Service Worker
// Versión optimizada para PWABuilder

const CACHE_NAME = 'unav-cartilla-pwa-v1';
const RUNTIME_CACHE = 'unav-cartilla-runtime';

// URLs críticas para cachear durante la instalación
const PRECACHE_URLS = [
  '/',
  '/init.aspx',
  '/cartilla-app-styles.css',
  '/app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// URLs externas importantes
const EXTERNAL_CACHE_URLS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Cachear recursos críticos
      try {
        await cache.addAll(PRECACHE_URLS);
        console.log('✅ Recursos críticos cacheados');
      } catch (error) {
        console.warn('⚠️ Algunos recursos críticos no se pudieron cachear:', error);
      }
      
      // Cachear recursos externos (no críticos)
      try {
        await cache.addAll(EXTERNAL_CACHE_URLS);
        console.log('✅ Recursos externos cacheados');
      } catch (error) {
        console.warn('⚠️ Algunos recursos externos no se pudieron cachear:', error);
      }
    })()
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Limpiar caches antiguos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
      
      // Tomar control de todos los clientes
      await clients.claim();
      console.log('✅ Service Worker activado y en control');
    })()
  );
});

// Estrategia de fetch
self.addEventListener('fetch', event => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia para SharePoint
  if (url.hostname.includes('sharepoint.com')) {
    event.respondWith(networkFirstStrategy(request));
  }
  // Estrategia para recursos estáticos
  else if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    event.respondWith(cacheFirstStrategy(request));
  }
  // Estrategia para páginas HTML
  else if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request));
  }
  // Otras peticiones
  else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// Estrategia Network First
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    // Solo cachear respuestas exitosas
    if (response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Si falla la red, buscar en cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si es una navegación y no hay cache, mostrar página offline
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response(
        createOfflinePage(),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    
    throw error;
  }
}

// Estrategia Cache First
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.warn('❌ Error fetching resource:', request.url);
    throw error;
  }
}

// Crear página offline básica
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sin conexión - UNAV Cartilla</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #23236c 0%, #1a1a52 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                text-align: center;
                padding: 20px;
            }
            .offline-container {
                max-width: 400px;
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .btn {
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                text-decoration: none;
                display: inline-block;
                margin-top: 20px;
                transition: all 0.3s ease;
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
                color: white;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1>Sin conexión</h1>
            <p>No se puede conectar al servidor. Verifica tu conexión a internet e intenta nuevamente.</p>
            <a href="javascript:window.location.reload()" class="btn">Reintentar</a>
        </div>
    </body>
    </html>
  `;
}

// Manejar actualizaciones del Service Worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aquí puedes implementar sincronización en segundo plano
      console.log('🔄 Background sync triggered')
    );
  }
});

console.log('🚀 PWABuilder Service Worker cargado');