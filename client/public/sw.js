// Self-destroying service worker (kill switch).
//
// The original app shipped a cache-first service worker that froze API responses
// and the app bundle in the browser. This replacement takes over on the next visit,
// deletes every cache, unregisters itself, and reloads open tabs so the live app and
// live data are used.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      await Promise.all(clients.map((client) => client.navigate(client.url)));
    })()
  );
});
