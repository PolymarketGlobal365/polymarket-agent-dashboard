import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

import { renderTelegramPhotoCard } from "./photo-card.js";

test("renderTelegramPhotoCard creates a composite image file", async () => {
  const filePath = await renderTelegramPhotoCard({
    eventTitle: "What price will Ethereum hit in March?",
    eventUrl: "https://polymarket.com/event/what-price-will-ethereum-hit-in-march-2026",
    sourcePage: "https://polymarket.com/",
    scrapedAt: "2026-03-21T00:00:00.000Z",
    thumbnailUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='800' height='800' fill='%23657cff'/></svg>",
    category: "Crypto",
    volumeText: "$14.7M Vol.",
    volumeNum: 14_700_000,
    markets: [{ label: "Hit $2,400", yesProb: 35, noProb: 65 }],
  });

  assert.ok(filePath);
  const stat = await fs.stat(filePath as string);
  assert.ok(stat.size > 0);
});
