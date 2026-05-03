import type {
  AxisLabelMode,
  ChartBounds,
  ChartCoordinate,
  ChartLayoutMetrics,
  ChartSeriesStats,
  PricePoint,
  ValueType,
} from "./types.js";

export function getChartSeriesStats(points: PricePoint[]): ChartSeriesStats {
  if (points.length === 0) {
    throw new Error("Chart reel requires at least one point.");
  }

  const closes = points.map((point) => point.close);
  const firstClose = closes[0] ?? 0;
  const lastClose = closes.at(-1) ?? firstClose;
  const minClose = Math.min(...closes);
  const maxClose = Math.max(...closes);
  const absoluteChange = lastClose - firstClose;
  const percentChange = firstClose === 0 ? 0 : (absoluteChange / firstClose) * 100;

  return {
    firstClose,
    lastClose,
    minClose,
    maxClose,
    absoluteChange,
    percentChange,
  };
}

export function getChartLayoutMetrics(): ChartLayoutMetrics {
  const width = 940;
  const height = 760;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 48;
  const paddingBottom = 52;

  return {
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    drawWidth: width - paddingLeft - paddingRight,
    drawHeight: height - paddingTop - paddingBottom,
    panTravel: 260,
  };
}

export function getSeriesBounds(seriesGroups: PricePoint[][]): ChartBounds {
  const values = seriesGroups.flatMap((group) => group.map((point) => point.close));
  if (values.length === 0) {
    return { min: 0, max: 1 };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const paddedMin = rawMin >= 0 ? rawMin * 0.92 : rawMin * 1.08;
  const paddedMax = rawMax >= 0 ? rawMax * 1.04 : rawMax * 0.96;

  return {
    min: paddedMin,
    max: Math.max(paddedMax, paddedMin + 1),
  };
}

export function getChartCoordinates(
  points: PricePoint[],
  metrics = getChartLayoutMetrics(),
  bounds = getSeriesBounds([points]),
): ChartCoordinate[] {
  const range = Math.max(1, bounds.max - bounds.min);
  const step = points.length > 1 ? metrics.drawWidth / (points.length - 1) : metrics.drawWidth;

  return points.map((point, index) => {
    const x = metrics.paddingLeft + step * index;
    const normalizedY = (point.close - bounds.min) / range;
    const y = metrics.height - metrics.paddingBottom - normalizedY * metrics.drawHeight;

    return {
      date: point.date,
      label: point.label ?? formatShortDate(point.date),
      close: point.close,
      x,
      y,
    };
  });
}

export function buildLinePath(coordinates: ChartCoordinate[]): string {
  return coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${round(point.x)} ${round(point.y)}`)
    .join(" ");
}

export function buildAreaPath(coordinates: ChartCoordinate[], metrics = getChartLayoutMetrics()): string {
  const linePath = buildLinePath(coordinates);
  const first = coordinates[0];
  const last = coordinates.at(-1);
  const baseY = metrics.height - metrics.paddingBottom;

  if (!first || !last) {
    return "";
  }

  return `${linePath} L ${round(last.x)} ${round(baseY)} L ${round(first.x)} ${round(baseY)} Z`;
}

export function findHighlightCoordinate(
  points: PricePoint[],
  coordinates: ChartCoordinate[],
  targetDate: string,
): ChartCoordinate {
  const exactIndex = points.findIndex((point) => point.date === targetDate);
  const safeIndex = exactIndex >= 0 ? exactIndex : Math.max(0, Math.floor((coordinates.length - 1) * 0.7));
  return coordinates[safeIndex] ?? coordinates.at(-1) ?? {
    date: targetDate,
    label: targetDate,
    close: 0,
    x: 0,
    y: 0,
  };
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatValue(value: number, valueType: ValueType): string {
  if (valueType === "currency") {
    return formatMoney(value);
  }

  if (valueType === "percent") {
    return `${Math.round(value)}%`;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value < 100 ? 1 : 0,
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatShortDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(parsed);
}

export function formatAxisLabel(date: string, mode: AxisLabelMode): string {
  if (mode === "year") {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
      return String(parsed.getUTCFullYear());
    }
  }

  return formatShortDate(date);
}

export function round(value: number): string {
  return value.toFixed(2);
}
