import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRewardTradingSnapshot,
  decidePassiveRewardQuote,
} from "./trading-bot.js";

test("decidePassiveRewardQuote avoids thin coarse-tick books", () => {
  const decision = decidePassiveRewardQuote({
    bids: [
      { price: 0.47, size: 100 },
      { price: 0.46, size: 100 },
    ],
    midpoint: 0.5,
    rewardMaxSpreadCents: 6,
    tickSize: 0.01,
  });

  assert.equal(decision.action, "avoid");
  assert.equal(decision.regime, "coarse");
});

test("decidePassiveRewardQuote picks the interior lane for coarse-tick books", () => {
  const decision = decidePassiveRewardQuote({
    bids: [
      { price: 0.49, size: 100 },
      { price: 0.48, size: 100 },
      { price: 0.47, size: 100 },
      { price: 0.46, size: 100 },
      { price: 0.45, size: 100 },
    ],
    midpoint: 0.5,
    rewardMaxSpreadCents: 10,
    tickSize: 0.01,
  });

  assert.equal(decision.action, "quote");
  assert.equal(decision.targetPrice, 0.46);
  assert.equal(decision.regime, "coarse");
});

test("buildRewardTradingSnapshot joins rewards, events, and books into ranked signals", async () => {
  const rewardPayload = {
    data: [
      {
        condition_id: "0xabc",
        rewards_max_spread: 10,
        rewards_min_size: 50,
        total_daily_rate: 8,
      },
    ],
  };

  const eventsPayload = [
    {
      title: "Will Bitcoin break 150k in 2026?",
      slug: "will-bitcoin-break-150k-2026",
      category: "Crypto",
      tags: [{ label: "Crypto" }, { slug: "bitcoin" }],
      markets: [
        {
          question: "Bitcoin above 150k by Dec 31, 2026?",
          slug: "bitcoin-above-150k-2026",
          conditionId: "0xabc",
          outcomes: "[\"Yes\",\"No\"]",
          clobTokenIds: "[\"yes-token\",\"no-token\"]",
          active: true,
          acceptingOrders: true,
          bestBid: 0.53,
          bestAsk: 0.55,
          spread: 0.02,
          orderPriceMinTickSize: 0.01,
          lastTradePrice: 0.54,
          volume24hr: 150000,
          liquidityClob: 50000,
          oneDayPriceChange: 0.04,
          oneWeekPriceChange: 0.07,
        },
      ],
    },
  ];

  const yesBook = {
    bids: [
      { price: "0.54", size: "300" },
      { price: "0.53", size: "280" },
      { price: "0.52", size: "260" },
      { price: "0.51", size: "240" },
    ],
    asks: [
      { price: "0.55", size: "180" },
      { price: "0.56", size: "160" },
    ],
    tick_size: "0.01",
    last_trade_price: "0.54",
  };

  const noBook = {
    bids: [
      { price: "0.45", size: "90" },
      { price: "0.44", size: "85" },
      { price: "0.43", size: "80" },
    ],
    asks: [
      { price: "0.46", size: "200" },
      { price: "0.47", size: "220" },
    ],
    tick_size: "0.01",
    last_trade_price: "0.45",
  };

  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("/rewards/markets/current")) {
      return jsonResponse(rewardPayload);
    }
    if (url.includes("gamma-api.polymarket.com/events")) {
      return jsonResponse(eventsPayload);
    }
    if (url.includes("token_id=yes-token")) {
      return jsonResponse(yesBook);
    }
    if (url.includes("token_id=no-token")) {
      return jsonResponse(noBook);
    }

    throw new Error(`Unexpected URL ${url}`);
  };

  const snapshot = await buildRewardTradingSnapshot({
    maxMarkets: 1,
    fetchImpl,
  });

  assert.equal(snapshot.scannedMarkets, 1);
  assert.equal(snapshot.shortlistedMarkets, 1);
  assert.equal(snapshot.signals.length, 2);
  assert.equal(snapshot.signals[0]?.outcomeLabel, "Yes");
  assert.match(snapshot.signals[0]?.signalId ?? "", /0xabc:yes/);
  assert.match(snapshot.signals[0]?.headlineReason ?? "", /rewards 8\/day/);
});

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
