import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  initializeDatabase,
  listWatches,
  getWatch,
  createWatch,
  updateWatch,
  deleteWatch,
  clearAllWatches,
  getSettings,
  upsertSettings,
  closeDatabase,
} from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "5mb" }));

  await initializeDatabase();

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "timepieces-api" });
  });

  app.get("/api/watches", async (_req, res) => {
    try {
      const watches = await listWatches();
      res.json(watches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_fetch_watches" });
    }
  });

  app.get("/api/watches/:id", async (req, res) => {
    try {
      const watch = await getWatch(req.params.id);
      if (!watch) return res.status(404).json({ error: "not_found" });
      res.json(watch);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_fetch_watch" });
    }
  });

  app.post("/api/watches", async (req, res) => {
    try {
      const watch = await createWatch(req.body);
      res.status(201).json(watch);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_create_watch" });
    }
  });

  app.put("/api/watches/:id", async (req, res) => {
    try {
      const updated = await updateWatch(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "not_found" });
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_update_watch" });
    }
  });

  app.delete("/api/watches/:id", async (req, res) => {
    try {
      await deleteWatch(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_delete_watch" });
    }
  });

  app.delete("/api/watches", async (_req, res) => {
    try {
      await clearAllWatches();
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_clear_watches" });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await getSettings();
      res.json(settings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_fetch_settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      await upsertSettings(req.body);
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "failed_to_update_settings" });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("/*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path === "/health") return next();
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  process.on("SIGINT", async () => {
    await closeDatabase();
    server.close(() => process.exit(0));
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
