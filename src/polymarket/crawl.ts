import { DEFAULT_API_URL, DEFAULT_SOURCE_URL } from "../config.js";
import { cleanText, formatUsdCompact, toAbsoluteUrl } from "../lib/strings.js";
import type { MarketRow, ScrapedCard } from "../types.js";

export type CrawlResult = {
  cards: ScrapedCard[];
  warnings: string[];
};

export type CrawlOptions = {
  apiUrl?: string;
  sourceUrl?: string;
  limit?: number;
  fetchImpl?: typeof fetch;
};

type ApiMarket = {
  question?: string;
  groupItemTitle?: string;
  outcomes?: string | string[];
  outcomePrices?: string | number[] | string[];
};

type ApiEvent = {
  title?: string;
  description?: string;
  slug?: string;
  category?: string;
  image?: string;
  icon?: string;
  volume?: number | string;
  volume24hr?: number | string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  markets?: ApiMarket[];
};

export async function crawlPolymarketApi(options: CrawlOptions = {}): Promise<CrawlResult> {
  const sourceUrl = options.sourceUrl ?? DEFAULT_SOURCE_URL;
  const fetchImpl = options.fetchImpl ?? fetch;
  const requestUrl = buildEventsUrl(options.apiUrl ?? DEFAULT_API_URL, options.limit);
  const response = await fetchImpl(requestUrl, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Polymarket API request failed with ${response.status}`);
  }

  const payload = await response.json();
  return crawlPolymarketFromApiPayload(payload, sourceUrl);
}

export async function crawlPolymarketFromApiPayload(
  payload: unknown,
  sourceUrl = DEFAULT_SOURCE_URL,
): Promise<CrawlResult> {
  const events = Array.isArray(payload) ? payload : [];
  const scrapedAt = new Date().toISOString();
  const warnings: string[] = [];
  const cards: ScrapedCard[] = [];

  events.forEach((event, index) => {
    const normalized = normalizeEvent(event as ApiEvent, index, scrapedAt, sourceUrl);
    if (!normalized) {
      warnings.push(`Skipped one API event at index ${index} because required fields were missing.`);
      return;
    }

    if (normalized.markets.length === 0) {
      warnings.push(`Skipped ${normalized.eventTitle} because no binary markets were available.`);
      return;
    }

    cards.push(normalized);
  });

  const sortedCards = [...cards]
    .sort((left, right) => (right.volumeNum ?? 0) - (left.volumeNum ?? 0))
    .map((card, index) => ({
      ...card,
      cardIndex: index,
    }));

  return { cards: sortedCards, warnings };
}

function normalizeEvent(
  event: ApiEvent,
  cardIndex: number,
  scrapedAt: string,
  sourceUrl: string,
): ScrapedCard | undefined {
  if (event.archived || event.closed || event.active === false) {
    return undefined;
  }

  const eventTitle = cleanText(event.title);
  const slug = cleanText(event.slug);
  if (!eventTitle || !slug) {
    return undefined;
  }

  const markets = (event.markets ?? [])
    .map((market) => normalizeMarket(market, eventTitle))
    .filter((market): market is MarketRow => Boolean(market));

  const volumeNum = pickEventVolume(event);

  return {
    sectionName: mapCategoryLabel(event.category) || inferCategoryLabel(eventTitle, event.description),
    cardIndex,
    eventTitle,
    ...(cleanText(event.description) ? { eventDescription: cleanText(event.description) } : {}),
    eventUrl: toAbsoluteUrl(`/event/${slug}`, sourceUrl),
    ...(event.image ? { thumbnailUrl: toAbsoluteUrl(event.image, sourceUrl) } : {}),
    ...(event.icon ? { iconUrl: toAbsoluteUrl(event.icon, sourceUrl) } : {}),
    ...(cleanText(event.category) ? { category: cleanText(event.category) } : {}),
    ...(volumeNum !== undefined && formatUsdCompact(volumeNum)
      ? { volumeText: formatUsdCompact(volumeNum) as string, volumeNum }
      : {}),
    markets,
    scrapedAt,
    sourcePage: buildEventsUrl(DEFAULT_API_URL),
  };
}

function normalizeMarket(market: ApiMarket, eventTitle: string): MarketRow | undefined {
  const outcomeLabels = parseOutcomeLabels(market.outcomes);
  const outcomePrices = parseOutcomePrices(market.outcomePrices);
  if (outcomeLabels.length < 2 || outcomePrices.length < 2) {
    return undefined;
  }

  const yesIndex = outcomeLabels.findIndex((label) => /^yes$/i.test(label));
  const noIndex = outcomeLabels.findIndex((label) => /^no$/i.test(label));
  if (yesIndex === -1 || noIndex === -1) {
    return undefined;
  }

  const yesProb = outcomePrices[yesIndex];
  const noProb = outcomePrices[noIndex];
  if (yesProb === undefined || noProb === undefined) {
    return undefined;
  }

  const label = createMarketLabel(market, eventTitle);

  return {
    label,
    yesProb: clampProbability(yesProb * 100),
    noProb: clampProbability(noProb * 100),
  };
}

function createMarketLabel(market: ApiMarket, eventTitle: string): string {
  const candidates = [
    cleanText(market.groupItemTitle),
    cleanText(market.question),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.toLowerCase() === eventTitle.toLowerCase()) {
      continue;
    }

    return candidate
      .replace(/^will\s+/i, "")
      .replace(/\?+$/g, "")
      .trim() || "대표 선택지";
  }

  return "대표 선택지";
}

function parseOutcomeLabels(input: ApiMarket["outcomes"]): string[] {
  if (Array.isArray(input)) {
    return input.map((item) => cleanText(String(item))).filter(Boolean);
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => cleanText(String(item))).filter(Boolean);
      }
    } catch {
      return input.split(",").map((item) => cleanText(item)).filter(Boolean);
    }
  }

  return [];
}

function parseOutcomePrices(input: ApiMarket["outcomePrices"]): number[] {
  if (Array.isArray(input)) {
    return input
      .map((item) => Number.parseFloat(String(item)))
      .filter((item) => Number.isFinite(item));
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => Number.parseFloat(String(item)))
          .filter((item) => Number.isFinite(item));
      }
    } catch {
      return input
        .split(",")
        .map((item) => Number.parseFloat(item))
        .filter((item) => Number.isFinite(item));
    }
  }

  return [];
}

function pickEventVolume(event: ApiEvent): number | undefined {
  const candidates = [event.volume, event.volume24hr];
  let best: number | undefined;

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      best = best === undefined ? candidate : Math.max(best, candidate);
      continue;
    }

    if (typeof candidate === "string") {
      const parsed = Number.parseFloat(candidate);
      if (Number.isFinite(parsed)) {
        best = best === undefined ? parsed : Math.max(best, parsed);
      }
    }
  }

  return best;
}

function buildEventsUrl(apiUrl: string, limit = 100): string {
  const url = new URL(apiUrl);
  if (!url.searchParams.has("limit")) {
    url.searchParams.set("limit", String(limit));
  }
  if (!url.searchParams.has("active")) {
    url.searchParams.set("active", "true");
  }
  if (!url.searchParams.has("closed")) {
    url.searchParams.set("closed", "false");
  }
  if (!url.searchParams.has("archived")) {
    url.searchParams.set("archived", "false");
  }

  return url.toString();
}

function mapCategoryLabel(category: string | undefined): string {
  const normalized = cleanText(category).toLowerCase();

  switch (normalized) {
    case "politics":
      return "정치";
    case "crypto":
      return "가상자산";
    case "sports":
      return "스포츠";
    case "business":
    case "economy":
      return "경제";
    case "pop-culture":
    case "entertainment":
      return "엔터";
    default:
      return normalized ? cleanText(category) : "";
  }
}

function inferCategoryLabel(eventTitle: string, eventDescription: string | undefined): string {
  const haystack = `${cleanText(eventTitle)} ${cleanText(eventDescription)}`.toLowerCase();

  if (/(president|presidential|election|senate|congress|republican|democrat|macron|biden|trump|white house|government|prime minister|fed|fomc)/i.test(haystack)) {
    return "정치";
  }

  if (/(bitcoin|crypto|solana|ethereum|kraken|coin|token|ipo)/i.test(haystack)) {
    return "가상자산";
  }

  if (/(world cup|premier league|fifa|nba|nfl|mlb|champions league|golf|tennis|soccer|football|baseball|olympics)/i.test(haystack)) {
    return "스포츠";
  }

  if (/(oil|crude|rates|inflation|economy|tariff|gdp|recession|stocks|market)/i.test(haystack)) {
    return "경제";
  }

  return "이슈";
}

function clampProbability(input: number): number {
  return Math.max(0, Math.min(100, Math.round(input)));
}
