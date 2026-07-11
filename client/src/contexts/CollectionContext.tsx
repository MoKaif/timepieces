/**
 * Collection Context - Global state management for watch collection
 * Handles all collection operations and provides data to components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Watch, CollectionSettings, CollectionStats, SearchFilters } from "@/types";
import { getWatches, saveWatch, deleteWatch, getSettings, updateSettings, exportCollection, importCollection } from "@/lib/storage";
import { calculateStats } from "@/lib/analytics";
import { nanoid } from "nanoid";

interface CollectionContextType {
  // State
  watches: Watch[];
  stats: CollectionStats;
  settings: CollectionSettings;
  filteredWatches: Watch[];
  searchFilters: SearchFilters;
  isLoading: boolean;

  // Watch operations
  addWatch: (watchData: Omit<Watch, "id" | "createdAt" | "updatedAt" | "isFavorite" | "isInWishlist">) => Promise<string>;
  updateWatch: (watchId: string, watchData: Partial<Watch>) => Promise<void>;
  deleteWatchById: (watchId: string) => Promise<void>;
  getWatchById: (watchId: string) => Watch | null;

  // Favorite & Wishlist
  toggleFavorite: (watchId: string) => void;
  toggleWishlist: (watchId: string) => void;
  getFavorites: () => Watch[];
  getWishlist: () => Watch[];

  // Search & Filter
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;

  // Settings
  updateCollectionSettings: (settings: Partial<CollectionSettings>) => void;

  // Import/Export
  exportData: () => void;
  importData: (file: File, overwrite: boolean) => Promise<void>;

  // Refresh
  refreshCollection: () => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  brands: [],
  priceRange: [0, 1000000],
  movementTypes: [],
  yearRange: [1900, new Date().getFullYear()],
  sortBy: "newest",
};

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [settings, setSettings] = useState<CollectionSettings>({ theme: "dark", currency: "INR", sortBy: "newest" });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const storedWatches = await getWatches();
      const storedSettings = await getSettings();
      setWatches(storedWatches);
      setSettings(storedSettings);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Calculate stats
  const stats = calculateStats(watches);

  // Filter and sort watches
  const filteredWatches = useCallback(() => {
    let result = [...watches];

    // Text search
    if (searchFilters.query) {
      const q = searchFilters.query.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.brand.toLowerCase().includes(q) ||
          w.model.toLowerCase().includes(q) ||
          w.referenceNumber.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (searchFilters.brands.length > 0) {
      result = result.filter((w) => searchFilters.brands.includes(w.brand));
    }

    // Price range filter
    result = result.filter(
      (w) => w.currentMarketValue >= searchFilters.priceRange[0] && w.currentMarketValue <= searchFilters.priceRange[1]
    );

    // Movement type filter
    if (searchFilters.movementTypes.length > 0) {
      result = result.filter((w) => searchFilters.movementTypes.includes(w.movementType));
    }

    // Year range filter
    result = result.filter((w) => w.year >= searchFilters.yearRange[0] && w.year <= searchFilters.yearRange[1]);

    // Sort
    switch (searchFilters.sortBy) {
      case "highest-value":
        result.sort((a, b) => b.currentMarketValue - a.currentMarketValue);
        break;
      case "lowest-value":
        result.sort((a, b) => a.currentMarketValue - b.currentMarketValue);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "alphabetical":
        result.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
        break;
    }

    return result;
  }, [watches, searchFilters]);

  // Watch operations
  const addWatch = useCallback(
    async (watchData: Omit<Watch, "id" | "createdAt" | "updatedAt" | "isFavorite" | "isInWishlist">) => {
      const id = nanoid();
      const now = new Date().toISOString();
      const newWatch: Watch = {
        ...watchData,
        id,
        createdAt: now,
        updatedAt: now,
        isFavorite: false,
        isInWishlist: false,
      };

      await saveWatch(newWatch);
      setWatches((prev) => [...prev, newWatch]);
      return id;
    },
    []
  );

  const updateWatchData = useCallback(
    async (watchId: string, watchData: Partial<Watch>) => {
      const watch = watches.find((w) => w.id === watchId);
      if (!watch) return;

      const updated = {
        ...watch,
        ...watchData,
        updatedAt: new Date().toISOString(),
      };

      await saveWatch(updated);
      setWatches((prev) => prev.map((w) => (w.id === watchId ? updated : w)));
    },
    [watches]
  );

  const deleteWatchData = useCallback(
    async (watchId: string) => {
      await deleteWatch(watchId);
      setWatches((prev) => prev.filter((w) => w.id !== watchId));
    },
    []
  );

  const getWatchByIdData = useCallback(
    (watchId: string) => {
      return watches.find((w) => w.id === watchId) || null;
    },
    [watches]
  );

  // Favorite & Wishlist
  const toggleFavorite = useCallback(
    (watchId: string) => {
      const watch = watches.find((w) => w.id === watchId);
      if (watch) {
        updateWatchData(watchId, { isFavorite: !watch.isFavorite });
      }
    },
    [watches, updateWatchData]
  );

  const toggleWishlist = useCallback(
    (watchId: string) => {
      const watch = watches.find((w) => w.id === watchId);
      if (watch) {
        updateWatchData(watchId, { isInWishlist: !watch.isInWishlist });
      }
    },
    [watches, updateWatchData]
  );

  const getFavorites = useCallback(() => {
    return watches.filter((w) => w.isFavorite);
  }, [watches]);

  const getWishlist = useCallback(() => {
    return watches.filter((w) => w.isInWishlist);
  }, [watches]);

  // Search & Filter
  const setSearchFiltersData = useCallback((filters: Partial<SearchFilters>) => {
    setSearchFilters((prev: SearchFilters) => ({ ...prev, ...filters }));
  }, []);

  const resetSearchFilters = useCallback(() => {
    setSearchFilters(DEFAULT_FILTERS);
  }, []);

  // Settings
  const updateCollectionSettings = useCallback((newSettings: Partial<CollectionSettings>) => {
    updateSettings(newSettings);
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Import/Export
  const exportData = useCallback(() => {
    const data = exportCollection();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `watch-collection-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback(
    async (file: File, overwrite: boolean = false): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            await importCollection(data, overwrite);
            const updatedWatches = await getWatches();
            setWatches(updatedWatches);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    },
    []
  );

  // Refresh
  const refreshCollection = useCallback(async () => {
    const updatedWatches = await getWatches();
    const updatedSettings = await getSettings();
    setWatches(updatedWatches);
    setSettings(updatedSettings);
  }, []);

  const value: CollectionContextType = {
    watches,
    stats,
    settings,
    filteredWatches: filteredWatches(),
    searchFilters,
    isLoading,
    addWatch,
    updateWatch: updateWatchData,
    deleteWatchById: deleteWatchData,
    getWatchById: getWatchByIdData,
    toggleFavorite,
    toggleWishlist,
    getFavorites,
    getWishlist,
    setSearchFilters: setSearchFiltersData,
    resetSearchFilters,
    updateCollectionSettings,
    exportData,
    importData,
    refreshCollection,
  };

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within CollectionProvider");
  }
  return context;
}
