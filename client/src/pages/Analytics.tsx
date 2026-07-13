/**
 * Analytics — how the collection breaks down and moves.
 */

import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
import { formatCompactINR, formatINR, formatPercentChange } from "@/lib/format";
import { CHART_COLORS, axisProps, tooltipStyle } from "@/lib/chartTheme";

export default function Analytics() {
  const { ownedWatches, isLoading } = useCollection();
  const stats = calculateStats(ownedWatches);

  if (isLoading) {
    return (
      <Layout currentPage="analytics">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const valueByBrand = getValueByBrandData(ownedWatches);
  const brandDistribution = getBrandDistributionData(ownedWatches);
  const mostValuable = getMostValuableWatches(ownedWatches);
  const appreciation = getAppreciationData(ownedWatches);
  const movementTypes = getWatchesByMovement(ownedWatches);
  const yearData = getWatchesByYear(ownedWatches);

  const summary = [
    { k: "Pieces", v: String(stats.totalWatches) },
    { k: "Total value", v: formatCompactINR(stats.totalValue), tone: "brass" },
    { k: "Average piece", v: formatCompactINR(stats.averageValue) },
    { k: "Appreciation", v: formatCompactINR(stats.totalAppreciation), tone: "pos" },
  ];

  return (
    <Layout currentPage="analytics">
      <section className="container max-w-7xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Analytics</p>
          <h1 className="text-4xl md:text-5xl">The collection, measured</h1>
        </motion.div>
        <div className="minute-track mt-8" />
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {ownedWatches.length === 0 ? (
          <div className="text-center py-24">
            <p className="eyebrow mb-4">No data</p>
            <h2 className="text-3xl mb-4">Nothing to measure yet</h2>
            <p className="text-muted-foreground">Add watches to populate the analytics.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {summary.map((s) => (
                <Card key={s.k} className="glass p-5">
                  <p className="eyebrow">{s.k}</p>
                  <p
                    className={`num text-2xl md:text-3xl font-semibold mt-2 ${
                      s.tone === "brass" ? "text-primary" : s.tone === "pos" ? "text-positive" : "text-foreground"
                    }`}
                  >
                    {s.v}
                  </p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass p-6">
                <h3 className="text-xl mb-6">Value by brand</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueByBrand}>
                    <CartesianGrid strokeDasharray="2 4" stroke={tooltipStyle.contentStyle.border} vertical={false} />
                    <XAxis dataKey="name" {...axisProps} />
                    <YAxis {...axisProps} tickFormatter={(v) => formatCompactINR(v).replace("₹", "")} width={52} />
                    <Tooltip {...tooltipStyle} formatter={(v: any) => formatINR(v)} />
                    <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="glass p-6">
                <h3 className="text-xl mb-6">Brand distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={brandDistribution} cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={2} dataKey="value">
                      {brandDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="#0b111c" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                    <Legend wrapperStyle={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "#8a97ab" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="glass p-6">
                <h3 className="text-xl mb-6">Movement types</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={movementTypes} layout="vertical">
                    <CartesianGrid strokeDasharray="2 4" stroke={tooltipStyle.contentStyle.border} horizontal={false} />
                    <XAxis type="number" {...axisProps} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" {...axisProps} width={92} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[0, 6, 6, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="glass p-6">
                <h3 className="text-xl mb-6">Acquired by year</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearData}>
                    <CartesianGrid strokeDasharray="2 4" stroke={tooltipStyle.contentStyle.border} vertical={false} />
                    <XAxis dataKey="year" {...axisProps} />
                    <YAxis {...axisProps} allowDecimals={false} width={32} />
                    <Tooltip {...tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ fill: CHART_COLORS[0], r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Top value + appreciation ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass p-6">
                <h3 className="text-xl mb-6">Top 5 most valuable</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mostValuable} layout="vertical">
                    <CartesianGrid strokeDasharray="2 4" stroke={tooltipStyle.contentStyle.border} horizontal={false} />
                    <XAxis type="number" {...axisProps} tickFormatter={(v) => formatCompactINR(v).replace("₹", "")} />
                    <YAxis dataKey="name" type="category" {...axisProps} width={140} />
                    <Tooltip {...tooltipStyle} formatter={(v: any) => formatINR(v)} />
                    <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="glass p-6">
                <h3 className="text-xl mb-6">Appreciation by piece</h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                  {appreciation.slice(0, 10).map((item, index) => {
                    const pct = formatPercentChange(item.purchasePrice, item.currentValue);
                    const up = item.appreciation > 0;
                    return (
                      <div key={index} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="num text-xs text-muted-foreground">
                            {formatCompactINR(item.purchasePrice)} → {formatCompactINR(item.currentValue)}
                          </p>
                        </div>
                        <p className={`num text-sm font-semibold ${up ? "text-positive" : "text-destructive"}`}>{pct ?? "—"}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
