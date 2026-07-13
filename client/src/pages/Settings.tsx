/**
 * Settings — manage the register: backup, restore, and reset.
 */

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Upload, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import { formatCompactINR } from "@/lib/format";
import { toast } from "sonner";

export default function Settings() {
  const { watches, stats, exportData, importData, clearCollection } = useCollection();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExport = async () => {
    try {
      await exportData();
      toast.success("Collection exported");
    } catch {
      toast.error("Couldn't export the collection");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      await importData(file, false);
      toast.success("Collection imported");
    } catch (error) {
      toast.error("Couldn't read that file. Check it's a Timepieces export.");
      console.error(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = async () => {
    if (!confirm("Remove every watch from the register? Export a backup first — this can't be undone.")) return;
    setIsClearing(true);
    try {
      await clearCollection();
      toast.success("Register cleared");
    } catch {
      toast.error("Couldn't clear the register");
    } finally {
      setIsClearing(false);
    }
  };

  const lastUpdated =
    watches.length > 0 ? new Date(Math.max(...watches.map((w) => new Date(w.updatedAt).getTime()))).toLocaleDateString("en-IN") : "Never";
  const sizeKb = (JSON.stringify(watches).length / 1024).toFixed(1);

  return (
    <Layout currentPage="settings">
      <section className="container max-w-4xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Settings</p>
          <h1 className="text-4xl md:text-5xl">Manage the register</h1>
        </motion.div>
        <div className="minute-track mt-8" />
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Overview */}
        <Card className="glass p-7">
          <h2 className="text-2xl mb-6">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="eyebrow mb-2">Pieces</p>
              <p className="num text-3xl font-semibold text-primary">{stats.totalWatches}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Value</p>
              <p className="num text-3xl font-semibold text-foreground">{formatCompactINR(stats.totalValue)}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Data size</p>
              <p className="num text-3xl font-semibold text-foreground">
                {sizeKb}
                <span className="text-base text-muted-foreground"> KB</span>
              </p>
            </div>
            <div>
              <p className="eyebrow mb-2">Last updated</p>
              <p className="num text-sm text-foreground mt-3">{lastUpdated}</p>
            </div>
          </div>
        </Card>

        {/* Backup & Restore */}
        <Card className="glass p-7">
          <h2 className="text-2xl mb-2">Backup &amp; restore</h2>
          <p className="text-muted-foreground mb-6">
            Export the whole register to a JSON file, or import one to merge it back in. Images are included in the export.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12">
              <Download className="w-5 h-5 mr-2" /> Export collection
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-border hover:border-primary/60 h-12"
              disabled={isImporting}
            >
              <Upload className="w-5 h-5 mr-2" /> {isImporting ? "Importing…" : "Import collection"}
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleImportFile} className="hidden" disabled={isImporting} />
        </Card>

        {/* Danger zone */}
        <Card className="glass p-7 border-destructive/30">
          <h2 className="text-2xl mb-2 text-destructive">Danger zone</h2>
          <p className="text-muted-foreground mb-6">Permanent. Export a backup before you do this.</p>
          <Button
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleClear}
            disabled={isClearing || watches.length === 0}
          >
            <Trash2 className="w-5 h-5 mr-2" /> {isClearing ? "Clearing…" : "Clear all watches"}
          </Button>
        </Card>

        {/* About */}
        <Card className="glass p-7">
          <h2 className="text-2xl mb-6">About</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Timepieces</p>
              <p className="num text-muted-foreground">Version 1.2.0</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Where your data lives</p>
              <p className="text-muted-foreground">
                Stored in your own PostgreSQL database through the app's API — not the browser. It persists across devices and sessions as long as
                the database is running.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Privacy</p>
              <p className="text-muted-foreground">Self-hosted and private. Nothing is sent to a third party.</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
