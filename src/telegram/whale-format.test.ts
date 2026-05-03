import test from "node:test";
import assert from "node:assert/strict";

import { buildWhaleAlertMessage } from "./whale-format.js";

test("buildWhaleAlertMessage renders a compact whale alert digest", () => {
  const message = buildWhaleAlertMessage({
    alertId: "abc",
    proxyWallet: "0x1234567890abcdef1234567890abcdef12345678",
    traderName: "Sisyphus",
    verified: true,
    xUsername: "sisyphus",
    side: "BUY",
    usdcSize: 91_865,
    price: 0.42,
    marketTitle: "US x Iran ceasefire by May 31?",
    outcome: "Yes",
    timestamp: 1_775_520_000,
    transactionHash: "0xdeadbeef",
    leaderboardRank: "12",
    leaderboardVolume: 241_250_000,
    leaderboardPnl: 510_000,
  });

  assert.match(message, /Polymarket Whale Alert/);
  assert.match(message, /🟢 BUY \$91.9K/);
  assert.match(message, /트레이더: Sisyphus \(@sisyphus\) ✓/);
  assert.match(message, /시장: US x Iran ceasefire by May 31\?/);
  assert.match(message, /포지션: Yes/);
  assert.match(message, /체결 가격: 42%/);
  assert.match(message, /리더보드: #12/);
  assert.match(message, /누적 거래량: \$241.25M/);
  assert.doesNotMatch(message, /TX:/);
  assert.match(message, /<b>👉🏻 시장 상위 트레이더가 'Yes' 방향에 새 자금을 얹었습니다\./);
});
