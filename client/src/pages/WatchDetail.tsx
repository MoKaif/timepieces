/**
 * Watch Detail Page - Full-Screen Luxury Experience
 * Displays complete watch information with image gallery and specifications
 */

import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Share2, Edit2, Trash2, ChevronRight, Bookmark } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import { toast } from "sonner";

export default function WatchDetail() {
  const [match, params] = useRoute("/watch/:id");
  const [, setLocation] = useLocation();
  const { getWatchById, deleteWatchById, toggleFavorite, toggleWishlist } = useCollection();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!match) {
    return null;
  }

  const watch = getWatchById(params?.id);

  if (!watch) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Watch Not Found</h1>
            <p className="text-muted-foreground mb-8">The watch you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/gallery")}>Back to Gallery</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const allImages = [watch.heroImageUrl, ...watch.galleryImages].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || watch.heroImageUrl;
  const appreciation = watch.currentMarketValue - watch.purchasePrice;
  const appreciationPercent = ((appreciation / watch.purchasePrice) * 100).toFixed(1);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this watch?")) {
      deleteWatchById(watch.id);
      toast.success("Watch deleted");
      setLocation("/gallery");
    }
  };

  return (
    <Layout>
      {/* Hero Image Section */}
      <section className="relative h-screen bg-background overflow-hidden">
        {/* Background Image */}
        {currentImage && (
          <motion.img
            key={currentImageIndex}
            src={currentImage}
            alt={`${watch.brand} ${watch.model}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-8 px-4">
          <div className="container max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/gallery")}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(watch.id)}
                className={`${watch.isFavorite ? "text-accent" : "text-white"} hover:bg-white/20`}
              >
                <Heart className={`w-5 h-5 ${watch.isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleWishlist(watch.id)}
                className={`${watch.isInWishlist ? "text-accent" : "text-white"} hover:bg-white/20`}
              >
                <Bookmark className={`w-5 h-5 ${watch.isInWishlist ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Navigation */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pt-20 pb-8 px-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="container max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" as const }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-accent text-sm uppercase tracking-widest mb-2">{watch.brand}</p>
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">{watch.model}</h1>
                  <p className="text-lg text-muted-foreground">Ref. {watch.referenceNumber}</p>
                </div>
                {appreciation !== 0 && (
                  <div className={`text-right ${appreciation > 0 ? "text-green-400" : "text-red-400"}`}>
                    <p className="text-sm text-muted-foreground">Appreciation</p>
                    <p className="text-2xl font-bold">{appreciation > 0 ? "+" : ""}{appreciationPercent}%</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="bg-background py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Specifications */}
              <Card className="glass p-8">
                <h2 className="text-2xl font-display font-bold mb-6">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Movement Type</p>
                    <p className="text-lg font-semibold text-white capitalize">{watch.movementType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Case Size</p>
                    <p className="text-lg font-semibold text-white">{watch.caseSize}mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Year Acquired</p>
                    <p className="text-lg font-semibold text-white">{watch.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Purchase Date</p>
                    <p className="text-lg font-semibold text-white">{new Date(watch.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Added to Collection</p>
                    <p className="text-lg font-semibold text-white">{new Date(watch.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {watch.notes && (
                <Card className="glass p-8">
                  <h2 className="text-2xl font-display font-bold mb-4">Notes</h2>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{watch.notes}</p>
                </Card>
              )}

              {/* Gallery */}
              {watch.galleryImages.length > 0 && (
                <Card className="glass p-8">
                  <h2 className="text-2xl font-display font-bold mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {watch.galleryImages.map((image, index) => (
                      <motion.img
                        key={index}
                        src={image}
                        alt={`Gallery ${index}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setCurrentImageIndex(index + 1)}
                        whileHover={{ scale: 1.05 }}
                      />
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="glass p-6 border-accent/30 bg-accent/5">
                <h3 className="text-lg font-display font-bold mb-6 text-accent">Valuation</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Market Value</p>
                    <p className="text-3xl font-bold text-accent">₹{(watch.currentMarketValue / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Purchase Price</p>
                    <p className="text-lg text-white">₹{(watch.purchasePrice / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total Appreciation</p>
                    <p className={`text-lg font-semibold ${appreciation > 0 ? "text-green-400" : "text-red-400"}`}>
                      {appreciation > 0 ? "+" : ""}₹{(appreciation / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Watch
                </Button>
                <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Watch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
