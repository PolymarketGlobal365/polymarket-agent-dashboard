import test from "node:test";
import assert from "node:assert/strict";

import { buildCryptoTelegramMessages } from "./format.js";

const sampleEvents = [
  {
    eventTitle: "Bitcoin above ___ on March 21?",
    eventUrl: "https://polymarket.com/event/bitcoin-above",
    sourcePage: "https://polymarket.com/crypto",
    scrapedAt: "2026-03-21T00:00:00.000Z",
  },
  {
    eventTitle: "Ethereum above ___ on March 21?",
    eventUrl: "https://polymarket.com/event/ethereum-above",
    sourcePage: "https://polymarket.com/crypto",
    scrapedAt: "2026-03-21T00:00:00.000Z",
  },
  {
    eventTitle: "What price will Solana hit in March?",
    eventUrl: "https://polymarket.com/event/solana-price-in-march",
    sourcePage: "https://polymarket.com/crypto",
    scrapedAt: "2026-03-21T00:00:00.000Z",
  },
];

test("buildCryptoTelegramMessages chunks long digests into multiple messages", () => {
  const messages = buildCryptoTelegramMessages(sampleEvents, {
    generatedAt: "2026-03-21T00:00:00.000Z",
    maxMessageLength: 320,
  });

  assert.ok(messages.length >= 2);
  assert.match(messages[0] ?? "", /Polymarket Crypto update/);
  assert.match(messages[0] ?? "", /Bitcoin above ___ on March 21\?/);
  assert.match(messages[messages.length - 1] ?? "", /continued/);
  assert.match(messages[messages.length - 1] ?? "", /What price will Solana hit in March\?/);
});
