/**
 * Watch Card Component
 * Displays a single watch with hover effects and interactions
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, Bookmark } from "lucide-react";
import { Watch } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface WatchCardProps {
  watch: Watch;
  onFavoriteToggle: (watchId: string) => void;
  onWishlistToggle: (watchId: string) => void;
}

export function WatchCard({ watch, onFavoriteToggle, onWishlistToggle }: WatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const appreciation = watch.currentMarketValue - watch.purchasePrice;
  const appreciationPercent = ((appreciation / watch.purchasePrice) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/watch/${watch.id}`}>
        <a className="block cursor-pointer">
          <div className="relative overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-luxury">
            {/* Hero Image */}
            <div className="relative h-64 overflow-hidden bg-muted">
              {watch.heroImageUrl ? (
                <motion.img
                  src={watch.heroImageUrl}
                  alt={`${watch.brand} ${watch.model}`}
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}

              {/* Overlay on Hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4"
                >
                  <div className="w-full">
                    <Link href={`/watch/${watch.id}`}>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Brand Logo Badge */}
              {watch.brandLogoUrl && (
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
                  <img src={watch.brandLogoUrl} alt={watch.brand} className="w-full h-full object-contain" />
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteToggle(watch.id);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-accent/30 transition-colors"
              >
                <Heart className={`w-5 h-5 ${watch.isFavorite ? "fill-accent text-accent" : "text-white"}`} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  onWishlistToggle(watch.id);
                }}
                className="absolute top-4 right-16 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-accent/30 transition-colors"
              >
                <Bookmark className={`w-5 h-5 ${watch.isInWishlist ? "fill-accent text-accent" : "text-white"}`} />
              </button>

              {/* Appreciation Badge */}
              {appreciation !== 0 && (
                <div
                  className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                    appreciation > 0
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                  }`}
                >
                  {appreciation > 0 ? "+" : ""}{appreciationPercent}%
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Brand & Model */}
              <div className="mb-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{watch.brand}</p>
                <h3 className="text-lg font-display font-bold text-white truncate">{watch.model}</h3>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                <div>
                  <p className="text-muted-foreground">Movement</p>
                  <p className="text-white capitalize">{watch.movementType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Case Size</p>
                  <p className="text-white">{watch.caseSize}mm</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Current Value</span>
                  <span className="text-lg font-bold text-accent">₹{(watch.currentMarketValue / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Purchase Price</span>
                  <span className="text-sm text-muted-foreground">₹{(watch.purchasePrice / 100000).toFixed(1)}L</span>
                </div>
              </div>

              {/* Collection Percentage */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Collection Share</span>
                  <span className="text-xs font-semibold text-accent">View Details</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
}
