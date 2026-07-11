/**
 * Dashboard Page - Collection Overview
 * Displays key statistics, animated charts, and collection insights
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import { getValueByBrandData, getMostValuableWatches, getCollectionInsights, formatCurrency } from "@/lib/analytics";
import { Link } from "wouter";

const COLORS = ["#d4af37", "#e8e8e8", "#b8860b", "#c9a961", "#8b7500"];

export default function Dashboard() {
  const { watches, stats, isLoading } = useCollection();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <Layout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your collection...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const valueByBrand = getValueByBrandData(watches);
  const mostValuable = getMostValuableWatches(watches, 5);
  const insights = getCollectionInsights(watches);

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
    <Layout currentPage="dashboard">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-card py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }}>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Your Collection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {watches.length === 0
                ? "Start building your horological legacy by adding your first timepiece."
                : "Track, analyze, and celebrate your timepiece investments."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {watches.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">No Watches Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Begin your collection journey. Add your first watch to see analytics and insights.
            </p>
            <Link href="/add">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Add Your First Watch</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate={mounted ? "visible" : "hidden"} className="space-y-12">
            {/* Key Statistics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Watches */}
              <Card className="glass p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Total Watches</h3>
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-accent font-bold">#</span>
                  </div>
                </div>
                <p className="text-4xl font-display font-bold text-white">{stats.totalWatches}</p>
                <p className="text-xs text-muted-foreground mt-2">In your collection</p>
              </Card>

              {/* Total Value */}
              <Card className="glass p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Total Value</h3>
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-accent font-bold">₹</span>
                  </div>
                </div>
                <p className="text-3xl font-display font-bold text-white">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground mt-2">Current market value</p>
              </Card>

              {/* Average Value */}
              <Card className="glass p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Average Value</h3>
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-accent font-bold">≈</span>
                  </div>
                </div>
                <p className="text-3xl font-display font-bold text-white">₹{(stats.averageValue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground mt-2">Per watch average</p>
              </Card>

              {/* Appreciation */}
              <Card className="glass p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Appreciation</h3>
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-display font-bold text-green-400">₹{(stats.totalAppreciation / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground mt-2">Total gains</p>
              </Card>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Value by Brand */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Collection by Brand</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={valueByBrand}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#999" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="value" fill="#d4af37" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Brand Distribution */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Brand Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(stats.brandDistribution).map(([name, value]) => ({
                          name,
                          value,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {Object.entries(stats.brandDistribution).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Most Valuable Watches */}
            <motion.div variants={itemVariants}>
              <Card className="glass p-6">
                <h2 className="text-lg font-display font-bold mb-6">Most Valuable Watches</h2>
                <div className="space-y-4">
                  {mostValuable.map((watch, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{watch.name}</p>
                          <p className="text-xs text-muted-foreground">Premium timepiece</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-accent">₹{(watch.value / 100000).toFixed(1)}L</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Insights */}
            {insights.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="glass p-6 border-accent/30 bg-accent/5">
                  <h2 className="text-lg font-display font-bold mb-4 text-accent">Collection Insights</h2>
                  <ul className="space-y-3">
                    {insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-accent mt-1">•</span>
                        <span className="text-sm text-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Call to Action */}
            <motion.div variants={itemVariants} className="text-center pt-8">
              <Link href="/gallery">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 mr-4">View Gallery</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  Advanced Analytics
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
