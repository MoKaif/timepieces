/**
 * Dashboard — the collection readout.
 * Opens with the portfolio figure (the most characteristic thing about a
 * collection register), then the pieces and how the collection breaks down.
 */

import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ArrowRight, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { WatchCard } from "@/components/WatchCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection } from "@/contexts/CollectionContext";
import { getValueByBrandData, getMostValuableWatches, getCollectionInsights } from "@/lib/analytics";
import { formatCompactINR, formatINR, formatSignedCompactINR } from "@/lib/format";
import { CHART_COLORS, axisProps, tooltipStyle } from "@/lib/chartTheme";
import { Link } from "wouter";

function Loader({ label }: { label: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="eyebrow">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { watches, stats, isLoading, toggleFavorite, toggleWishlist } = useCollection();

  if (isLoading) {
    return (
      <Layout currentPage="dashboard">
        <Loader label="Reading the register" />
      </Layout>
    );
  }

  const netChange = stats.totalAppreciation - stats.totalDepreciation;
  const up = netChange >= 0;
  const valueByBrand = getValueByBrandData(watches);
  const brandDistribution = Object.entries(stats.brandDistribution).map(([name, value]) => ({ name, value }));
  const mostValuable = getMostValuableWatches(watches, 5);
  const insights = getCollectionInsights(watches);
  const recent = [...watches].slice(0, 3);

  if (watches.length === 0) {
    return (
      <Layout currentPage="dashboard">
        <div className="container max-w-3xl mx-auto px-4 py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow mb-4">Empty register</p>
            <h1 className="text-4xl md:text-5xl mb-5">Wind the first piece.</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Add a watch to open your register. Value, movement, and appreciation all follow from there.
            </p>
            <Link href="/add">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Add your first watch
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const tiles = [
    { label: "Pieces", value: String(stats.totalWatches), sub: "in the register" },
    { label: "Average piece", value: formatCompactINR(stats.averageValue), sub: "current value" },
    {
      label: "Net change",
      value: formatSignedCompactINR(netChange),
      sub: up ? "appreciation" : "depreciation",
      tone: up ? "pos" : "neg",
    },
    { label: "Brands", value: String(Object.keys(stats.brandDistribution).length), sub: "represented" },
  ];

  return (
    <Layout currentPage="dashboard">
      {/* Hero readout */}
      <section className="container max-w-7xl mx-auto px-4 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" as const }}>
          <p className="eyebrow mb-4">The Register · Portfolio value</p>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <span className="num text-5xl md:text-7xl font-semibold text-foreground tracking-tight">{formatINR(stats.totalValue)}</span>
            <span
              className={`num inline-flex items-center gap-1.5 text-sm mb-2 px-2.5 py-1 rounded-full border ${
                up ? "text-positive border-positive/30" : "text-destructive border-destructive/30"
              }`}
            >
              {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {formatSignedCompactINR(netChange)}
            </span>
          </div>
          <p className="text-muted-foreground mt-3 max-w-xl">
            {stats.totalWatches} timepiece{stats.totalWatches !== 1 ? "s" : ""}, valued against what you paid.
          </p>
        </motion.div>

        <div className="minute-track my-8" />

        {/* Subdial stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tiles.map((t) => (
            <Card key={t.label} className="glass p-5">
              <p className="eyebrow">{t.label}</p>
              <p
                className={`num text-2xl md:text-3xl font-semibold mt-2 ${
                  t.tone === "pos" ? "text-positive" : t.tone === "neg" ? "text-destructive" : "text-foreground"
                }`}
              >
                {t.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{t.sub}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Recently added */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl">Recently added</h2>
              <Link href="/gallery">
                <a className="eyebrow inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  All pieces <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((w) => (
                <WatchCard key={w.id} watch={w} onFavoriteToggle={toggleFavorite} onWishlistToggle={toggleWishlist} />
              ))}
            </div>
          </section>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass p-6">
            <h3 className="text-xl mb-1">Value by brand</h3>
            <p className="text-xs text-muted-foreground mb-6">Where the portfolio concentrates</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={valueByBrand} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={tooltipStyle.contentStyle.border} vertical={false} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => formatCompactINR(v).replace("₹", "")} width={52} />
                <Tooltip {...tooltipStyle} formatter={(v: any) => formatINR(v)} />
                <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-xl mb-1">Brand distribution</h3>
            <p className="text-xs text-muted-foreground mb-6">Pieces per maker</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={brandDistribution} cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={2} dataKey="value">
                  {brandDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="#0b111c" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Most valuable — ledger */}
        <Card className="glass p-6">
          <h3 className="text-xl mb-6">Most valuable</h3>
          <div>
            {mostValuable.map((w, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="num text-sm text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-medium text-foreground truncate">{w.name}</p>
                </div>
                <p className="num text-primary font-semibold ml-4">{formatCompactINR(w.value)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Insights */}
        {insights.length > 0 && (
          <Card className="glass p-6 border-primary/25">
            <p className="eyebrow mb-4 text-primary">Observations</p>
            <ul className="space-y-3">
              {insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground">{insight}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/analytics">
            <Button variant="outline" className="border-border hover:border-primary/60">
              Full analytics <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/add">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add a watch
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
