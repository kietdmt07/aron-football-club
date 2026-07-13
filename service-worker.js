const CACHE_NAME = 'aron-football-v28';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.jpg',
  './icon-512.jpg'
];

// Cài đặt service worker và lưu trữ tài nguyên vào cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Kích hoạt service worker và dọn dẹp các cache cũ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Chặn các request để trả về tài nguyên từ cache khi offline
self.addEventListener('fetch', event => {
  // Chỉ cache các tài nguyên tĩnh nội bộ, luôn lấy trực tiếp các cuộc gọi API hoặc CDN
  if (event.request.url.includes('supabase.co') || event.request.url.includes('jsdelivr.net') || event.request.url.includes('googleapis.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
