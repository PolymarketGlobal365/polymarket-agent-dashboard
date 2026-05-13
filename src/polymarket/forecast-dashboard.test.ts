import assert from "node:assert/strict";
import test from "node:test";

import {
  buildForecastDashboardViewModel,
  renderForecastDashboardHtml,
  type ForecastDashboardConfig,
} from "./forecast-dashboard.js";
import type { RewardTradingSnapshot } from "./trading-bot.js";

test("buildForecastDashboardViewModel computes headline stats and card metadata", () => {
  const model = buildForecastDashboardViewModel(sampleSnapshot(), sampleConfig());

  assert.equal(model.cards.length, 2);
  assert.equal(model.cards[0]?.rank, 1);
  assert.match(model.deskHeadline, /Desk Alpha/);
  assert.equal(model.bullishCount, 1);
  assert.equal(model.bearishCount, 1);
  assert.equal(model.topProbability > 60, true);
});

test("renderForecastDashboardHtml includes agent profile and market cards", () => {
  const html = renderForecastDashboardHtml(
    buildForecastDashboardViewModel(sampleSnapshot(), sampleConfig()),
  );

  assert.match(html, /Desk Alpha/);
  assert.match(html, /Will Bitcoin finish May above 120k\?/);
  assert.match(html, /AI Forecast Desk/);
  assert.match(html, /Open market/);
  assert.match(html, /data-desktop-stage/);
  assert.match(html, /ResizeObserver/);
});

function sampleConfig(): ForecastDashboardConfig {
  return {
    title: "Polymarket Win Rate Desk",
    subtitle: "Dark terminal dashboard for fast signal scanning",
    accent: "green",
    agent: {
      agentName: "Desk Alpha",
      provider: "OpenAI",
      model: "gpt-5.4",
      strategy: "Short-term signal strategy using rewards, spread, and order book balance",
      riskStyle: "balanced",
      voiceNote: "Fast and disciplined desk briefing",
    },
  };
}

function sampleSnapshot(): RewardTradingSnapshot {
  return {
    generatedAt: "2026-05-03T08:30:00.000Z",
    scannedMarkets: 42,
    shortlistedMarkets: 2,
    signals: [
      {
        signalId: "btc:yes",
        eventTitle: "Bitcoin May range",
        eventUrl: "https://polymarket.com/event/bitcoin-may-range",
        marketQuestion: "Will Bitcoin finish May above 120k?",
        marketSlug: "btc-above-120k",
        category: "Crypto",
        tags: ["crypto", "bitcoin"],
        conditionId: "cond-1",
        outcomeLabel: "Yes",
        tokenId: "token-1",
        score: 8.4,
        bias: "bullish",
        action: "passive-entry",
        rewardDailyRate: 9.5,
        rewardMinSize: 2500,
        rewardMaxSpreadCents: 8,
        bestBid: 0.61,
        bestAsk: 0.63,
        midpoint: 0.62,
        displayedSpreadCents: 2,
        lastTradePrice: 0.62,
        dayChangePct: 0.04,
        weekChangePct: 0.12,
        bookImbalance: 0.28,
        quote: {
          action: "quote",
          regime: "coarse",
          targetPrice: 0.61,
          candidateCount: 4,
          bandLower: 0.58,
          bandUpper: 0.62,
          note: "Stable coarse-tick lane.",
        },
        headlineReason: "rewards 9.5/day with strong book support near the midpoint",
      },
      {
        signalId: "eth:no",
        eventTitle: "Ethereum CPI reaction",
        eventUrl: "https://polymarket.com/event/ethereum-cpi-reaction",
        marketQuestion: "Will Ethereum hold 4k after CPI?",
        marketSlug: "eth-hold-4k",
        category: "Crypto",
        tags: ["crypto", "ethereum", "macro"],
        conditionId: "cond-2",
        outcomeLabel: "No",
        tokenId: "token-2",
        score: 7.1,
        bias: "bearish",
        action: "watch-only",
        rewardDailyRate: 6.2,
        rewardMinSize: 1800,
        rewardMaxSpreadCents: 10,
        bestBid: 0.39,
        bestAsk: 0.41,
        midpoint: 0.4,
        displayedSpreadCents: 2,
        lastTradePrice: 0.4,
        dayChangePct: -0.03,
        weekChangePct: -0.08,
        bookImbalance: -0.18,
        quote: {
          action: "avoid",
          regime: "fine",
          candidateCount: 2,
          bandLower: 0.35,
          bandUpper: 0.4,
          note: "Thin support on the bid side.",
        },
        headlineReason: "downside lane stays attractive while ask pressure keeps the YES side capped",
      },
    ],
  };
}
