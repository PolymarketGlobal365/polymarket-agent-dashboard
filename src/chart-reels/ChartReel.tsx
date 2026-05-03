import React from "react";
import { loadFont } from "@remotion/google-fonts/NotoSansKR";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import {
  buildAreaPath,
  buildLinePath,
  formatAxisLabel,
  formatValue,
  getChartCoordinates,
  getChartLayoutMetrics,
  getChartSeriesStats,
  getSeriesBounds,
} from "./math.js";
import type { ChartReelInput } from "./types.js";

const { fontFamily: koreanFontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  ignoreTooManyRequestsWarning: true,
});

export function ChartReel(props: ChartReelInput) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const metrics = getChartLayoutMetrics();
  const primaryPoints = props.points;
  const comparisonPoints = props.comparisonPoints ?? [];
  const hasComparison = comparisonPoints.length >= 2;
  const primaryColor = props.primaryColor ?? props.accentColor ?? "#74f7b3";
  const comparisonColor = props.comparisonColor ?? "#5ba7ff";
  const primaryLabel = props.primaryLabel ?? props.assetName;
  const comparisonLabel = props.comparisonLabel ?? props.comparisonAssetName ?? props.comparisonTicker ?? "Benchmark";
  const primaryDisplayName = props.localizedAssetName ?? primaryLabel;
  const comparisonDisplayName = props.localizedComparisonName ?? comparisonLabel;
  const valueType = props.valueType ?? (hasComparison ? "percent" : "currency");
  const axisLabelMode = props.axisLabelMode ?? "year";
  const rawBounds = getSeriesBounds([primaryPoints, comparisonPoints]);
  const bounds = valueType === "percent" ? { min: 0, max: Math.max(rawBounds.max, 1) } : rawBounds;
  const primaryStats = getChartSeriesStats(primaryPoints);
  const comparisonStats = hasComparison ? getChartSeriesStats(comparisonPoints) : null;
  const primaryCoordinates = getChartCoordinates(primaryPoints, metrics, bounds);
  const comparisonCoordinates = hasComparison ? getChartCoordinates(comparisonPoints, metrics, bounds) : [];
  const primaryPath = buildLinePath(primaryCoordinates);
  const primaryAreaPath = buildAreaPath(primaryCoordinates, metrics);
  const comparisonPath = hasComparison ? buildLinePath(comparisonCoordinates) : "";

  const chartTravel = interpolate(frame, [0, fps * 7.2], [0, metrics.panTravel], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });
  const revealProgress = interpolate(frame, [fps * 0.4, fps * 7.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });
  const revealWidth = metrics.width * revealProgress;
  const introLift = spring({
    fps,
    frame,
    config: {
      damping: 18,
      stiffness: 90,
      mass: 0.9,
    },
  });
  const heroOpacity = interpolate(frame, [0, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroTitle = hasComparison
    ? `${primaryDisplayName}와 ${comparisonDisplayName}의\n${props.periodLabel}`
    : props.title;
  const subtitle = props.subtitle?.trim() ? props.subtitle : "";
  const metaLine = props.metaLine ?? "follow @stockmanclub";

  return (
    <AbsoluteFill style={styles.canvas}>
      <BackgroundGlow {...(hasComparison ? { accent: primaryColor, secondary: comparisonColor } : { accent: primaryColor })} />
      <AbsoluteFill style={{ padding: 64 }}>
        <div style={{ ...styles.hero, opacity: heroOpacity, transform: `translateY(${24 - introLift * 24}px)` }}>
          <div style={styles.kickerRow}>
            <span style={{ ...styles.kickerChip, borderColor: `${primaryColor}55` }}>{props.ticker}</span>
            <span style={styles.kickerMeta}>
              {props.assetName}
              {props.exchange ? ` - ${props.exchange}` : ""}
            </span>
            {props.comparisonTicker ? (
              <span style={{ ...styles.kickerChipSecondary, borderColor: `${comparisonColor}55`, color: comparisonColor }}>
                {props.comparisonTicker}
              </span>
            ) : null}
          </div>
          <h1 style={styles.heroTitle}>{heroTitle}</h1>
          {subtitle ? <p style={styles.heroSubtitle}>{subtitle}</p> : null}
        </div>

        <div style={styles.mainCard}>
          <div style={styles.topStrip}>
            <div>
              <div style={styles.periodLabel}>{props.periodLabel}</div>
              <div style={styles.compareHeadline}>
                {hasComparison ? `${primaryDisplayName}와 ${comparisonDisplayName}` : formatValue(primaryStats.lastClose, valueType)}
              </div>
              <div style={styles.compareMeta}>{metaLine}</div>
            </div>
            {hasComparison ? (
              <div style={styles.compareStatsRow}>
                <StatCard label={primaryDisplayName} value={formatValue(primaryStats.lastClose, valueType)} color={primaryColor} />
                <StatCard label={comparisonDisplayName} value={formatValue(comparisonStats?.lastClose ?? 0, valueType)} color={comparisonColor} />
              </div>
            ) : (
              <div style={styles.compareStatsRow}>
                <StatCard label={primaryDisplayName} value={formatValue(primaryStats.lastClose, valueType)} color={primaryColor} />
              </div>
            )}
          </div>

          <div style={styles.legendRow}>
            <LegendDot color={primaryColor} label={primaryLabel} />
            {hasComparison ? <LegendDot color={comparisonColor} label={comparisonLabel} /> : null}
          </div>

          <div style={styles.chartShell}>
            <div style={styles.yAxisColumn}>
              {[bounds.max, (bounds.max + bounds.min) / 2, bounds.min].map((value) => (
                <div key={value} style={styles.axisTickLabel}>
                  {formatValue(value, valueType)}
                </div>
              ))}
            </div>
            <div style={styles.chartViewport}>
              <svg viewBox={`0 0 ${metrics.width} ${metrics.height}`} width="100%" height="100%">
                <defs>
                  <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
                  </linearGradient>
                  <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="9" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <clipPath id="revealClip">
                    <rect x="0" y="0" width={revealWidth} height={metrics.height} />
                  </clipPath>
                </defs>

                {[0.16, 0.38, 0.62, 0.84].map((ratio) => {
                  const y = metrics.paddingTop + metrics.drawHeight * ratio;
                  return (
                    <line
                      key={ratio}
                      x1={metrics.paddingLeft}
                      y1={y}
                      x2={metrics.width - metrics.paddingRight}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="10 10"
                    />
                  );
                })}

                <g transform={`translate(${-chartTravel}, 0)`}>
                  {hasComparison ? (
                    <g clipPath="url(#revealClip)">
                      <path
                        d={comparisonPath}
                        fill="none"
                        stroke={comparisonColor}
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.95"
                      />
                    </g>
                  ) : null}

                  <path d={primaryAreaPath} fill="url(#chartAreaGradient)" />
                  <g clipPath="url(#revealClip)">
                    <path
                      d={primaryPath}
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#chartGlow)"
                    />
                  </g>

                  {renderVisibleDots(primaryCoordinates, revealProgress, primaryColor)}
                  {hasComparison ? renderVisibleDots(comparisonCoordinates, revealProgress, comparisonColor, true) : null}
                </g>
              </svg>
              <div style={styles.chartWatermark}>@STOCKMANCLUB</div>
            </div>
          </div>

          <div style={styles.xAxisRow}>
            {[
              primaryCoordinates[0]?.date ? formatAxisLabel(primaryCoordinates[0].date, axisLabelMode) : undefined,
              primaryCoordinates[Math.floor(primaryCoordinates.length / 2)]?.date
                ? formatAxisLabel(primaryCoordinates[Math.floor(primaryCoordinates.length / 2)]!.date, axisLabelMode)
                : undefined,
              primaryCoordinates.at(-1)?.date ? formatAxisLabel(primaryCoordinates.at(-1)!.date, axisLabelMode) : undefined,
            ].map((label, index) => (
              <div key={`${label}-${index}`} style={styles.axisBottomLabel}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={styles.legendItem}>
      <div style={{ ...styles.legendDot, backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

function renderVisibleDots(
  coordinates: ReturnType<typeof getChartCoordinates>,
  revealProgress: number,
  color: string,
  subtle = false,
) {
  return coordinates.map((point, index) => {
    const pointProgress = index / Math.max(1, coordinates.length - 1);
    const visible = revealProgress >= pointProgress;
    if (!visible || index < coordinates.length - 3) {
      return null;
    }

    return (
      <circle
        key={`${point.date}-${index}-${color}`}
        cx={point.x}
        cy={point.y}
        r={index === coordinates.length - 1 ? (subtle ? 8 : 10) : 6}
        fill={color}
        stroke="white"
        strokeWidth={subtle ? 2 : 3}
      />
    );
  });
}

function BackgroundGlow({ accent, secondary }: { accent: string; secondary?: string }) {
  return (
    <>
      <div style={styles.backgroundBase} />
      <div style={{ ...styles.backgroundGlow, background: `radial-gradient(circle at 18% 18%, ${accent}44, transparent 30%)` }} />
      {secondary ? (
        <div style={{ ...styles.backgroundGlowSecondary, background: `radial-gradient(circle at 82% 18%, ${secondary}33, transparent 26%)` }} />
      ) : null}
      <div style={styles.backgroundGrid} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  canvas: {
    backgroundColor: "#060A12",
    color: "#F8FAFC",
    fontFamily: `${koreanFontFamily}, "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", Arial, sans-serif`,
    overflow: "hidden",
  },
  backgroundBase: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #07101A 0%, #0D1522 48%, #05080F 100%)",
  },
  backgroundGlow: {
    position: "absolute",
    inset: 0,
    opacity: 0.9,
  },
  backgroundGlowSecondary: {
    position: "absolute",
    inset: 0,
    opacity: 0.75,
  },
  backgroundGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "72px 72px",
    maskImage: "linear-gradient(180deg, rgba(0,0,0,0.75), transparent 92%)",
  },
  hero: {
    position: "absolute",
    top: 310,
    left: 64,
    right: 64,
    zIndex: 3,
  },
  kickerRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  kickerChip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    padding: "8px 16px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 24,
  },
  kickerChipSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    padding: "8px 16px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 24,
  },
  kickerMeta: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 24,
    fontWeight: 600,
  },
  heroTitle: {
    margin: "90px 0 0",
    fontSize: 72,
    lineHeight: 1.02,
    letterSpacing: "-0.05em",
    maxWidth: 900,
    whiteSpace: "pre-line",
  },
  heroSubtitle: {
    margin: "18px 0 0",
    maxWidth: 900,
    fontSize: 28,
    lineHeight: 1.35,
    color: "rgba(255,255,255,0.78)",
  },
  mainCard: {
    position: "absolute",
    left: 64,
    right: 64,
    top: 700,
    bottom: 210,
    borderRadius: 40,
    background: "linear-gradient(180deg, rgba(16,22,35,0.96), rgba(11,16,25,0.96))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 28px 60px rgba(0,0,0,0.36)",
    padding: 36,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  topStrip: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "flex-end",
  },
  periodLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 24,
    fontWeight: 700,
  },
  compareHeadline: {
    marginTop: 8,
    fontSize: 48,
    fontWeight: 850,
    letterSpacing: "-0.05em",
  },
  compareMeta: {
    marginTop: 8,
    color: "rgba(255,255,255,0.62)",
    fontSize: 22,
    fontWeight: 600,
  },
  compareStatsRow: {
    display: "flex",
    gap: 14,
    alignItems: "stretch",
  },
  statCard: {
    minWidth: 200,
    borderRadius: 24,
    padding: "18px 20px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  statLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 18,
    fontWeight: 700,
  },
  statValue: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: 850,
    letterSpacing: "-0.04em",
  },
  legendRow: {
    display: "flex",
    gap: 18,
    alignItems: "center",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.76)",
    fontSize: 18,
    fontWeight: 700,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  chartShell: {
    flex: 1,
    borderRadius: 28,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: 22,
    display: "grid",
    gridTemplateColumns: "110px 1fr",
    gap: 12,
    alignItems: "stretch",
  },
  yAxisColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 38,
    paddingBottom: 44,
  },
  axisTickLabel: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 20,
    fontWeight: 700,
  },
  chartViewport: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
  },
  chartWatermark: {
    position: "absolute",
    left: "50%",
    bottom: 34,
    transform: "translateX(-50%)",
    color: "rgba(255,255,255,0.28)",
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "0.06em",
    pointerEvents: "none",
  },
  xAxisRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  axisBottomLabel: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 20,
    fontWeight: 700,
  },
  footerBar: {
    position: "absolute",
    left: 64,
    right: 64,
    bottom: 72,
    borderRadius: 28,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "26px 28px",
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: 24,
    alignItems: "start",
  },
  footerTitle: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  footerMeta: {
    marginTop: 8,
    fontSize: 20,
    color: "rgba(255,255,255,0.58)",
  },
  footerBullets: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  footerBulletItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    color: "rgba(255,255,255,0.78)",
  },
  footerBulletDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  outroShell: {
    backgroundColor: "#000000",
  },
  outroVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};
