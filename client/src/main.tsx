import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Run the cache cleanup worker once per tab session. The marker prevents the
// worker's reload from registering it again in a loop.
if ("serviceWorker" in navigator && !sessionStorage.getItem("sw-cleared")) {
  sessionStorage.setItem("sw-cleared", "1");
  navigator.serviceWorker.register("/sw.js").catch(() => {
    sessionStorage.removeItem("sw-cleared");
  });
}

createRoot(document.getElementById("root")!).render(<App />);
