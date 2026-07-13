import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// One-time cleanup: the original build shipped a cache-first service worker that
// froze API responses (and the app bundle) in the browser cache. Unregister any
// leftover worker, clear its caches, and reload once so the live data is used.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length === 0) return;
    Promise.all(registrations.map((r) => r.unregister()))
      .then(() => ("caches" in window ? caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))) : undefined))
      .then(() => {
        if (!sessionStorage.getItem("sw-cleared")) {
          sessionStorage.setItem("sw-cleared", "1");
          location.reload();
        }
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
