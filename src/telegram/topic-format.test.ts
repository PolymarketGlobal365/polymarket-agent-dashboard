import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCopytradeMessages,
  buildStrategyMessages,
  buildTopicWelcomeMessage,
  buildTradingBotProgramMessages,
  buildWalletLeaderboardMessages,
} from "./topic-format.js";

test("buildWalletLeaderboardMessages formats ranked trader digests in English", () => {
  const messages = buildWalletLeaderboardMessages({
    generatedAt: "2026-05-03T08:00:00.000Z",
    entries: [
      {
        rank: 1,
        traderName: "debased",
        accountId: "debased",
        walletUrl: "https://polymarket.com/profile/debased",
        pnlUsd: 285000,
        volumeUsd: 2400000,
        winRatePct: 61.4,
        primaryFocus: "Geopolitics",
        styleTags: ["event-driven", "macro", "swing"],
        summary: "This trader appears highly event-driven and heavily focused on geopolitical catalysts.",
      },
    ],
  });

  assert.equal(messages.length, 1);
  assert.match(messages[0] ?? "", /Wallet Leaderboard/);
  assert.match(messages[0] ?? "", /#1 debased/);
  assert.match(messages[0] ?? "", /Style: event-driven, macro, swing/);
});

test("buildCopytradeMessages chunks long copytrade digests", () => {
  const messages = buildCopytradeMessages({
    generatedAt: "2026-05-03T08:00:00.000Z",
    alerts: [
      {
        traderName: "SecondWindCapital",
        accountId: "SecondWindCapital",
        walletUrl: "https://polymarket.com/profile/secondwindcapital",
        side: "BUY",
        marketTitle: "Trump out as President before 2027?",
        outcome: "No",
        price: 0.63,
        sizeUsd: 42000,
        interpretation: "Looks like a conviction add into an already established position.",
        marketUrl: "https://polymarket.com/event/trump-out-as-president-before-2027",
        observedAt: "2026-05-03T08:01:00.000Z",
      },
      {
        traderName: "SecondWindCapital",
        accountId: "SecondWindCapital",
        side: "SELL",
        marketTitle: "Will the U.S. invade Iran before 2027?",
        outcome: "Yes",
        price: 0.31,
        sizeUsd: 39000,
        interpretation: "Likely trimming into strength after a sharp move.",
        marketUrl: "https://polymarket.com/event/will-the-us-invade-iran-before-2027",
        observedAt: "2026-05-03T08:02:00.000Z",
      },
    ],
  }, {
    maxMessageLength: 520,
  });

  assert.ok(messages.length >= 2);
  assert.match(messages[0] ?? "", /Copytrade Feed/);
  assert.match(messages[messages.length - 1] ?? "", /continued/);
});

test("buildTradingBotProgramMessages includes operational status and alerts", () => {
  const messages = buildTradingBotProgramMessages({
    generatedAt: "2026-05-03T08:00:00.000Z",
    botStatus: "RUNNING",
    alerts: ["One program hit its daily budget cap."],
    entries: [
      {
        userLabel: "alpha-user",
        mode: "ACTIVE",
        strategyLabel: "Reward capture v1",
        budgetUsd: 500,
        deployedUsd: 220,
        openOrders: 4,
        filledOrders: 2,
        realizedPnlUsd: 18,
        pendingActions: ["reprice 2 orders", "review fill drift"],
        note: "Execution engine healthy.",
      },
    ],
  });

  assert.equal(messages.length, 1);
  assert.match(messages[0] ?? "", /Trading Bot \(Program\)/);
  assert.match(messages[0] ?? "", /Bot status: RUNNING/);
  assert.match(messages[0] ?? "", /alpha-user -> ACTIVE/);
});

test("buildStrategyMessages formats an operator brief in English", () => {
  const messages = buildStrategyMessages({
    generatedAt: "2026-05-03T08:00:00.000Z",
    headline: "Stay selective on reward markets with real two-sided books.",
    thesis: "Wide spreads are still common, so capital should stay with markets that can actually be repriced.",
    watchlist: ["U.S. politics", "Middle East", "major crypto catalysts"],
    sections: [
      {
        heading: "What to emphasize",
        bullets: [
          "Prioritize markets with multiple rewarded bid levels.",
          "Avoid chasing top reward rates when the spread is structurally broken.",
        ],
      },
    ],
    closingNote: "Treat this room as the strategy layer, not the execution ledger.",
  });

  assert.equal(messages.length, 1);
  assert.match(messages[0] ?? "", /Strategies/);
  assert.match(messages[0] ?? "", /Headline:/);
  assert.match(messages[0] ?? "", /What to emphasize/);
});

test("buildTopicWelcomeMessage returns the correct topic-specific intro", () => {
  assert.match(buildTopicWelcomeMessage("wallet-leaderboard"), /Ranked trader snapshots/);
  assert.match(buildTopicWelcomeMessage("copytrade"), /New wallet actions/);
  assert.match(buildTopicWelcomeMessage("trading-bot-program"), /Orders placed, repriced, and filled/);
  assert.match(buildTopicWelcomeMessage("strategies"), /Daily thesis/);
});
