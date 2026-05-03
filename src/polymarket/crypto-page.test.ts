import test from "node:test";
import assert from "node:assert/strict";

import { normalizeCryptoEventAnchors } from "./crypto-page.js";

test("normalizeCryptoEventAnchors keeps the strongest title for each event url", () => {
  const events = normalizeCryptoEventAnchors(
    [
      {
        href: "/event/bitcoin-above",
        text: "",
        imageSrc: "https://images.polymarket.com/btc-card.png",
        order: 0,
      },
      {
        href: "/event/bitcoin-above",
        text: "Bitcoin above ___ on March 21?",
        imageSrc: "https://images.polymarket.com/btc.png",
        order: 1,
      },
      {
        href: "/event/bitcoin-above/bitcoin-above-60000",
        text: "60,000",
        imageSrc: "https://images.polymarket.com/btc-small.png",
        order: 2,
      },
      {
        href: "/event/bitcoin-above",
        text: "Yes 100%",
        imageSrc: "https://images.polymarket.com/btc-small.png",
        order: 3,
      },
      {
        href: "/event/ethereum-above",
        text: "Ethereum above ___ on March 21?",
        imageSrc: "https://images.polymarket.com/eth.png",
        order: 3,
      },
      {
        href: "/event/ethereum-above?marketSlug=ethereum-above-1700&outcomeIndex=1",
        text: "No <1%",
        imageSrc: "https://images.polymarket.com/eth-small.png",
        order: 4,
      },
      {
        href: "/markets/not-an-event",
        text: "Ignore me",
        imageSrc: "https://images.polymarket.com/ignore.png",
        order: 5,
      },
    ],
    "https://polymarket.com/crypto",
    "2026-03-21T00:00:00.000Z",
  );

  assert.equal(events.length, 2);
  assert.deepEqual(events[0], {
    eventTitle: "Bitcoin above ___ on March 21?",
    eventUrl: "https://polymarket.com/event/bitcoin-above",
    thumbnailUrl: "https://images.polymarket.com/btc.png",
    sourcePage: "https://polymarket.com/crypto",
    scrapedAt: "2026-03-21T00:00:00.000Z",
  });
  assert.equal(events[1]?.eventTitle, "Ethereum above ___ on March 21?");
});
