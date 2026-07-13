/**
 * Shared Recharts styling so every chart reads as one system on the dial.
 */

export const CHART_COLORS = ["#c9a24b", "#8aa0bf", "#7cc6a5", "#d8b662", "#5b6b82"];

export const AXIS_STROKE = "#5b6b82";
export const GRID_STROKE = "#22314a";

export const axisProps = {
  stroke: AXIS_STROKE,
  tick: { fill: "#8a97ab", fontSize: 11, fontFamily: "IBM Plex Mono, monospace" },
  tickLine: { stroke: GRID_STROKE },
  axisLine: { stroke: GRID_STROKE },
} as const;

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#131d2c",
    border: "1px solid #22314a",
    borderRadius: "8px",
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: "12px",
    color: "#ece7d6",
  },
  labelStyle: { color: "#ece7d6" },
  itemStyle: { color: "#ece7d6" },
  cursor: { fill: "rgba(201,162,75,0.06)" },
} as const;
