/**
 * Add Watch — enter a new piece into the register.
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
      toast.success("Watch added to the register");
      setLocation("/gallery");
    } catch (error) {
      toast.error("Couldn't save the watch. Is the server running?");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout currentPage="add">
      <section className="container max-w-4xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">New entry</p>
          <h1 className="text-4xl md:text-5xl">Add a watch</h1>
          <p className="text-muted-foreground mt-3">Record the piece, its specifications, and what it's worth.</p>
        </motion.div>
        <div className="minute-track mt-8" />
      </section>

      <div className="container max-w-4xl mx-auto px-4 pb-16">
        <WatchForm onSubmit={handleSubmit} onCancel={() => setLocation("/gallery")} isLoading={isLoading} />
      </div>
    </Layout>
  );
}
