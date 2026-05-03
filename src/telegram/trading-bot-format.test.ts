import assert from "node:assert/strict";
import test from "node:test";

import { buildTradingTelegramMessages } from "./trading-bot-format.js";
import type { RewardTradingSignal } from "../polymarket/trading-bot.js";

test("buildTradingTelegramMessages chunks long signal digests", () => {
  const sample = createSignal("Yes");
  const messages = buildTradingTelegramMessages(
    [sample, { ...sample, signalId: "2", outcomeLabel: "No", tokenId: "no-token" }],
    {
      generatedAt: "2026-05-03T07:30:00.000Z",
      maxMessageLength: 550,
    },
  );

  assert.ok(messages.length >= 2);
  assert.match(messages[0] ?? "", /Polymarket reward-trading bot/);
  assert.match(messages[0] ?? "", /Will Bitcoin break 150k in 2026\?/);
  assert.match(messages[messages.length - 1] ?? "", /continued/);
});

function createSignal(outcomeLabel: string): RewardTradingSignal {
  return {
    signalId: "1",
    eventTitle: "Will Bitcoin break 150k in 2026?",
    eventUrl: "https://polymarket.com/event/will-bitcoin-break-150k-2026",
    marketQuestion: "Bitcoin above 150k by Dec 31, 2026?",
    marketSlug: "bitcoin-above-150k-2026",
    category: "Crypto",
    tags: ["crypto", "bitcoin"],
    conditionId: "0xabc",
    outcomeLabel,
    tokenId: outcomeLabel.toLowerCase(),
    score: 8.72,
    bias: "bullish",
    action: "passive-entry",
    rewardDailyRate: 8,
    rewardMinSize: 50,
    rewardMaxSpreadCents: 4.5,
    bestBid: 0.54,
    bestAsk: 0.55,
    midpoint: 0.545,
    displayedSpreadCents: 1,
    lastTradePrice: 0.54,
    dayChangePct: 4,
    weekChangePct: 7,
    bookImbalance: 0.33,
    quote: {
      action: "quote",
      regime: "coarse",
      targetPrice: 0.52,
      candidateCount: 4,
      bandLower: 0.5225,
      bandUpper: 0.545,
      note: "Selected the mid-band bid lane used for coarse-tick rewarded markets.",
    },
    headlineReason: "rewards 8/day | min size 50 | 1d +4% | 1w +7% | book +33% | entry lane available",
  };
}
