/**
 * Gallery Page - Collection Display
 * Shows all watches with filtering, sorting, and search capabilities
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Layout } from "@/components/Layout";
import { WatchCard } from "@/components/WatchCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollection } from "@/contexts/CollectionContext";
import { Link } from "wouter";

export default function Gallery() {
  const { watches, filteredWatches, searchFilters, setSearchFilters, toggleFavorite, toggleWishlist, isLoading } = useCollection();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters({ query: e.target.value });
  };

  const handleSortChange = (value: string) => {
    setSearchFilters({ sortBy: value as any });
  };

  const handleBrandFilter = (brand: string) => {
    setSearchFilters({
      brands: searchFilters.brands.includes(brand)
        ? searchFilters.brands.filter((b: string) => b !== brand)
        : [...searchFilters.brands, brand],
    });
  };

  const uniqueBrands = Array.from(new Set(watches.map((w) => w.brand))).sort();

  if (isLoading) {
    return (
      <Layout currentPage="gallery">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="gallery">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-card py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }}>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Your Collection</h1>
            <p className="text-xl text-muted-foreground">
              {watches.length === 0 ? "No watches yet. Start building your collection." : `${watches.length} timepiece${watches.length !== 1 ? "s" : ""} in your collection`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls Section */}
      <div className="container max-w-7xl mx-auto px-4 py-8 border-b border-border">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by brand, model, or reference number..."
              value={searchFilters.query}
              onChange={handleSearchChange}
              className="pl-12 bg-card border-border h-12"
            />
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-accent text-accent-foreground" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={searchFilters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Added</SelectItem>
                  <SelectItem value="oldest">Oldest Added</SelectItem>
                  <SelectItem value="highest-value">Highest Value</SelectItem>
                  <SelectItem value="lowest-value">Lowest Value</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Brand Filters */}
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-3">Filter by Brand</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandFilter(brand)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        searchFilters.brands.includes(brand)
                          ? "bg-accent text-accent-foreground"
                          : "bg-card border border-border text-foreground hover:border-accent"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {watches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-display font-bold mb-4">No Watches Yet</h2>
            <p className="text-muted-foreground mb-8">Start your collection by adding your first timepiece.</p>
            <Link href="/add">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Add Your First Watch</Button>
            </Link>
          </motion.div>
        ) : filteredWatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="text-center py-20"
          >
            <h2 className="text-2xl font-display font-bold mb-4">No Watches Found</h2>
            <p className="text-muted-foreground mb-8">Try adjusting your search or filters.</p>
            <Button variant="outline" onClick={() => setSearchFilters({ query: "", brands: [] })}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredWatches.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                onFavoriteToggle={toggleFavorite}
                onWishlistToggle={toggleWishlist}
              />
            ))}
          </motion.div>
        )}

        {/* Results Info */}
        {filteredWatches.length > 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <p>
              Showing {filteredWatches.length} of {watches.length} watch{watches.length !== 1 ? "es" : ""}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
