import test from "node:test";
import assert from "node:assert/strict";

import { SAMPLE_POLYMARKET_EVENTS } from "../fixtures/sample-events.js";
import { crawlPolymarketFromApiPayload } from "./crawl.js";
import { toFeedEventsFromApiCards } from "./crypto-feed.js";

test("API payload can be indexed to enrich crypto page events by root event url", async () => {
  const apiResult = await crawlPolymarketFromApiPayload(SAMPLE_POLYMARKET_EVENTS, "https://polymarket.com/");
  const detailsByUrl = new Map(apiResult.cards.map((card) => [card.eventUrl, card]));

  const detail = detailsByUrl.get("https://polymarket.com/event/will-solana-hit-300-by-july-2026");
  assert.ok(detail);
  assert.equal(detail?.eventTitle, "Will Solana hit $300 by July 2026?");
  assert.equal(detail?.thumbnailUrl, "https://images.polymarket.com/sol.png");
  assert.equal(detail?.markets[0]?.label, "Reach $300");
});

test("API cards can be converted directly into homepage feed events", async () => {
  const apiResult = await crawlPolymarketFromApiPayload(SAMPLE_POLYMARKET_EVENTS, "https://polymarket.com/");
  const events = toFeedEventsFromApiCards(apiResult.cards, "https://polymarket.com/");

  assert.equal(events[0]?.sourcePage, "https://polymarket.com/");
  assert.equal(events[0]?.eventTitle, "Will the Fed hold rates steady in March 2026?");
  assert.equal(events[0]?.eventUrl, "https://polymarket.com/event/will-fed-hold-rates-steady-march-2026");
  assert.equal(events[0]?.markets[0]?.label, "No change");
});
