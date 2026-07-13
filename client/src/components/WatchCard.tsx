/**
 * Watch Card — a dial plate in the gallery grid.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Watch } from "@/types";
import { Link } from "wouter";
import { formatCompactINR, formatPercentChange } from "@/lib/format";

interface WatchCardProps {
  watch: Watch;
  onFavoriteToggle: (watchId: string) => void;
}

export function WatchCard({ watch, onFavoriteToggle }: WatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const appreciation = watch.currentMarketValue - watch.purchasePrice;
  const pct = formatPercentChange(watch.purchasePrice, watch.currentMarketValue);
  const up = appreciation > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/watch/${watch.id}`}>
        <a className="block cursor-pointer">
          <div className="hover-lift overflow-hidden rounded-lg bg-card border border-border">
            <div className="relative h-64 overflow-hidden bg-secondary">
              {watch.heroImageUrl ? (
                <motion.img
                  src={watch.heroImageUrl}
                  alt={`${watch.brand} ${watch.model}`}
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.04 : 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="eyebrow">No image</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {watch.brandLogoUrl && (
                <div className="absolute top-3 left-3 w-11 h-11 bg-background/50 backdrop-blur-md rounded-md p-1.5 border border-border">
                  <img src={watch.brandLogoUrl} alt={watch.brand} className="w-full h-full object-contain" />
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteToggle(watch.id);
                }}
                aria-label="Toggle favorite"
                className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-md border border-border hover:border-primary/60 transition-colors"
              >
                <Heart className={`w-4 h-4 ${watch.isFavorite ? "fill-primary text-primary" : "text-foreground"}`} />
              </button>

              {pct && (
                <div
                  className={`absolute bottom-3 left-3 num px-2.5 py-1 rounded-full text-xs font-medium bg-background/60 backdrop-blur-md border ${
                    up ? "text-positive border-positive/30" : "text-destructive border-destructive/30"
                  }`}
                >
                  {pct}
                </div>
              )}
            </div>

            <div className="p-4">
              <p className="eyebrow">{watch.brand}</p>
              <h3 className="text-lg font-display font-semibold text-foreground truncate mt-1">{watch.model || watch.name}</h3>

              <div className="grid grid-cols-2 gap-2 mt-3 mb-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Movement</p>
                  <p className="text-foreground capitalize">{watch.movementType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Case</p>
                  <p className="text-foreground num">{watch.caseSize}mm</p>
                </div>
              </div>

              <div className="flex items-end justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Current value</p>
                  <p className="num text-lg font-semibold text-primary">{formatCompactINR(watch.currentMarketValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="num text-sm text-muted-foreground">{formatCompactINR(watch.purchasePrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
}
