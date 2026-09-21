// Service worker: de app werkt ook zonder internet.
// Verhoog VERSION bij elke nieuwe versie, dan krijgt de app een update-melding.
const VERSION = 'v1';
const SHELL = `shell-${VERSION}`;
const CDN = `cdn-${VERSION}`;
const APP_FILES = ['./', './index.html', './config.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(APP_FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== SHELL && k !== CDN).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Supabase (data, login, bonnetjes) nooit cachen: altijd live.
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('supabase.in')) return;

  // App-pagina: eerst netwerk, bij geen internet de laatste versie uit de cache.
  if (req.mode === 'navigate' || (url.origin === location.origin && /\.(html|js|webmanifest)$/.test(url.pathname))) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  // Bibliotheken, lettertypes en iconen: eerst cache, daarna netwerk.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CDN).then(c => c.put(req, copy)); }
    return res;
  })));
});
