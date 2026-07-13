export type MovementType = "mechanical" | "automatic" | "quartz" | "chronograph" | "tourbillon";

export interface Watch {
  id: string;
  name: string;
  brand: string;
  model: string;
  referenceNumber: string;
  purchasePrice: number;
  currentMarketValue: number;
  purchaseDate: string;
  year: number;
  movementType: MovementType;
  caseSize: number;
  notes: string;
  brandLogoUrl: string;
  heroImageUrl: string;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isInWishlist: boolean;
  /** Optional external link (e.g. a listing/shop) — used mainly for wishlist items. */
  listingUrl: string;
}

export type WatchFormData = Omit<Watch, "id" | "createdAt" | "updatedAt" | "isFavorite" | "isInWishlist">;

/** Lightweight wishlist entry captured by URL rather than the full watch form. */
export interface WishlistFormData {
  brand: string;
  model: string;
  heroImageUrl: string;
  listingUrl: string;
  currentMarketValue: number;
  notes: string;
}

export type SortOrder = "newest" | "oldest" | "highest-value" | "lowest-value" | "alphabetical";
export type ThemeMode = "dark" | "light";

export interface CollectionSettings {
  theme: ThemeMode;
  currency: string;
  sortBy: SortOrder;
}

export interface CollectionStats {
  totalWatches: number;
  totalValue: number;
  averageValue: number;
  mostValuableWatch: Watch | null;
  brandDistribution: Record<string, number>;
  valueByBrand: Record<string, number>;
  totalAppreciation: number;
  totalDepreciation: number;
}

export interface SearchFilters {
  query: string;
  brands: string[];
  priceRange: [number, number];
  movementTypes: MovementType[];
  yearRange: [number, number];
  sortBy: SortOrder;
}

export type CollectionTimelineAction = "added" | "updated" | "removed";

export interface CollectionTimeline {
  date: string;
  action: CollectionTimelineAction;
  watchId: string;
  value: number;
  notes?: string;
}

export interface CollectionSnapshot {
  date: string;
  value: number;
  watches: number;
}

export interface ExportData {
  version: string;
  exportDate: string;
  watches: Watch[];
  settings: CollectionSettings;
  timeline: CollectionTimeline[];
}
