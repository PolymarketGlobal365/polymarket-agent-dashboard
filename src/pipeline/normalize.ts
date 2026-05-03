import { parseVolumeToMillions, slugify } from "../lib/strings.js";
import type { MarketRow, NormalizedEvent, ScrapedCard } from "../types.js";

export function normalizeCards(cards: ScrapedCard[]): {
  events: NormalizedEvent[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const byEvent = new Map<string, NormalizedEvent>();

  for (const card of cards) {
    const eventId = deriveEventId(card.eventUrl, card.eventTitle);
    const existing = byEvent.get(eventId);

    if (!existing) {
      byEvent.set(eventId, {
        eventId,
        sectionName: card.sectionName,
        cardIndex: card.cardIndex,
        eventTitle: card.eventTitle,
        ...(card.eventDescription ? { eventDescription: card.eventDescription } : {}),
        eventUrl: card.eventUrl,
        markets: dedupeMarkets(card.markets),
        scrapedAt: card.scrapedAt,
        ...(card.thumbnailUrl ? { thumbnailUrl: card.thumbnailUrl } : {}),
        ...(card.iconUrl ? { iconUrl: card.iconUrl } : {}),
        ...(card.category ? { category: card.category } : {}),
        ...(card.volumeText ? { volumeText: card.volumeText } : {}),
        ...(card.volumeNum !== undefined ? { volumeNum: card.volumeNum } : {}),
      });
      continue;
    }

    const existingVolume = parseVolumeToMillions(existing.volumeText);
    const nextVolume = parseVolumeToMillions(card.volumeText);
    existing.cardIndex = Math.min(existing.cardIndex, card.cardIndex);
    existing.markets = dedupeMarkets([...existing.markets, ...card.markets]);

    if (!existing.thumbnailUrl && card.thumbnailUrl) {
      existing.thumbnailUrl = card.thumbnailUrl;
    }
    if (!existing.iconUrl && card.iconUrl) {
      existing.iconUrl = card.iconUrl;
    }
    if (!existing.category && card.category) {
      existing.category = card.category;
    }
    if (!existing.eventDescription && card.eventDescription) {
      existing.eventDescription = card.eventDescription;
    }

    existing.scrapedAt = existing.scrapedAt < card.scrapedAt ? card.scrapedAt : existing.scrapedAt;

    if (nextVolume > existingVolume && card.volumeText) {
      existing.volumeText = card.volumeText;
      if (card.volumeNum !== undefined) {
        existing.volumeNum = card.volumeNum;
      }
      existing.sectionName = card.sectionName;
    }
  }

  const events = Array.from(byEvent.values()).map((event) => {
    if (event.markets.length === 0) {
      warnings.push(`시장 정보가 비어 있는 이벤트: ${event.eventTitle}`);
    }

    return {
      ...event,
      markets: [...event.markets].sort((left, right) => right.yesProb - left.yesProb),
    };
  });

  return {
    events: events.sort((left, right) => left.cardIndex - right.cardIndex),
    warnings,
  };
}

export function deriveEventId(eventUrl: string, eventTitle: string): string {
  try {
    const url = new URL(eventUrl);
    const slug = url.pathname.split("/").filter(Boolean).at(-1);
    return slug ? slugify(slug) : slugify(eventTitle);
  } catch {
    return slugify(eventTitle);
  }
}

function dedupeMarkets(markets: MarketRow[]): MarketRow[] {
  const byLabel = new Map<string, MarketRow>();

  for (const market of markets) {
    const existing = byLabel.get(market.label);
    if (!existing || market.yesProb > existing.yesProb) {
      byLabel.set(market.label, market);
    }
  }

  return Array.from(byLabel.values());
}
