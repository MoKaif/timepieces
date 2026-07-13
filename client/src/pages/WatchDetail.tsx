/**
 * Watch Detail — a full-bleed look at a single piece, with specs, valuation,
 * and the gallery.
 */

import React, { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Share2, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import { formatCompactINR, formatINR, formatPercentChange } from "@/lib/format";
import { toast } from "sonner";

export default function WatchDetail() {
  const [match, params] = useRoute("/watch/:id");
  const [, setLocation] = useLocation();
  const { getWatchById, deleteWatchById, toggleFavorite } = useCollection();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!match) return null;

  const watch = getWatchById(params?.id ?? "");

  if (!watch) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-center">
          <div>
            <p className="eyebrow mb-4">Not found</p>
            <h1 className="text-3xl mb-4">No such piece</h1>
            <p className="text-muted-foreground mb-8">This watch isn't in the register.</p>
            <Button onClick={() => setLocation("/gallery")}>Back to gallery</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const allImages = [watch.heroImageUrl, ...watch.galleryImages].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || watch.heroImageUrl;
  const appreciation = watch.currentMarketValue - watch.purchasePrice;
  const pct = formatPercentChange(watch.purchasePrice, watch.currentMarketValue);
  const up = appreciation > 0;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const handleDelete = () => {
    if (confirm("Remove this watch from the register? This can't be undone.")) {
      deleteWatchById(watch.id);
      toast.success("Watch removed");
      setLocation("/gallery");
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[78vh] min-h-[520px] bg-secondary overflow-hidden">
        {currentImage ? (
          <motion.img
            key={currentImageIndex}
            src={currentImage}
            alt={`${watch.brand} ${watch.model}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="eyebrow">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/10 to-background" />

        {/* Top controls */}
        <div className="absolute top-0 inset-x-0 z-20 pt-6">
          <div className="container max-w-7xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/gallery")} className="text-foreground hover:bg-foreground/10">
              <ChevronLeft className="w-4 h-4 mr-1.5" /> Gallery
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(watch.id)} className={watch.isFavorite ? "text-primary" : "text-foreground"}>
                <Heart className={`w-5 h-5 ${watch.isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} className="text-foreground">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((p) => (p - 1 + allImages.length) % allImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/40 backdrop-blur-md border border-border hover:border-primary/50 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((p) => (p + 1) % allImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/40 backdrop-blur-md border border-border hover:border-primary/50 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="num absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-background/50 backdrop-blur-md border border-border text-xs">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}

        {/* Title block */}
        <div className="absolute bottom-0 inset-x-0 z-10 pb-8">
          <div className="container max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="eyebrow text-primary mb-2">{watch.brand}</p>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl md:text-6xl">{watch.model || watch.name}</h1>
                {pct && (
                  <div className={`text-right ${up ? "text-positive" : "text-destructive"}`}>
                    <p className="eyebrow text-muted-foreground mb-1">Change</p>
                    <p className="num text-2xl font-semibold">{pct}</p>
                  </div>
                )}
              </div>
              {watch.referenceNumber && <p className="num text-sm text-muted-foreground mt-3">Ref. {watch.referenceNumber}</p>}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-14">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass p-7">
              <h2 className="text-2xl mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { k: "Movement", v: watch.movementType, cap: true },
                  { k: "Case size", v: `${watch.caseSize}mm`, mono: true },
                  { k: "Year acquired", v: String(watch.year), mono: true },
                  { k: "Purchase date", v: watch.purchaseDate ? new Date(watch.purchaseDate).toLocaleDateString("en-IN") : "—", mono: true },
                  { k: "Added", v: new Date(watch.createdAt).toLocaleDateString("en-IN"), mono: true },
                ].map((row) => (
                  <div key={row.k}>
                    <p className="eyebrow mb-2">{row.k}</p>
                    <p className={`text-lg text-foreground ${row.cap ? "capitalize" : ""} ${row.mono ? "num" : ""}`}>{row.v}</p>
                  </div>
                ))}
              </div>
            </Card>

            {watch.notes && (
              <Card className="glass p-7">
                <h2 className="text-2xl mb-4">Notes</h2>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{watch.notes}</p>
              </Card>
            )}

            {watch.galleryImages.length > 0 && (
              <Card className="glass p-7">
                <h2 className="text-2xl mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {watch.galleryImages.map((image, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index + 1)} className="group">
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-border group-hover:border-primary/50 transition-colors"
                      />
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass p-6 border-primary/25">
              <p className="eyebrow text-primary mb-6">Valuation</p>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current market value</p>
                  <p className="num text-3xl font-semibold text-primary">{formatINR(watch.currentMarketValue)}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Purchase price</p>
                  <p className="num text-lg text-foreground">{formatINR(watch.purchasePrice)}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">{up ? "Appreciation" : "Depreciation"}</p>
                  <p className={`num text-lg font-semibold ${up ? "text-positive" : "text-destructive"}`}>
                    {(appreciation >= 0 ? "+" : "") + formatCompactINR(appreciation)}
                    {pct ? ` · ${pct}` : ""}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Link href={`/edit/${watch.id}`}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Pencil className="w-4 h-4 mr-2" /> Edit watch
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-destructive/40 text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" /> Remove
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
