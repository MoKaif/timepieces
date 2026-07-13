/**
 * Edit Watch — amend an existing entry in the register.
 */

import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WatchForm } from "@/components/WatchForm";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/contexts/CollectionContext";
import { WatchFormData } from "@/types";
import { toast } from "sonner";

export default function EditWatch() {
  const [match, params] = useRoute("/edit/:id");
  const [, setLocation] = useLocation();
  const { getWatchById, updateWatch, isLoading: collectionLoading } = useCollection();
  const [isSaving, setIsSaving] = useState(false);

  if (!match) return null;

  const watch = getWatchById(params?.id ?? "");

  if (!watch) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-center">
          <div>
            <p className="eyebrow mb-4">Not found</p>
            <h1 className="text-3xl mb-4">{collectionLoading ? "Loading…" : "No such piece"}</h1>
            {!collectionLoading && (
              <Button onClick={() => setLocation("/gallery")} className="mt-2">
                Back to gallery
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (data: WatchFormData) => {
    setIsSaving(true);
    try {
      await updateWatch(watch.id, data);
      toast.success("Watch updated");
      setLocation(`/watch/${watch.id}`);
    } catch (error) {
      toast.error("Couldn't save changes. Is the server running?");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <section className="container max-w-4xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">{watch.brand}</p>
          <h1 className="text-4xl md:text-5xl">Edit {watch.model || watch.name}</h1>
        </motion.div>
        <div className="minute-track mt-8" />
      </section>

      <div className="container max-w-4xl mx-auto px-4 pb-16">
        <WatchForm initialData={watch} onSubmit={handleSubmit} onCancel={() => setLocation(`/watch/${watch.id}`)} isLoading={isSaving} />
      </div>
    </Layout>
  );
}
