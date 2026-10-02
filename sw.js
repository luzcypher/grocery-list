const CACHE = "grocery-list-v14";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", e => {
  // cache: "reload" skips the browser's HTTP cache so a new version never stores an old page.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(url => new Request(url, { cache: "reload" })))));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

const save = (req, res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // The page itself: newest version when online, saved copy when offline.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request.url, { cache: "no-cache" })
        .then(res => save(e.request, res))
        .catch(() => caches.match(e.request).then(c => c || caches.match("./index.html")))
    );
    return;
  }
  // Icons and manifest: saved copy right away, refreshed in the background.
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => save(e.request, res)).catch(() => cached);
      return cached || fresh;
    })
  );
});
