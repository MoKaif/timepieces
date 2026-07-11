/**
 * Analytics Page - Advanced Collection Analytics
 * Displays comprehensive charts, trends, and insights
 */

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import {
  getValueByBrandData,
  getBrandDistributionData,
  getMostValuableWatches,
  getAppreciationData,
  getWatchesByMovement,
  getWatchesByYear,
  calculateStats,
} from "@/lib/analytics";

const COLORS = ["#d4af37", "#e8e8e8", "#b8860b", "#c9a961", "#8b7500"];

export default function Analytics() {
  const { watches, isLoading } = useCollection();
  const stats = calculateStats(watches);

  if (isLoading) {
    return (
      <Layout currentPage="analytics">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const valueByBrand = getValueByBrandData(watches);
  const brandDistribution = getBrandDistributionData(watches);
  const mostValuable = getMostValuableWatches(watches);
  const appreciation = getAppreciationData(watches);
  const movementTypes = getWatchesByMovement(watches);
  const yearData = getWatchesByYear(watches);

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
    <Layout currentPage="analytics">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-card py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }}>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Analytics</h1>
            <p className="text-xl text-muted-foreground">Deep insights into your collection</p>
          </motion.div>
        </div>
      </section>

      {/* Analytics Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {watches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-display font-bold mb-4">No Data Available</h2>
            <p className="text-muted-foreground">Add watches to your collection to see analytics.</p>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Row 1: Value Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Value by Brand */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Collection Value by Brand</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={valueByBrand}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#999" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value: any) => `₹${(value / 100000).toFixed(1)}L`}
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
                        data={brandDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {brandDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Row 2: Movement & Year */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Movement Types */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Movement Types</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={movementTypes} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#999" style={{ fontSize: "12px" }} />
                      <YAxis dataKey="name" type="category" stroke="#999" style={{ fontSize: "12px" }} width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="value" fill="#d4af37" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Watches by Year */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Watches Acquired by Year</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="year" stroke="#999" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#999" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line type="monotone" dataKey="count" stroke="#d4af37" strokeWidth={2} dot={{ fill: "#d4af37" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Row 3: Appreciation & Most Valuable */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Valuable Watches */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Top 5 Most Valuable</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mostValuable} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#999" style={{ fontSize: "12px" }} />
                      <YAxis dataKey="name" type="category" stroke="#999" style={{ fontSize: "12px" }} width={150} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value: any) => `₹${(value / 100000).toFixed(1)}L`}
                      />
                      <Bar dataKey="value" fill="#d4af37" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Appreciation/Depreciation */}
              <motion.div variants={itemVariants}>
                <Card className="glass p-6">
                  <h2 className="text-lg font-display font-bold mb-6">Appreciation by Watch</h2>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {appreciation.slice(0, 8).map((item, index) => {
                      const percentVal = Number(item.percentChange);
                      return (
                        <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{(item.purchasePrice / 100000).toFixed(1)}L → ₹{(item.currentValue / 100000).toFixed(1)}L
                            </p>
                          </div>
                          <p className={`text-sm font-bold ml-4 ${percentVal > 0 ? "text-green-400" : "text-red-400"}`}>
                            {percentVal > 0 ? "+" : ""}{item.percentChange}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Row 4: Summary Stats */}
            <motion.div variants={itemVariants}>
              <Card className="glass p-8 border-accent/30 bg-accent/5">
                <h2 className="text-2xl font-display font-bold mb-6 text-accent">Collection Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Watches</p>
                    <p className="text-3xl font-bold text-white">{stats.totalWatches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Value</p>
                    <p className="text-3xl font-bold text-accent">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Average Value</p>
                    <p className="text-3xl font-bold text-white">₹{(stats.averageValue / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Appreciation</p>
                    <p className="text-3xl font-bold text-green-400">₹{(stats.totalAppreciation / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
