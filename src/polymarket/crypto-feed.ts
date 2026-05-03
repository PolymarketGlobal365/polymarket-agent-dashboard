import { DEFAULT_API_URL, DEFAULT_CRYPTO_SOURCE_URL, DEFAULT_SOURCE_URL } from "../config.js";
import { crawlPolymarketApi } from "./crawl.js";
import { crawlCryptoPageEvents } from "./crypto-page.js";
import { fetchEventPageMeta } from "./event-meta.js";
import type { CryptoPageEvent } from "./crypto-page.js";
import type { ScrapedCard } from "../types.js";

export type CryptoFeedEvent = CryptoPageEvent & {
  eventDescription?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  category?: string;
  volumeText?: string;
  volumeNum?: number;
  markets: ScrapedCard["markets"];
};

export type BuildCryptoFeedOptions = {
  sourceUrl?: string;
  apiUrl?: string;
  maxEvents?: number;
  maxShowMoreClicks?: number;
};

export type BuildCryptoFeedResult = {
  events: CryptoFeedEvent[];
  warnings: string[];
};

export async function buildCryptoFeed(
  options: BuildCryptoFeedOptions = {},
): Promise<BuildCryptoFeedResult> {
  const sourceUrl = options.sourceUrl ?? DEFAULT_CRYPTO_SOURCE_URL;
  const apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  const apiResult = await crawlPolymarketApi({
    apiUrl,
    sourceUrl: DEFAULT_SOURCE_URL,
    limit: 600,
  });

  if (sourceUrl === DEFAULT_SOURCE_URL) {
    const homepageEvents = toFeedEventsFromApiCards(apiResult.cards, sourceUrl);
    return {
      events: options.maxEvents ? homepageEvents.slice(0, options.maxEvents) : homepageEvents,
      warnings: [],
    };
  }

  const pageResult = await crawlCryptoPageEvents({
    sourceUrl,
    ...(options.maxEvents !== undefined ? { maxEvents: options.maxEvents } : {}),
    ...(options.maxShowMoreClicks !== undefined ? { maxShowMoreClicks: options.maxShowMoreClicks } : {}),
  });

  const detailsByUrl = new Map(apiResult.cards.map((card) => [card.eventUrl, card]));
  const warnings = [...pageResult.warnings];

  const events = pageResult.events.map((pageEvent) => {
    const detail = detailsByUrl.get(pageEvent.eventUrl);
    if (!detail) {
      warnings.push(`No API details found for ${pageEvent.eventTitle}.`);
    }

    return {
      ...pageEvent,
      ...(detail?.eventDescription ? { eventDescription: detail.eventDescription } : {}),
      ...(detail?.thumbnailUrl
        ? { thumbnailUrl: detail.thumbnailUrl }
        : pageEvent.thumbnailUrl
          ? { thumbnailUrl: pageEvent.thumbnailUrl }
          : {}),
      ...(detail?.iconUrl ? { iconUrl: detail.iconUrl } : {}),
      ...(detail?.category ? { category: detail.category } : {}),
      ...(detail?.volumeText ? { volumeText: detail.volumeText } : {}),
      ...(detail?.volumeNum !== undefined ? { volumeNum: detail.volumeNum } : {}),
      markets: detail?.markets ?? [],
    };
  });

  for (const event of events) {
    if (event.thumbnailUrl && event.eventDescription) {
      continue;
    }

    try {
      const meta = await fetchEventPageMeta(event.eventUrl);
      if (!event.thumbnailUrl && meta.imageUrl) {
        event.thumbnailUrl = meta.imageUrl;
      }
      if (!event.eventDescription && meta.description) {
        event.eventDescription = meta.description;
      }
    } catch {
      warnings.push(`No event-page metadata found for ${event.eventTitle}.`);
    }
  }

  return {
    events,
    warnings,
  };
}

export function toFeedEventsFromApiCards(cards: ScrapedCard[], sourcePage = DEFAULT_SOURCE_URL): CryptoFeedEvent[] {
  return cards.map((card) => ({
    eventTitle: card.eventTitle,
    eventUrl: card.eventUrl,
    ...(card.thumbnailUrl ? { thumbnailUrl: card.thumbnailUrl } : {}),
    sourcePage,
    scrapedAt: card.scrapedAt,
    ...(card.eventDescription ? { eventDescription: card.eventDescription } : {}),
    ...(card.iconUrl ? { iconUrl: card.iconUrl } : {}),
    ...(card.category ? { category: card.category } : card.sectionName ? { category: card.sectionName } : {}),
    ...(card.volumeText ? { volumeText: card.volumeText } : {}),
    ...(card.volumeNum !== undefined ? { volumeNum: card.volumeNum } : {}),
    markets: card.markets,
  }));
}
