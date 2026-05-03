import test from "node:test";
import assert from "node:assert/strict";

import { buildWhaleFeed, formatProbability, formatTraderLabel, formatUsdCompact } from "./whales.js";

test("buildWhaleFeed uses global activity by default and keeps only large recent trades", async () => {
  const calls: string[] = [];
  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);
    calls.push(url);

    if (url.includes("/v1/leaderboard")) {
      return jsonResponse([
        {
          rank: "1",
          proxyWallet: "0x1111111111111111111111111111111111111111",
          userName: "Sisyphus",
          vol: 241_250_000,
          pnl: 510_000,
          xUsername: "sisyphus",
          verifiedBadge: true,
        },
      ]);
    }

    if (url.includes("/activity")) {
      return jsonResponse([
        {
          proxyWallet: "0x1111111111111111111111111111111111111111",
          timestamp: 1_775_520_000,
          type: "TRADE",
          usdcSize: 91_865,
          size: 218_726,
          transactionHash: "0xabc",
          price: 0.42,
          side: "BUY",
          title: "US x Iran ceasefire by May 31?",
          outcome: "Yes",
          pseudonym: "Sisyphus",
        },
        {
          proxyWallet: "0x1111111111111111111111111111111111111111",
          timestamp: 1_775_519_000,
          type: "TRADE",
          usdcSize: 4_000,
          side: "BUY",
          title: "Tiny trade",
        },
      ]);
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await buildWhaleFeed({
    leaderboardLimit: 5,
    minUsdcSize: 25_000,
    maxAlerts: 5,
    startTimestamp: 1_775_000_000 * 1_000,
    fetchImpl,
  });

  assert.equal(result.trackedTraders.length, 1);
  assert.equal(result.alerts.length, 1);
  assert.equal(result.alerts[0]?.traderName, "Sisyphus");
  assert.equal(result.alerts[0]?.marketTitle, "US x Iran ceasefire by May 31?");
  assert.equal(result.alerts[0]?.side, "BUY");
  assert.equal(result.alerts[0]?.verified, true);
  assert.equal(calls.length, 2);
  assert.equal(calls.some((url) => url.includes("user=")), false);
});

test("buildWhaleFeed keeps tracked-wallet mode for explicit wallet filters", async () => {
  const calls: string[] = [];
  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);
    calls.push(url);

    if (url.includes("/v1/leaderboard")) {
      return jsonResponse([
        {
          rank: "1",
          proxyWallet: "0x1111111111111111111111111111111111111111",
          userName: "Sisyphus",
          vol: 241_250_000,
          pnl: 510_000,
          verifiedBadge: true,
        },
      ]);
    }

    if (url.includes("/activity")) {
      return jsonResponse([
        {
          proxyWallet: "0x1111111111111111111111111111111111111111",
          timestamp: 1_775_520_000,
          type: "TRADE",
          usdcSize: 91_865,
          side: "BUY",
          title: "Tracked trade",
        },
      ]);
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await buildWhaleFeed({
    trackedWallets: ["0x1111111111111111111111111111111111111111"],
    fetchImpl,
  });

  assert.equal(result.alerts.length, 1);
  assert.equal(calls.some((url) => url.includes("user=0x1111111111111111111111111111111111111111")), true);
});

test("buildWhaleFeed falls back to per-trader activity when global activity is empty", async () => {
  const calls: string[] = [];
  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);
    calls.push(url);

    if (url.includes("/v1/leaderboard")) {
      return jsonResponse([
        {
          rank: "1",
          proxyWallet: "0x1111111111111111111111111111111111111111",
          userName: "Sisyphus",
          vol: 241_250_000,
          pnl: 510_000,
          verifiedBadge: true,
        },
      ]);
    }

    if (url.includes("/activity") && !url.includes("user=")) {
      return jsonResponse([]);
    }

    if (url.includes("/activity") && url.includes("user=0x1111111111111111111111111111111111111111")) {
      return jsonResponse([
        {
          proxyWallet: "0x1111111111111111111111111111111111111111",
          timestamp: 1_775_520_000,
          type: "TRADE",
          usdcSize: 91_865,
          side: "BUY",
          title: "Fallback trade",
        },
      ]);
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await buildWhaleFeed({
    leaderboardLimit: 5,
    minUsdcSize: 25_000,
    maxAlerts: 5,
    startTimestamp: 1_775_000_000 * 1_000,
    fetchImpl,
  });

  assert.equal(result.alerts.length, 1);
  assert.equal(result.alerts[0]?.marketTitle, "Fallback trade");
  assert.equal(calls.some((url) => url.includes("/activity") && !url.includes("user=")), true);
  assert.equal(calls.some((url) => url.includes("user=0x1111111111111111111111111111111111111111")), true);
});

test("format helpers keep alert copy compact", () => {
  assert.equal(formatUsdCompact(91_865), "$91.9K");
  assert.equal(formatUsdCompact(241_250_000), "$241.25M");
  assert.equal(formatProbability(0.425), "42.5%");
  assert.equal(formatTraderLabel({ traderName: "Sisyphus", xUsername: "sisyphus", verified: true }), "Sisyphus (@sisyphus) ✓");
});

test("buildWhaleFeed mixes buy and sell alerts when both exist", async () => {
  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);

    if (url.includes("/v1/leaderboard")) {
      return jsonResponse([
        {
          rank: "1",
          proxyWallet: "0x1111111111111111111111111111111111111111",
          userName: "Buyer",
        },
        {
          rank: "2",
          proxyWallet: "0x2222222222222222222222222222222222222222",
          userName: "Seller",
        },
      ]);
    }

    if (url.includes("/activity") && !url.includes("user=")) {
      return jsonResponse([]);
    }

    if (url.includes("user=0x1111111111111111111111111111111111111111")) {
      return jsonResponse([
        {
          proxyWallet: "0x1111111111111111111111111111111111111111",
          timestamp: 1_775_520_010,
          type: "TRADE",
          usdcSize: 60_000,
          side: "BUY",
          title: "Buy trade 1",
        },
        {
          proxyWallet: "0x1111111111111111111111111111111111111111",
          timestamp: 1_775_520_009,
          type: "TRADE",
          usdcSize: 55_000,
          side: "BUY",
          title: "Buy trade 2",
        },
      ]);
    }

    if (url.includes("user=0x2222222222222222222222222222222222222222")) {
      return jsonResponse([
        {
          proxyWallet: "0x2222222222222222222222222222222222222222",
          timestamp: 1_775_520_008,
          type: "TRADE",
          usdcSize: 58_000,
          side: "SELL",
          title: "Sell trade 1",
        },
      ]);
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await buildWhaleFeed({
    leaderboardLimit: 2,
    minUsdcSize: 25_000,
    maxAlerts: 3,
    startTimestamp: 1_775_000_000 * 1_000,
    fetchImpl,
  });

  assert.deepEqual(
    result.alerts.map((alert) => alert.side),
    ["BUY", "SELL", "BUY"],
  );
});

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
