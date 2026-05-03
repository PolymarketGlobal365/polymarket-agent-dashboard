import test from "node:test";
import assert from "node:assert/strict";

import { buildSlidesForEvent } from "./slides.js";
import type { RankedEvent } from "../types.js";

test("buildSlidesForEvent creates five styled slides with per-slide market snapshots", () => {
  const event: RankedEvent = {
    eventId: "fed",
    sectionName: "정치",
    cardIndex: 0,
    eventTitle: "Will the Fed hold rates steady in March 2026?",
    eventDescription: "This market resolves to Yes if the FOMC leaves rates unchanged at its March 2026 meeting.",
    eventUrl: "https://polymarket.com/event/fed",
    thumbnailUrl: "https://example.com/fed.png",
    iconUrl: "https://example.com/fed-icon.png",
    category: "Politics",
    volumeText: "$49.3M Vol.",
    volumeNum: 49_300_000,
    markets: [
      { label: "No change", yesProb: 100, noProb: 0 },
      { label: "25 bps cut", yesProb: 1, noProb: 99 },
    ],
    scrapedAt: "2026-03-20T00:00:00.000Z",
    selectionScore: 4.2,
    scoreBreakdown: {
      sectionWeight: 1,
      volumeScore: 1,
      diversityBoost: 1,
      probabilitySignal: 0.7,
      freshnessScore: 0.5,
    },
  };

  const slides = buildSlidesForEvent(event);

  assert.equal(slides.length, 5);
  assert.equal(slides[0]?.layout, "hook");
  assert.equal(slides[0]?.headline, "연준, 3월에 금리 동결할까?");
  assert.equal(slides[0]?.categoryLabel, "정치");
  assert.equal(slides[0]?.marketSnapshot?.title, "No change");
  assert.equal(slides[1]?.marketSnapshot?.title, "No change");
  assert.equal(slides[2]?.marketSnapshot?.title, "25 bps cut");
  assert.equal(slides[3]?.layout, "context");
  assert.equal(slides[4]?.layout, "source");
  assert.ok(slides[4]?.ctaItems?.some((item) => item.includes("팔로우")));
});

test("buildSlidesForEvent infers 경제 label and Korean hook headline for crude oil markets", () => {
  const event: RankedEvent = {
    eventId: "crude-oil",
    sectionName: "Homepage",
    cardIndex: 2,
    eventTitle: "Will Crude Oil (CL) hit__ by end of March?",
    eventDescription: "This market tracks crude oil price targets into the end of March.",
    eventUrl: "https://polymarket.com/event/will-crude-oil-cl-hit-by-end-of-march",
    thumbnailUrl: "https://example.com/oil.png",
    volumeText: "$46M Vol.",
    volumeNum: 46_000_000,
    markets: [
      { label: "↑ $100", yesProb: 70, noProb: 30 },
      { label: "↑ $105", yesProb: 41, noProb: 59 },
    ],
    scrapedAt: "2026-03-21T04:51:42.799Z",
    selectionScore: 5.7,
    scoreBreakdown: {
      sectionWeight: 0.84,
      volumeScore: 2.34,
      diversityBoost: 0.8,
      probabilitySignal: 0.82,
      freshnessScore: 0.9,
    },
  };

  const slides = buildSlidesForEvent(event);

  assert.equal(slides[0]?.categoryLabel, "경제");
  assert.equal(slides[0]?.headline, "국제유가, 3월 말 100달러 갈까?");
  assert.equal(slides[0]?.marketSnapshot?.title, "Will Crude Oil (CL) hit ↑ $100 by end of March?");
});

