export type ReelTone = "bullish" | "bearish" | "neutral";
export type ValueType = "currency" | "index" | "percent";
export type HighlightSeries = "primary" | "comparison";
export type AxisLabelMode = "year" | "short-date";

export interface PricePoint {
  date: string;
  close: number;
  label?: string;
  volume?: number;
}

export interface ChartHighlight {
  at: string;
  title: string;
  body?: string;
  tone?: ReelTone;
  series?: HighlightSeries;
}

export interface ChartReelInput extends Record<string, unknown> {
  ticker: string;
  assetName: string;
  title: string;
  subtitle: string;
  periodLabel: string;
  exchange?: string;
  comparisonTicker?: string;
  comparisonAssetName?: string;
  sourceLine?: string;
  cta?: string;
  accentColor?: string;
  primaryLabel?: string;
  primaryColor?: string;
  comparisonLabel?: string;
  comparisonColor?: string;
  localizedAssetName?: string;
  localizedComparisonName?: string;
  valueType?: ValueType;
  axisLabelMode?: AxisLabelMode;
  metaLine?: string;
  showFloatingHighlight?: boolean;
  showFooter?: boolean;
  showCallouts?: boolean;
  points: PricePoint[];
  comparisonPoints?: PricePoint[];
  highlights?: ChartHighlight[];
  summaryBullets?: string[];
}

export interface ChartSeriesStats {
  firstClose: number;
  lastClose: number;
  minClose: number;
  maxClose: number;
  absoluteChange: number;
  percentChange: number;
}

export interface ChartCoordinate {
  date: string;
  label: string;
  close: number;
  x: number;
  y: number;
}

export interface ChartBounds {
  min: number;
  max: number;
}

export interface ChartLayoutMetrics {
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  drawWidth: number;
  drawHeight: number;
  panTravel: number;
}
