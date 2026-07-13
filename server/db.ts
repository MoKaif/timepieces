import { randomUUID } from "node:crypto";
import { Pool } from "pg";

export interface WatchRecord {
  id: string;
  name: string;
  brand: string;
  model: string;
  referenceNumber: string;
  purchasePrice: number;
  currentMarketValue: number;
  purchaseDate: string;
  year: number;
  movementType: string;
  caseSize: number;
  notes: string;
  brandLogoUrl: string;
  heroImageUrl: string;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isInWishlist: boolean;
}

export interface SettingsRecord {
  theme: string;
  currency: string;
  sortBy: string;
}

const databaseUrl = process.env.DATABASE_URL || "postgresql://timepieces:timepieces@localhost:5432/timepieces";

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS watches (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      brand TEXT NOT NULL DEFAULT '',
      model TEXT NOT NULL DEFAULT '',
      reference_number TEXT NOT NULL DEFAULT '',
      purchase_price DOUBLE PRECISION NOT NULL DEFAULT 0,
      current_market_value DOUBLE PRECISION NOT NULL DEFAULT 0,
      purchase_date TEXT NOT NULL DEFAULT '',
      year INTEGER NOT NULL DEFAULT 0,
      movement_type TEXT NOT NULL DEFAULT 'mechanical',
      case_size DOUBLE PRECISION NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      brand_logo_url TEXT NOT NULL DEFAULT '',
      hero_image_url TEXT NOT NULL DEFAULT '',
      gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
      is_in_wishlist BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
  `);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function normalizeWatchPayload(input: Record<string, any> = {}): WatchRecord {
  const now = new Date().toISOString();
  return {
    // The id column is a UUID; ignore any client-supplied id that isn't one
    // (e.g. legacy nanoid ids from an old export) and mint a fresh UUID.
    id: typeof input.id === "string" && UUID_RE.test(input.id) ? input.id : randomUUID(),
    name: input.name || "",
    brand: input.brand || "",
    model: input.model || "",
    referenceNumber: input.referenceNumber || "",
    purchasePrice: Number(input.purchasePrice || 0),
    currentMarketValue: Number(input.currentMarketValue || 0),
    purchaseDate: input.purchaseDate || "",
    year: Number(input.year || 0),
    movementType: input.movementType || "mechanical",
    caseSize: Number(input.caseSize || 0),
    notes: input.notes || "",
    brandLogoUrl: input.brandLogoUrl || "",
    heroImageUrl: input.heroImageUrl || "",
    galleryImages: Array.isArray(input.galleryImages) ? input.galleryImages : [],
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    isFavorite: Boolean(input.isFavorite),
    isInWishlist: Boolean(input.isInWishlist),
  };
}

export function normalizeWatchRow(row: Record<string, any>): WatchRecord {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    model: row.model,
    referenceNumber: row.reference_number,
    purchasePrice: Number(row.purchase_price || 0),
    currentMarketValue: Number(row.current_market_value || 0),
    purchaseDate: row.purchase_date,
    year: Number(row.year || 0),
    movementType: row.movement_type,
    caseSize: Number(row.case_size || 0),
    notes: row.notes,
    brandLogoUrl: row.brand_logo_url,
    heroImageUrl: row.hero_image_url,
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isFavorite: Boolean(row.is_favorite),
    isInWishlist: Boolean(row.is_in_wishlist),
  };
}

export async function listWatches(): Promise<WatchRecord[]> {
  const result = await pool.query(
    `SELECT id, name, brand, model, reference_number, purchase_price, current_market_value, purchase_date, year, movement_type, case_size, notes, brand_logo_url, hero_image_url, gallery_images, created_at, updated_at, is_favorite, is_in_wishlist
     FROM watches
     ORDER BY created_at DESC`
  );
  return result.rows.map(normalizeWatchRow);
}

export async function getWatch(id: string): Promise<WatchRecord | null> {
  const result = await pool.query(
    `SELECT id, name, brand, model, reference_number, purchase_price, current_market_value, purchase_date, year, movement_type, case_size, notes, brand_logo_url, hero_image_url, gallery_images, created_at, updated_at, is_favorite, is_in_wishlist
     FROM watches
     WHERE id = $1`,
    [id]
  );
  if (result.rowCount === 0) {
    return null;
  }
  return normalizeWatchRow(result.rows[0]);
}

export async function createWatch(input: Record<string, any>): Promise<WatchRecord> {
  const watch = normalizeWatchPayload(input);
  await pool.query(
    `INSERT INTO watches (
      id, name, brand, model, reference_number, purchase_price, current_market_value, purchase_date, year, movement_type, case_size, notes, brand_logo_url, hero_image_url, gallery_images, created_at, updated_at, is_favorite, is_in_wishlist
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
    [
      watch.id,
      watch.name,
      watch.brand,
      watch.model,
      watch.referenceNumber,
      watch.purchasePrice,
      watch.currentMarketValue,
      watch.purchaseDate,
      watch.year,
      watch.movementType,
      watch.caseSize,
      watch.notes,
      watch.brandLogoUrl,
      watch.heroImageUrl,
      watch.galleryImages,
      watch.createdAt,
      watch.updatedAt,
      watch.isFavorite,
      watch.isInWishlist,
    ]
  );
  return watch;
}

export async function updateWatch(id: string, input: Record<string, any>): Promise<WatchRecord | null> {
  const current = await getWatch(id);
  if (!current) return null;
  const updated = normalizeWatchPayload({ ...current, ...input, id, updatedAt: new Date().toISOString() });
  await pool.query(
    `UPDATE watches
     SET name = $1, brand = $2, model = $3, reference_number = $4, purchase_price = $5, current_market_value = $6, purchase_date = $7, year = $8, movement_type = $9, case_size = $10, notes = $11, brand_logo_url = $12, hero_image_url = $13, gallery_images = $14, updated_at = $15, is_favorite = $16, is_in_wishlist = $17
     WHERE id = $18`,
    [
      updated.name,
      updated.brand,
      updated.model,
      updated.referenceNumber,
      updated.purchasePrice,
      updated.currentMarketValue,
      updated.purchaseDate,
      updated.year,
      updated.movementType,
      updated.caseSize,
      updated.notes,
      updated.brandLogoUrl,
      updated.heroImageUrl,
      updated.galleryImages,
      updated.updatedAt,
      updated.isFavorite,
      updated.isInWishlist,
      id,
    ]
  );
  return updated;
}

export async function deleteWatch(id: string): Promise<void> {
  await pool.query("DELETE FROM watches WHERE id = $1", [id]);
}

export async function clearAllWatches(): Promise<void> {
  await pool.query("DELETE FROM watches");
}

export async function getSettings(): Promise<SettingsRecord> {
  const result = await pool.query("SELECT key, value FROM settings");
  const settings = result.rows.reduce<Record<string, any>>((acc: Record<string, any>, row: { key: string; value: any }) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return {
    theme: settings.theme ?? "dark",
    currency: settings.currency ?? "INR",
    sortBy: settings.sortBy ?? "newest",
  };
}

export async function upsertSettings(input: Record<string, any>): Promise<void> {
  const entries = Object.entries(input);
  if (entries.length === 0) return;

  await Promise.all(
    entries.map(([key, value]) => pool.query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [key, value]))
  );
}

export async function closeDatabase() {
  await pool.end();
}