test("buildSlidesForEvent creates Korean hook headline for microstrategy crypto market", () => {
  const event: RankedEvent = {
    eventId: "microstrategy",
    sectionName: "가상자산",
    cardIndex: 14,
    eventTitle: "MicroStrategy sells any Bitcoin by ___ ?",
    eventDescription: "This market resolves to Yes if MicroStrategy sells any Bitcoin before the listed date.",
    eventUrl: "https://polymarket.com/event/microstrategy-sell-any-bitcoin-in-2025",
    thumbnailUrl: "https://example.com/mstr.jpg",
    volumeText: "$21M Vol.",
    volumeNum: 21_000_000,
    markets: [
      { label: "December 31, 2026", yesProb: 11, noProb: 89 },
      { label: "June 30, 2026", yesProb: 3, noProb: 97 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 4.8,
    scoreBreakdown: {
      sectionWeight: 0.5,
      volumeScore: 1.5,
      diversityBoost: 0.7,
      probabilitySignal: 0.4,
      freshnessScore: 0.9,
    },
  };

  const slides = buildSlidesForEvent(event);

  assert.equal(slides[0]?.categoryLabel, "가상자산");
  assert.equal(slides[0]?.headline, "마이크로스트래티지, 비트코인 팔까?");
});

test("buildSlidesForEvent creates two-line hook headlines for new crypto events", () => {
  const bitcoinEvent: RankedEvent = {
    eventId: "when-will-bitcoin-hit-150k",
    sectionName: "가상자산",
    cardIndex: 33,
    eventTitle: "When will Bitcoin hit $150k?",
    eventDescription: "When will Bitcoin hit $150k",
    eventUrl: "https://polymarket.com/event/when-will-bitcoin-hit-150k",
    thumbnailUrl: "https://example.com/btc.png",
    volumeText: "$4M Vol.",
    volumeNum: 4_000_000,
    markets: [
      { label: "by December 31, 2026", yesProb: 12, noProb: 88 },
      { label: "by June 30, 2026", yesProb: 3, noProb: 97 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 4.2,
    scoreBreakdown: {
      sectionWeight: 0.5,
      volumeScore: 1,
      diversityBoost: 0.6,
      probabilitySignal: 0.5,
      freshnessScore: 0.9,
    },
  };

  const krakenEvent: RankedEvent = {
    eventId: "kraken-ipo-in-2025",
    sectionName: "가상자산",
    cardIndex: 53,
    eventTitle: "Kraken IPO by ___ ?",
    eventDescription: "This market resolves to Yes if Kraken completes an IPO.",
    eventUrl: "https://polymarket.com/event/kraken-ipo-in-2025",
    thumbnailUrl: "https://example.com/kraken.png",
    volumeText: "$1M Vol.",
    volumeNum: 1_000_000,
    markets: [
      { label: "December 31, 2026", yesProb: 28, noProb: 72 },
      { label: "March 31, 2026", yesProb: 1, noProb: 99 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 3.4,
    scoreBreakdown: {
      sectionWeight: 0.2,
      volumeScore: 1,
      diversityBoost: 0.5,
      probabilitySignal: 0.4,
      freshnessScore: 0.6,
    },
  };

  assert.equal(buildSlidesForEvent(bitcoinEvent)[0]?.headline, "비트코인 15만달러\n언제 돌파할까?");
  assert.equal(buildSlidesForEvent(krakenEvent)[0]?.headline, "크라켄 IPO\n언제 할까?");
});

test("buildSlidesForEvent treats pumpfun airdrop as crypto with two-line hook", () => {
  const event: RankedEvent = {
    eventId: "pumpfun-airdop-by",
    sectionName: "경제",
    cardIndex: 38,
    eventTitle: "Pump.fun airdrop by ....?",
    eventDescription: "This is a market on predicting the recipient of the Pump.fun airdrop.",
    eventUrl: "https://polymarket.com/event/pumpfun-airdop-by",
    thumbnailUrl: "https://example.com/pumpfun.png",
    volumeText: "$3M Vol.",
    volumeNum: 3_000_000,
    markets: [
      { label: "December 31, 2026", yesProb: 28, noProb: 72 },
      { label: "July 18", yesProb: 0, noProb: 100 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 3.1,
    scoreBreakdown: {
      sectionWeight: 0.4,
      volumeScore: 1.2,
      diversityBoost: 0.5,
      probabilitySignal: 0.4,
      freshnessScore: 0.6,
    },
  };

  const slides = buildSlidesForEvent(event);

  assert.equal(slides[0]?.categoryLabel, "가상자산");
  assert.equal(slides[0]?.headline, "펌프닷펀\n에어드롭 언제?");
});

test("buildSlidesForEvent creates two-line economy hooks for AI and GTA events", () => {
  const gptEvent: RankedEvent = {
    eventId: "gpt-6-released-by",
    sectionName: "경제",
    cardIndex: 71,
    eventTitle: "GPT-6 released by…?",
    eventDescription: "This market resolves to Yes if GPT-6 is released by the listed date.",
    eventUrl: "https://polymarket.com/event/gpt-6-released-by",
    thumbnailUrl: "https://example.com/gpt6.png",
    volumeText: "$333K Vol.",
    volumeNum: 333_000,
    markets: [
      { label: "December 31, 2026", yesProb: 81, noProb: 19 },
      { label: "September 30, 2026", yesProb: 69, noProb: 31 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 3.2,
    scoreBreakdown: {
      sectionWeight: 0.4,
      volumeScore: 1,
      diversityBoost: 0.5,
      probabilitySignal: 0.5,
      freshnessScore: 0.8,
    },
  };

  const gtaEvent: RankedEvent = {
    eventId: "gta-vi-released-before-june-2026",
    sectionName: "경제",
    cardIndex: 20,
    eventTitle: "GTA VI released before June 2026?",
    eventDescription: "This market resolves to Yes if GTA VI is released before June 2026.",
    eventUrl: "https://polymarket.com/event/gta-vi-released-before-june-2026",
    thumbnailUrl: "https://example.com/gta6.png",
    volumeText: "$13M Vol.",
    volumeNum: 13_000_000,
    markets: [
      { label: "대표 선택지", yesProb: 3, noProb: 97 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 4.5,
    scoreBreakdown: {
      sectionWeight: 0.5,
      volumeScore: 2,
      diversityBoost: 0.6,
      probabilitySignal: 0.8,
      freshnessScore: 0.9,
    },
  };

  assert.equal(buildSlidesForEvent(gptEvent)[0]?.headline, "GPT-6\n언제 나올까?");
  assert.equal(buildSlidesForEvent(gtaEvent)[0]?.headline, "GTA 6\n내년 6월 전 나올까?");
});

test("buildSlidesForEvent creates Korean hook headline for democratic nominee market", () => {
  const event: RankedEvent = {
    eventId: "democratic-presidential-nominee-2028",
    sectionName: "정치",
    cardIndex: 0,
    eventTitle: "Democratic Presidential Nominee 2028",
    eventDescription: "This market resolves to the person who wins the 2028 Democratic presidential nomination.",
    eventUrl: "https://polymarket.com/event/democratic-presidential-nominee-2028",
    thumbnailUrl: "https://example.com/democrats.png",
    volumeText: "$871M Vol.",
    volumeNum: 871_000_000,
    markets: [
      { label: "Gavin Newsom", yesProb: 25, noProb: 75 },
      { label: "Alexandria Ocasio-Cortez", yesProb: 8, noProb: 92 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 6.2,
    scoreBreakdown: {
      sectionWeight: 1,
      volumeScore: 2.5,
      diversityBoost: 0.8,
      probabilitySignal: 0.5,
      freshnessScore: 1,
    },
  };

  const slides = buildSlidesForEvent(event);

  assert.equal(slides[0]?.categoryLabel, "정치");
  assert.equal(slides[0]?.headline, "2028 민주당 대선 후보는?");
});

test("buildSlidesForEvent creates Korean hook headline for hungary prime minister market", () => {
  const event: RankedEvent = {
    eventId: "next-prime-minister-of-hungary",
    sectionName: "정치",
    cardIndex: 12,
    eventTitle: "Next Prime Minister of Hungary",
    eventDescription: "Parliamentary elections are expected to be held in Hungary on April 12, 2026.",
    eventUrl: "https://polymarket.com/event/next-prime-minister-of-hungary",
    thumbnailUrl: "https://example.com/hungary.png",
    volumeText: "$34M Vol.",
    volumeNum: 34_000_000,
    markets: [
      { label: "Péter Magyar", yesProb: 62, noProb: 38 },
      { label: "Viktor Orbán", yesProb: 38, noProb: 62 },
    ],
    scrapedAt: "2026-03-21T05:43:15.657Z",
    selectionScore: 5.1,
    scoreBreakdown: {
      sectionWeight: 0.7,
      volumeScore: 2,
      diversityBoost: 0.6,
      probabilitySignal: 0.5,
      freshnessScore: 0.8,
    },
  };

  const slides = buildSlidesForEvent(event);

  assert.equal(slides[0]?.headline, "헝가리 총리는\n누가 될까?");
  assert.ok((slides[1]?.body?.[0] ?? "").includes("기준점"));
});
