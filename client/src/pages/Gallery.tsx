/**
 * Gallery — every piece, searchable and sortable.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { WatchCard } from "@/components/WatchCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollection } from "@/contexts/CollectionContext";
import { Link } from "wouter";

export default function Gallery() {
  const { ownedWatches, filteredWatches, searchFilters, setSearchFilters, resetSearchFilters, toggleFavorite, isLoading } = useCollection();
  const [showFilters, setShowFilters] = useState(false);

  const uniqueBrands = Array.from(new Set(ownedWatches.map((w) => w.brand).filter(Boolean))).sort();

  const handleBrandFilter = (brand: string) => {
    setSearchFilters({
      brands: searchFilters.brands.includes(brand)
        ? searchFilters.brands.filter((b: string) => b !== brand)
        : [...searchFilters.brands, brand],
    });
  };

  if (isLoading) {
    return (
      <Layout currentPage="gallery">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="gallery">
      <section className="container max-w-7xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Gallery</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl">The collection</h1>
            <p className="num text-sm text-muted-foreground pb-2">
              {ownedWatches.length} piece{ownedWatches.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Controls */}
      <div className="container max-w-7xl mx-auto px-4 pb-2">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search brand, model, or reference…"
              value={searchFilters.query}
              onChange={(e) => setSearchFilters({ query: e.target.value })}
              className="pl-11 bg-card border-border h-12"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "border-primary/60 text-primary" : "border-border"}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters{searchFilters.brands.length > 0 ? ` · ${searchFilters.brands.length}` : ""}
            </Button>

            <div className="flex gap-2 items-center">
              <span className="eyebrow hidden sm:inline">Sort</span>
              <Select value={searchFilters.sortBy} onValueChange={(v) => setSearchFilters({ sortBy: v as any })}>
                <SelectTrigger className="w-48 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest added</SelectItem>
                  <SelectItem value="oldest">Oldest added</SelectItem>
                  <SelectItem value="highest-value">Highest value</SelectItem>
                  <SelectItem value="lowest-value">Lowest value</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && uniqueBrands.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
              <p className="eyebrow mb-3">Filter by brand</p>
              <div className="flex flex-wrap gap-2">
                {uniqueBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandFilter(brand)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      searchFilters.brands.includes(brand)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <div className="minute-track mt-6" />
      </div>

      {/* Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-10">
        {ownedWatches.length === 0 ? (
          <div className="text-center py-24">
            <p className="eyebrow mb-4">Empty register</p>
            <h2 className="text-3xl mb-4">No pieces yet</h2>
            <p className="text-muted-foreground mb-8">Add your first timepiece to start the collection.</p>
            <Link href="/add">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Add a watch
              </Button>
            </Link>
          </div>
        ) : filteredWatches.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-2xl mb-4">Nothing matches</h2>
            <p className="text-muted-foreground mb-8">Try a different search or clear the filters.</p>
            <Button variant="outline" onClick={resetSearchFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWatches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} onFavoriteToggle={toggleFavorite} />
              ))}
            </div>
            <p className="num text-center text-sm text-muted-foreground mt-10">
              {filteredWatches.length} of {ownedWatches.length}
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
