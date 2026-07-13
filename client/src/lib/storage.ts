/**
 * API-based persistence layer for watch collection data.
 * All reads/writes go through the Express + PostgreSQL backend under /api.
 */

import { Watch, WatchFormData, WishlistFormData, CollectionSettings, ExportData } from "@/types";

const API_BASE = "/api";

const DEFAULT_SETTINGS: CollectionSettings = {
  theme: "dark",
  currency: "INR",
  sortBy: "newest",
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`);
  }
  return (await res.json()) as T;
}

export async function getWatches(): Promise<Watch[]> {
  return request<Watch[]>("/watches");
}

export async function getWatchById(watchId: string): Promise<Watch | null> {
  const res = await fetch(`${API_BASE}/watches/${watchId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch watch");
  return (await res.json()) as Watch;
}

/** Create a new watch. The server assigns the id/timestamps and returns the saved record. */
export async function createWatch(data: WatchFormData): Promise<Watch> {
  return request<Watch>("/watches", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Create a wishlist entry (a watch flagged isInWishlist) from the lightweight URL form. */
export async function createWishlistItem(data: WishlistFormData): Promise<Watch> {
  return request<Watch>("/watches", {
    method: "POST",
    body: JSON.stringify({ ...data, isInWishlist: true }),
  });
}

/** Update an existing watch and return the saved record. */
export async function updateWatch(watch: Watch): Promise<Watch> {
  return request<Watch>(`/watches/${watch.id}`, {
    method: "PUT",
    body: JSON.stringify(watch),
  });
}

export async function deleteWatch(watchId: string): Promise<void> {
  await request<{ ok: boolean }>(`/watches/${watchId}`, { method: "DELETE" });
}

export async function clearAllData(): Promise<void> {
  await request<{ ok: boolean }>("/watches", { method: "DELETE" });
}

export async function getSettings(): Promise<CollectionSettings> {
  try {
    const data = await request<Partial<CollectionSettings>>("/settings");
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<CollectionSettings>): Promise<void> {
  await request<{ ok: boolean }>("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export async function exportCollection(): Promise<ExportData> {
  const [watches, settings] = await Promise.all([getWatches(), getSettings()]);
  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    watches,
    settings,
    timeline: [],
  };
}

export async function importCollection(data: ExportData, overwrite: boolean = false): Promise<void> {
  const incoming = Array.isArray(data.watches) ? data.watches : [];

  if (overwrite) {
    await clearAllData();
  }

  const existing = overwrite ? [] : await getWatches();
  const existingIds = new Set(existing.map((w) => w.id));

  for (const watch of incoming) {
    if (!overwrite && existingIds.has(watch.id)) continue;
    await request("/watches", { method: "POST", body: JSON.stringify(watch) });
  }

  if (data.settings) {
    await updateSettings(data.settings);
  }
}
