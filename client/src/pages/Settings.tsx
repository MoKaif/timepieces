/**
 * Settings Page - Collection Management & Preferences
 * Import/export, backup, and collection settings
 */

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Upload, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import { toast } from "sonner";

export default function Settings() {
  const { watches, exportData, importData } = useCollection();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      exportData();
      toast.success("Collection exported successfully!");
    } catch (error) {
      toast.error("Failed to export collection");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importData(file, false);
      toast.success("Collection imported successfully!");
    } catch (error) {
      toast.error("Failed to import collection. Please check the file format.");
      console.error(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearCollection = () => {
    if (confirm("Are you sure you want to clear all watches? This action cannot be undone.")) {
      toast.success("Collection cleared");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <Layout currentPage="settings">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-card py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }}>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Settings</h1>
            <p className="text-xl text-muted-foreground">Manage your collection and preferences</p>
          </motion.div>
        </div>
      </section>

      {/* Settings Content */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Collection Stats */}
          <motion.div variants={itemVariants}>
            <Card className="glass p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Collection Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Watches</p>
                  <p className="text-4xl font-bold text-accent">{watches.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Storage Used</p>
                  <p className="text-4xl font-bold text-accent">
                    {(JSON.stringify(watches).length / 1024).toFixed(1)}
                    <span className="text-lg">KB</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Last Updated</p>
                  <p className="text-sm font-semibold text-white">
                    {watches.length > 0
                      ? new Date(Math.max(...watches.map((w) => new Date(w.updatedAt).getTime()))).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Import/Export */}
          <motion.div variants={itemVariants}>
            <Card className="glass p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Backup & Restore</h2>
              <p className="text-muted-foreground mb-6">
                Export your collection as a JSON file for backup or transfer to another device. You can import it anytime to restore your data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleExport} className="bg-accent text-accent-foreground hover:bg-accent/90 h-12">
                  <Download className="w-5 h-5 mr-2" />
                  Export Collection
                </Button>
                <Button
                  onClick={handleImportClick}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10 h-12"
                  disabled={isImporting}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {isImporting ? "Importing..." : "Import Collection"}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                disabled={isImporting}
              />
              <p className="text-xs text-muted-foreground mt-4">
                Tip: Export your collection regularly to ensure you have a backup. The exported file contains all your watches, images, and settings.
              </p>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div variants={itemVariants}>
            <Card className="glass p-8 border-red-500/30 bg-red-500/5">
              <h2 className="text-2xl font-display font-bold mb-6 text-red-400">Danger Zone</h2>
              <p className="text-muted-foreground mb-6">
                These actions are permanent and cannot be undone. Please proceed with caution.
              </p>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={handleClearCollection}>
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All Watches
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Warning: This will permanently delete all watches from your collection. Make sure you have a backup before proceeding.
              </p>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants}>
            <Card className="glass p-8">
              <h2 className="text-2xl font-display font-bold mb-6">About</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Horological Collection Portfolio</p>
                  <p className="text-sm">Version 1.0.0</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Data Storage</p>
                  <p className="text-sm">All data is stored locally in your browser using LocalStorage. No data is sent to external servers.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Privacy</p>
                  <p className="text-sm">Your collection is completely private and only accessible from your device. You have full control over your data.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Browser Compatibility</p>
                  <p className="text-sm">Works best on modern browsers (Chrome, Firefox, Safari, Edge). Requires LocalStorage support.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
