import {
  buildAreaPath,
  buildLinePath,
  formatAxisLabel,
  formatPercent,
  formatValue,
  getChartCoordinates,
  getChartLayoutMetrics,
  getChartSeriesStats,
  getSeriesBounds,
  round,
} from "./math.js";
import type { ChartReelInput } from "./types.js";

export function renderChartSvgAsset(input: ChartReelInput): string {
  const metrics = getChartLayoutMetrics();
  const primaryPoints = input.points;
  const comparisonPoints = input.comparisonPoints ?? [];
  const hasComparison = comparisonPoints.length >= 2;
  const bounds = getSeriesBounds([primaryPoints, comparisonPoints]);
  const primaryCoordinates = getChartCoordinates(primaryPoints, metrics, bounds);
  const comparisonCoordinates = hasComparison ? getChartCoordinates(comparisonPoints, metrics, bounds) : [];
  const primaryStats = getChartSeriesStats(primaryPoints);
  const comparisonStats = hasComparison ? getChartSeriesStats(comparisonPoints) : null;
  const primaryColor = input.primaryColor ?? input.accentColor ?? "#74f7b3";
  const comparisonColor = input.comparisonColor ?? "#5ba7ff";
  const primaryLabel = input.primaryLabel ?? input.assetName;
  const comparisonLabel = input.comparisonLabel ?? input.comparisonAssetName ?? input.comparisonTicker ?? "Benchmark";
  const primaryDisplayName = input.localizedAssetName ?? primaryLabel;
  const comparisonDisplayName = input.localizedComparisonName ?? comparisonLabel;
  const valueType = input.valueType ?? (hasComparison ? "index" : "currency");
  const axisLabelMode = input.axisLabelMode ?? "short-date";
  const primaryPath = buildLinePath(primaryCoordinates);
  const primaryAreaPath = buildAreaPath(primaryCoordinates, metrics);
  const comparisonPath = hasComparison ? buildLinePath(comparisonCoordinates) : "";
  const yGrid = [0.18, 0.38, 0.58, 0.78]
    .map((ratio) => {
      const y = metrics.paddingTop + metrics.drawHeight * ratio;
      return `<line x1="${metrics.paddingLeft}" y1="${round(y)}" x2="${metrics.width - metrics.paddingRight}" y2="${round(y)}" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="8 8" />`;
    })
    .join("");
  const xLabels = [primaryCoordinates[0], primaryCoordinates[Math.floor(primaryCoordinates.length / 2)], primaryCoordinates.at(-1)]
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .map(
      (point) =>
        `<text x="${round(point.x)}" y="${metrics.height - 14}" fill="rgba(255,255,255,0.55)" text-anchor="middle" font-size="18" font-family="Inter, Arial, sans-serif">${point.label}</text>`,
    )
    .join("");
  const adjustedXLabels = [primaryCoordinates[0], primaryCoordinates[Math.floor(primaryCoordinates.length / 2)], primaryCoordinates.at(-1)]
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .map(
      (point) =>
        `<text x="${round(point.x)}" y="${metrics.height - 14}" fill="rgba(255,255,255,0.55)" text-anchor="middle" font-size="18" font-family="Inter, Arial, sans-serif">${formatAxisLabel(point.date, axisLabelMode)}</text>`,
    )
    .join("");
  const yLabels = [bounds.max, (bounds.max + bounds.min) / 2, bounds.min]
    .map((value, index) => {
      const ratio = index / 2;
      const y = metrics.paddingTop + metrics.drawHeight * ratio;
      return `<text x="18" y="${round(y + 6)}" fill="rgba(255,255,255,0.55)" font-size="18" font-family="Inter, Arial, sans-serif">${escapeXml(
        formatValue(value, valueType),
      )}</text>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${metrics.width}" height="${metrics.height}" viewBox="0 0 ${metrics.width} ${metrics.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${metrics.width}" y2="${metrics.height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0B101A"/>
      <stop offset="1" stop-color="#161E2B"/>
    </linearGradient>
    <linearGradient id="area" x1="0" y1="${metrics.paddingTop}" x2="0" y2="${metrics.height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${primaryColor}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${primaryColor}" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${metrics.width}" height="${metrics.height}" rx="40" fill="url(#bg)"/>
  <text x="40" y="64" fill="white" font-size="24" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(
    `${primaryDisplayName}${hasComparison ? ` vs ${comparisonDisplayName}` : ""} • ${input.periodLabel}`,
  )}</text>
  <text x="40" y="118" fill="${primaryColor}" font-size="40" font-family="Inter, Arial, sans-serif" font-weight="800">${escapeXml(
    `${primaryDisplayName} ${formatPercent(primaryStats.percentChange)}`,
  )}</text>
  ${comparisonStats ? `<text x="40" y="156" fill="${comparisonColor}" font-size="30" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(
    `${comparisonDisplayName} ${formatPercent(comparisonStats.percentChange)}`,
  )}</text>` : `<text x="40" y="156" fill="${primaryStats.percentChange >= 0 ? primaryColor : "#FF7C8B"}" font-size="28" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(
    `${formatPercent(primaryStats.percentChange)} vs start`,
  )}</text>`}
  ${yGrid}
  ${yLabels}
  ${hasComparison ? `<path d="${comparisonPath}" stroke="${comparisonColor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />` : ""}
  <path d="${primaryAreaPath}" fill="url(#area)"/>
  <path d="${primaryPath}" stroke="${primaryColor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  ${renderLastDot(primaryCoordinates.at(-1), primaryColor)}
  ${hasComparison ? renderLastDot(comparisonCoordinates.at(-1), comparisonColor) : ""}
  ${adjustedXLabels}
  <rect x="540" y="46" width="18" height="18" rx="9" fill="${primaryColor}" />
  <text x="568" y="60" fill="white" font-size="20" font-family="Inter, Arial, sans-serif">${escapeXml(primaryLabel)}</text>
  ${hasComparison ? `<rect x="540" y="82" width="18" height="18" rx="9" fill="${comparisonColor}" /><text x="568" y="96" fill="white" font-size="20" font-family="Inter, Arial, sans-serif">${escapeXml(comparisonLabel)}</text>` : ""}
</svg>`;
}

function renderLastDot(point: { x: number; y: number } | undefined, color: string): string {
  if (!point) {
    return "";
  }

  return `<circle cx="${round(point.x)}" cy="${round(point.y)}" r="9" fill="${color}" stroke="white" stroke-width="3"/>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
