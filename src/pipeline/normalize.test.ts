import test from "node:test";
import assert from "node:assert/strict";

import { normalizeCards } from "./normalize.js";
import type { ScrapedCard } from "../types.js";

test("normalizeCards dedupes identical event urls and preserves strongest volume", () => {
  const cards: ScrapedCard[] = [
    {
      sectionName: "Trending",
      cardIndex: 0,
      eventTitle: "Will X happen?",
      eventUrl: "https://polymarket.com/event/will-x-happen",
      thumbnailUrl: "https://example.com/a.png",
      volumeText: "$4M Vol.",
      markets: [{ label: "Yes", yesProb: 55, noProb: 45 }],
      scrapedAt: "2026-03-20T00:00:00.000Z",
      sourcePage: "https://polymarket.com/",
    },
    {
      sectionName: "Politics",
      cardIndex: 5,
      eventTitle: "Will X happen?",
      eventUrl: "https://polymarket.com/event/will-x-happen",
      volumeText: "$8M Vol.",
      markets: [{ label: "No", yesProb: 20, noProb: 80 }],
      scrapedAt: "2026-03-20T00:05:00.000Z",
      sourcePage: "https://polymarket.com/",
    },
  ];

  const result = normalizeCards(cards);

  assert.equal(result.events.length, 1);
  assert.equal(result.events[0]?.volumeText, "$8M Vol.");
  assert.equal(result.events[0]?.markets.length, 2);
});
