import test from "node:test";
import assert from "node:assert/strict";

import { selectTopEvents } from "./rank.js";
import type { NormalizedEvent } from "../types.js";

function createEvent(index: number, title: string, volumeText: string): NormalizedEvent {
  return {
    eventId: `event-${index}`,
    sectionName: index % 2 === 0 ? "Trending" : "Politics",
    cardIndex: index,
    eventTitle: title,
    eventUrl: `https://polymarket.com/event/${index}`,
    volumeText,
    markets: [{ label: "Yes", yesProb: 60 - index, noProb: 40 + index }],
    scrapedAt: "2026-03-20T00:00:00.000Z",
  };
}

test("selectTopEvents returns at most four diverse events", () => {
  const selected = selectTopEvents([
    createEvent(0, "Will Bitcoin hit 120k?", "$90M Vol."),
    createEvent(1, "Will Ethereum hit 8k?", "$30M Vol."),
    createEvent(2, "Will Biden drop out?", "$8M Vol."),
    createEvent(3, "Will Solana hit 300?", "$25M Vol."),
    createEvent(4, "Will crude oil hit 100?", "$44M Vol."),
  ]);

  assert.equal(selected.length, 4);
  assert.equal(new Set(selected.map((event) => event.eventId)).size, 4);
  assert.ok(selected[0]!.selectionScore >= selected[3]!.selectionScore);
});
