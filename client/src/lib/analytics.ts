/**
 * Analytics and statistics utilities for watch collection
 * Calculates all dashboard metrics and chart data
 */

import { Watch, CollectionStats, CollectionSnapshot } from "@/types";

/**
 * Calculate collection statistics
 */
export function calculateStats(watches: Watch[]): CollectionStats {
  if (watches.length === 0) {
    return {
      totalWatches: 0,
      totalValue: 0,
      averageValue: 0,
      mostValuableWatch: null,
      brandDistribution: {},
      valueByBrand: {},
      totalAppreciation: 0,
      totalDepreciation: 0,
    };
  }

  const totalValue = watches.reduce((sum, w) => sum + w.currentMarketValue, 0);
  const averageValue = totalValue / watches.length;

  let mostValuableWatch = watches[0];
  for (const watch of watches) {
    if (watch.currentMarketValue > mostValuableWatch.currentMarketValue) {
      mostValuableWatch = watch;
    }
  }

  // Brand distribution
  const brandDistribution: Record<string, number> = {};
  const valueByBrand: Record<string, number> = {};

  for (const watch of watches) {
    brandDistribution[watch.brand] = (brandDistribution[watch.brand] || 0) + 1;
    valueByBrand[watch.brand] = (valueByBrand[watch.brand] || 0) + watch.currentMarketValue;
  }

  // Appreciation/Depreciation
  let totalAppreciation = 0;
  let totalDepreciation = 0;

  for (const watch of watches) {
    const diff = watch.currentMarketValue - watch.purchasePrice;
    if (diff > 0) {
      totalAppreciation += diff;
    } else {
      totalDepreciation += Math.abs(diff);
    }
  }

  return {
    totalWatches: watches.length,
    totalValue,
    averageValue,
    mostValuableWatch,
    brandDistribution,
    valueByBrand,
    totalAppreciation,
    totalDepreciation,
  };
}

/**
 * Get collection value by brand for chart
 */
export function getValueByBrandData(watches: Watch[]) {
  const stats = calculateStats(watches);
  return Object.entries(stats.valueByBrand)
    .map(([brand, value]) => ({
      name: brand,
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get brand distribution for chart
 */
export function getBrandDistributionData(watches: Watch[]) {
  const stats = calculateStats(watches);
  return Object.entries(stats.brandDistribution)
    .map(([brand, count]) => ({
      name: brand,
      value: count,
      percentage: ((count / watches.length) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get most valuable watches
 */
export function getMostValuableWatches(watches: Watch[], limit: number = 5) {
  return [...watches]
    .sort((a, b) => b.currentMarketValue - a.currentMarketValue)
    .slice(0, limit)
    .map((w) => ({
      name: `${w.brand} ${w.model}`,
      value: Math.round(w.currentMarketValue),
    }));
}

/**
 * Calculate appreciation/depreciation by watch
 */
export function getAppreciationData(watches: Watch[]) {
  return watches
    .map((w) => ({
      name: `${w.brand} ${w.model}`,
      appreciation: w.currentMarketValue - w.purchasePrice,
      purchasePrice: w.purchasePrice,
      currentValue: w.currentMarketValue,
      percentChange: ((((w.currentMarketValue - w.purchasePrice) / w.purchasePrice) * 100) || 0).toFixed(1),
    }))
    .sort((a, b) => b.appreciation - a.appreciation);
}

/**
 * Get collection value over time (from timeline)
 */
export function getCollectionValueTimeline(watches: Watch[], timeline: any[]) {
  const snapshots: CollectionSnapshot[] = [];
  const dateMap = new Map<string, { watches: Watch[]; value: number }>();

  // Build snapshots by processing timeline chronologically
  for (const entry of timeline) {
    const date = entry.date.split("T")[0]; // Get date part only

    if (!dateMap.has(date)) {
      dateMap.set(date, { watches: [], value: 0 });
    }

    const snapshot = dateMap.get(date)!;

    if (entry.action === "added" || entry.action === "updated") {
      const watch = watches.find((w) => w.id === entry.watchId);
      if (watch) {
        snapshot.watches.push(watch);
        snapshot.value += watch.currentMarketValue;
      }
    } else if (entry.action === "removed") {
      snapshot.value -= entry.value;
    }
  }

  // Convert to sorted array
  return Array.from(dateMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, data]) => ({
      date,
      value: Math.round(data.value),
      watches: data.watches.length,
    }));
}

/**
 * Get watches by movement type
 */
export function getWatchesByMovement(watches: Watch[]) {
  const movementMap: Record<string, number> = {};

  for (const watch of watches) {
    movementMap[watch.movementType] = (movementMap[watch.movementType] || 0) + 1;
  }

  return Object.entries(movementMap)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get watches by year acquired
 */
export function getWatchesByYear(watches: Watch[]) {
  const yearMap: Record<number, number> = {};

  for (const watch of watches) {
    yearMap[watch.year] = (yearMap[watch.year] || 0) + 1;
  }

  return Object.entries(yearMap)
    .map(([year, count]) => ({
      year: parseInt(year),
      count,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency: string = "INR"): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(original: number, current: number): number {
  if (original === 0) return 0;
  return ((current - original) / original) * 100;
}

/**
 * Get collection insights and recommendations
 */
export function getCollectionInsights(watches: Watch[]) {
  const stats = calculateStats(watches);
  const insights = [];

  if (stats.totalWatches === 0) {
    insights.push("Start your collection by adding your first watch.");
    return insights;
  }

  // Brand concentration
  const topBrand = Object.entries(stats.brandDistribution).sort((a, b) => b[1] - a[1])[0];
  if (topBrand && topBrand[1] > stats.totalWatches * 0.4) {
    insights.push(`Your collection is ${topBrand[1]} watches from ${topBrand[0]}. Consider diversifying.`);
  }

  // Appreciation
  if (stats.totalAppreciation > stats.totalValue * 0.1) {
    insights.push(`Excellent! Your collection has appreciated by ₹${Math.round(stats.totalAppreciation)}.`);
  }

  // Average value
  if (stats.averageValue > 10000) {
    insights.push("Your collection features premium timepieces with strong average value.");
  }

  // Movement diversity
  const movements = new Set(watches.map((w) => w.movementType));
  if (movements.size === 1) {
    insights.push(`Consider exploring different movement types beyond ${Array.from(movements)[0]}.`);
  }

  return insights;
}
