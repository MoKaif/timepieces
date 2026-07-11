/**
 * API-based persistence layer for watch collection data
 * Handles all read/write operations via backend endpoints
 */

import { Watch, CollectionSettings, CollectionTimeline, ExportData } from "@/types";

const API_BASE = "/api";

const DEFAULT_SETTINGS: CollectionSettings = {
  theme: "dark",
  currency: "INR",
  sortBy: "newest",
};

export async function getWatches(): Promise<Watch[]> {
  try {
    const res = await fetch(`${API_BASE}/watches`);
    if (!res.ok) throw new Error("failed to fetch watches");
    return await res.json();
  } catch (error) {
    console.error("Error fetching watches:", error);
    return [];
  }
}

export async function saveWatch(watch: Watch): Promise<void> {
  try {
    const exists = !!watch.id;
    if (exists) {
      await fetch(`${API_BASE}/watches/${watch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watch),
      });
    } else {
      await fetch(`${API_BASE}/watches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watch),
      });
    }
  } catch (error) {
    console.error("Error saving watch:", error);
    throw error;
  }
}

export async function deleteWatch(watchId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/watches/${watchId}`, { method: "DELETE" });
  } catch (error) {
    console.error("Error deleting watch:", error);
    throw error;
  }
}

export async function getWatchById(watchId: string): Promise<Watch | null> {
  try {
    const res = await fetch(`${API_BASE}/watches/${watchId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("failed to fetch watch");
    return await res.json();
  } catch (error) {
    console.error("Error fetching watch by id:", error);
    return null;
  }
}

export async function getSettings(): Promise<CollectionSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = await res.json();
    return { ...DEFAULT_SETTINGS, ...data };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<CollectionSettings>): Promise<void> {
  try {
    await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

export async function getTimeline(): Promise<CollectionTimeline[]> {
  // Simple implementation: derive timeline from watches client-side if needed
  return [];
}

export async function exportCollection(): Promise<ExportData> {
  const watches = await getWatches();
  const settings = await getSettings();
  const timeline: CollectionTimeline[] = [];
  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    watches,
    settings,
    timeline,
  };
}

export async function importCollection(data: ExportData, overwrite: boolean = false): Promise<void> {
  try {
    if (overwrite) {
      // naive: insert/replace each watch
      for (const w of data.watches) {
        await fetch(`${API_BASE}/watches`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(w) });
      }
      await updateSettings(data.settings as any);
    } else {
      const existing = await getWatches();
      const existingIds = new Set(existing.map((w) => w.id));
      for (const w of data.watches) {
        if (!existingIds.has(w.id)) {
          await fetch(`${API_BASE}/watches`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(w) });
        }
      }
      // merge settings minimally
      await updateSettings(data.settings as any);
    }
  } catch (error) {
    console.error("Error importing collection:", error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  // Not implemented server-side. Client can delete individually if needed.
}

export function getStorageSize(): number {
  // Not available server-side. Return 0 as placeholder.
  return 0;
}
