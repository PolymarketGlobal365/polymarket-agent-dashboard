export type MarketRow = {
  label: string;
  yesProb: number;
  noProb: number;
};

export type ScrapedCard = {
  sectionName: string;
  cardIndex: number;
  eventTitle: string;
  eventDescription?: string;
  eventUrl: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  category?: string;
  volumeText?: string;
  volumeNum?: number;
  markets: MarketRow[];
  scrapedAt: string;
  sourcePage: string;
};

export type NormalizedEvent = {
  eventId: string;
  sectionName: string;
  cardIndex: number;
  eventTitle: string;
  eventDescription?: string;
  eventUrl: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  category?: string;
  volumeText?: string;
  volumeNum?: number;
  markets: MarketRow[];
  scrapedAt: string;
};

export type SlideLayout = "hook" | "breakdown" | "insight" | "context" | "source";

export type SlideMarketSnapshot = {
  title: string;
  volumeText?: string;
  probabilityText?: string;
  deltaText?: string;
  rows?: { label: string; yesProb: number; noProb: number }[];
};

export type SlideSpec = {
  eventId: string;
  slideNo: 1 | 2 | 3 | 4 | 5;
  layout: SlideLayout;
  brandLine?: string;
  categoryLabel?: string;
  headline: string;
  subheadline?: string;
  body?: string[];
  badgeLabel?: string;
  badgeTone?: "green" | "red" | "purple" | "white" | "blue";
  highlightLabel?: string;
  highlightTone?: "green" | "red" | "purple" | "white" | "blue";
  marketSnapshot?: SlideMarketSnapshot;
  ctaItems?: string[];
  sourceLabel?: string;
  sourceUrl?: string;
  scrapedAt?: string;
  imageUrl?: string;
  illustrationImageUrl?: string;
  progressValue?: number;
  progressDirection?: "left" | "right";
  chartPoints?: number[];
  chartLabel?: string;
  chartDeltaText?: string;
  secondaryHeadline?: string;
  secondaryBody?: string[];
  secondaryHighlightTone?: "green" | "red" | "purple" | "white" | "blue";
  secondaryMarketSnapshot?: SlideMarketSnapshot;
  secondaryProgressValue?: number;
  secondaryProgressDirection?: "left" | "right";
};

export type RankedEvent = NormalizedEvent & {
  selectionScore: number;
  scoreBreakdown: {
    sectionWeight: number;
    volumeScore: number;
    diversityBoost: number;
    probabilitySignal: number;
    freshnessScore: number;
  };
};

export type QaResult = {
  eventId: string;
  slideNo: 1 | 2 | 3 | 4 | 5;
  ok: boolean;
  warnings: string[];
};

export type EventArtifacts = {
  event: RankedEvent;
  slides: SlideSpec[];
  qa: QaResult[];
  imagePaths: string[];
};

export type RunManifest = {
  runId: string;
  generatedAt: string;
  source: string;
  selectedEvents: RankedEvent[];
  warnings: string[];
  outputDir: string;
  usedFallbackSnapshot: boolean;
};
