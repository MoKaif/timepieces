/**
 * Wishlist — watches you want, captured by URL. Kept separate from the owned
 * collection: nothing here counts toward portfolio value or analytics.
 */

import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Trash2, ArrowRight, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollection } from "@/contexts/CollectionContext";
import { Watch, WishlistFormData } from "@/types";
import { formatCompactINR } from "@/lib/format";
import { toast } from "sonner";

const EMPTY: WishlistFormData = { brand: "", model: "", heroImageUrl: "", listingUrl: "", currentMarketValue: 0, notes: "" };

function AddForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const { addWishlistItem } = useCollection();
  const [form, setForm] = useState<WishlistFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: keyof WishlistFormData, v: string | number) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.brand.trim()) next.brand = "Brand is required";
    if (!form.model.trim()) next.model = "Model is required";
    if (form.listingUrl && !/^https?:\/\//i.test(form.listingUrl)) next.listingUrl = "Enter a full URL (https://…)";
    if (form.heroImageUrl && !/^https?:\/\//i.test(form.heroImageUrl)) next.heroImageUrl = "Enter a full image URL (https://…)";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await addWishlistItem(form);
      toast.success("Added to wishlist");
      onDone();
    } catch {
      toast.error("Couldn't add that. Is the server running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="glass p-6">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brand *</label>
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g., Grand Seiko" className="bg-input border-border" />
            {errors.brand && <p className="text-destructive text-xs mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Model *</label>
            <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="e.g., SBGA211 'Snowflake'" className="bg-input border-border" />
            {errors.model && <p className="text-destructive text-xs mt-1">{errors.model}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input value={form.heroImageUrl} onChange={(e) => set("heroImageUrl", e.target.value)} placeholder="https://…/watch.jpg" className="bg-input border-border" />
            {errors.heroImageUrl && <p className="text-destructive text-xs mt-1">{errors.heroImageUrl}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Buy / listing link</label>
            <Input value={form.listingUrl} onChange={(e) => set("listingUrl", e.target.value)} placeholder="https://…" className="bg-input border-border" />
            {errors.listingUrl && <p className="text-destructive text-xs mt-1">{errors.listingUrl}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Approx. price (₹)</label>
            <Input
              type="number"
              value={form.currentMarketValue || ""}
              onChange={(e) => set("currentMarketValue", parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="bg-input border-border num"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Why you want it, target price, seller…" className="bg-input border-border min-h-20" />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
            {saving ? "Adding…" : "Add to wishlist"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function WishlistCard({ item }: { item: Watch }) {
  const { deleteWatchById, moveToCollection } = useCollection();
  const [, setLocation] = useLocation();

  const remove = () => {
    if (confirm(`Remove ${item.brand} ${item.model} from the wishlist?`)) {
      deleteWatchById(item.id);
      toast.success("Removed from wishlist");
    }
  };

  const acquire = async () => {
    await moveToCollection(item.id);
    toast.success("Moved to your collection — add the purchase details");
    setLocation(`/edit/${item.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="overflow-hidden rounded-lg bg-card border border-border">
        <div className="relative h-56 bg-secondary">
          {item.heroImageUrl ? (
            <img src={item.heroImageUrl} alt={`${item.brand} ${item.model}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="eyebrow">No image</span>
            </div>
          )}
          <button
            onClick={remove}
            aria-label="Remove from wishlist"
            className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-md border border-border hover:border-destructive/60 hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="absolute top-3 left-3 eyebrow px-2 py-1 rounded-full bg-background/50 backdrop-blur-md border border-border">Wanted</span>
        </div>

        <div className="p-4">
          <p className="eyebrow">{item.brand}</p>
          <h3 className="text-lg font-display font-semibold text-foreground truncate mt-1">{item.model || item.name}</h3>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Approx. price</p>
              <p className="num text-lg font-semibold text-primary">
                {item.currentMarketValue > 0 ? formatCompactINR(item.currentMarketValue) : "—"}
              </p>
            </div>
            {item.listingUrl && (
              <a
                href={item.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
              >
                View listing <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {item.notes && <p className="text-sm text-muted-foreground mt-3 line-clamp-3 whitespace-pre-wrap">{item.notes}</p>}

          <Button variant="outline" className="w-full mt-4 border-border hover:border-primary/60" onClick={acquire}>
            I bought this — add to collection <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Wishlist() {
  const { wishlist, isLoading } = useCollection();
  const [adding, setAdding] = useState(false);

  return (
    <Layout currentPage="wishlist">
      <section className="container max-w-7xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Wishlist</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl">Watches I want</h1>
              <p className="text-muted-foreground mt-3">Saved by link — kept out of your collection totals until you buy them.</p>
            </div>
            {!adding && (
              <Button onClick={() => setAdding(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Add to wishlist
              </Button>
            )}
          </div>
        </motion.div>
        <div className="minute-track mt-8" />
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {adding && <AddForm onDone={() => setAdding(false)} onCancel={() => setAdding(false)} />}

        {isLoading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : wishlist.length === 0 ? (
          !adding && (
            <div className="text-center py-24">
              <p className="eyebrow mb-4">Nothing saved</p>
              <h2 className="text-3xl mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">Found a watch you want? Save it with an image and a link to come back to.</p>
              <Button onClick={() => setAdding(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Add to wishlist
              </Button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
