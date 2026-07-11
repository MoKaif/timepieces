/**
 * Add Watch Page
 * Form to add a new watch to the collection
 */

import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WatchForm } from "@/components/WatchForm";
import { useCollection } from "@/contexts/CollectionContext";
import { WatchFormData } from "@/types";
import { toast } from "sonner";

export default function AddWatch() {
  const [, setLocation] = useLocation();
  const { addWatch } = useCollection();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: WatchFormData) => {
    setIsLoading(true);
    try {
      await addWatch(data);
      toast.success("Watch added successfully!");
      setLocation("/gallery");
    } catch (error) {
      toast.error("Failed to add watch. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocation("/gallery");
  };

  return (
    <Layout currentPage="add">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-card py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }}>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Add a Watch</h1>
            <p className="text-xl text-muted-foreground">Expand your collection with a new timepiece</p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}>
          <WatchForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
        </motion.div>
      </div>
    </Layout>
  );
}
