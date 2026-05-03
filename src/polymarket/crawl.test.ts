import test from "node:test";
import assert from "node:assert/strict";

import { SAMPLE_POLYMARKET_EVENTS } from "../fixtures/sample-events.js";
import { crawlPolymarketFromApiPayload } from "./crawl.js";

test("crawlPolymarketFromApiPayload extracts events and binary markets", async () => {
  const result = await crawlPolymarketFromApiPayload(SAMPLE_POLYMARKET_EVENTS, "https://polymarket.com/");

  assert.equal(result.cards.length, 4);
  assert.equal(result.cards[0]?.sectionName, "정치");
  assert.equal(result.cards[0]?.markets[0]?.label, "No change");
  assert.equal(result.cards[0]?.markets[0]?.yesProb, 100);
  assert.match(result.cards[0]?.eventUrl ?? "", /^https:\/\/polymarket\.com\/event\//);
});
