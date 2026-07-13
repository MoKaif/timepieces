/**
 * Currency + number formatting for the collection.
 * Values are in INR; large sums read naturally in lakh/crore.
 */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Full precision, grouped Indian-style: 1240000 → "₹12,40,000". */
export function formatINR(value: number): string {
  return inr.format(Math.round(value || 0));
}

/**
 * Compact lakh/crore form for headline figures.
 *   250000   → "₹2.5 L"
 *   12500000 → "₹1.25 Cr"
 *   4200     → "₹4,200"
 */
export function formatCompactINR(value: number): string {
  const v = value || 0;
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${trim(abs / 1_00_00_000)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${trim(abs / 1_00_000)} L`;
  return formatINR(v);
}

/** Same as compact but always signed (for gains/losses). */
export function formatSignedCompactINR(value: number): string {
  const s = formatCompactINR(value);
  return value > 0 ? `+${s}` : s;
}

function trim(n: number): string {
  // up to 2 decimals, no trailing zeros: 2.50 → "2.5", 3.00 → "3"
  return n.toFixed(2).replace(/\.?0+$/, "");
}

/** "18.4%" with sign; guards divide-by-zero. */
export function formatPercentChange(from: number, to: number): string | null {
  if (!from) return null; // no meaningful percentage without a purchase price
  const pct = ((to - from) / from) * 100;
  const rounded = pct.toFixed(1);
  return `${pct > 0 ? "+" : ""}${rounded}%`;
}
