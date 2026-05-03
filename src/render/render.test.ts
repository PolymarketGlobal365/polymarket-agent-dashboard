import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { launchRenderingBrowser } from "./browser.js";
import { renderSlides } from "./render.js";
import type { SlideSpec } from "../types.js";

test("renderSlides creates png files and qa output", async () => {
  const browser = await launchRenderingBrowser();
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-render-"));
  const slides: SlideSpec[] = [
    {
      eventId: "event",
      slideNo: 1,
      layout: "hook",
      brandLine: "세상 모든 예측 시장 | 폴리마켓나우",
      categoryLabel: "정치",
      headline: "3월 연준 결정은?",
      subheadline: "현재 가장 강한 선택지는 변경 없음이고, Yes 확률은 100%입니다.",
      marketSnapshot: {
        title: "연준의 3월 결정?",
        volumeText: "$49M Vol.",
        probabilityText: "100%",
        deltaText: "▲ 43%",
        rows: [
          { label: "변경 없음", yesProb: 100, noProb: 0 },
          { label: "25bps 감소", yesProb: 1, noProb: 99 },
        ],
      },
    },
    {
      eventId: "event",
      slideNo: 2,
      layout: "breakdown",
      brandLine: "세상 모든 예측 시장 | 폴리마켓나우",
      headline: "변경없음",
      highlightTone: "green",
      body: [
        "이 시장에서 가장 강한 시나리오는 변경 없음이며, 현재 Yes 확률은 100%입니다.",
        "$49M Vol. 수준의 거래량은 이 이슈에 대한 관심이 크다는 뜻입니다.",
      ],
      marketSnapshot: {
        title: "변경 없음",
        volumeText: "$49M Vol.",
        probabilityText: "100%",
        deltaText: "▲ 43%",
        rows: [{ label: "변경 없음", yesProb: 100, noProb: 0 }],
      },
    },
    {
      eventId: "event",
      slideNo: 3,
      layout: "insight",
      brandLine: "세상 모든 예측 시장 | 폴리마켓나우",
      headline: "25bps 감소",
      highlightTone: "red",
      body: [
        "25bps 감소의 Yes 확률은 1%로, 대표 시나리오보다 99%p 낮습니다.",
        "대표 시나리오의 반대 포지션은 No 0% 수준입니다.",
      ],
      marketSnapshot: {
        title: "변경 없음",
        volumeText: "$49M Vol.",
        probabilityText: "100%",
        deltaText: "▲ 43%",
        rows: [{ label: "변경 없음", yesProb: 100, noProb: 0 }],
      },
    },
    {
      eventId: "event",
      slideNo: 4,
      layout: "context",
      brandLine: "세상 모든 예측 시장 | 폴리마켓나우",
      headline: "시장 흐름",
      highlightTone: "red",
      body: [
        "시장은 아직 먼 시점을 더 가능성 높은 구간으로 보고 있습니다.",
        "거래량도 꾸준히 붙으면서 관심이 이어지고 있습니다.",
      ],
      marketSnapshot: {
        title: "변경 없음",
        volumeText: "$49M Vol.",
        probabilityText: "100%",
        deltaText: "▲ 43%",
      },
      progressValue: 73,
      progressDirection: "right",
      chartPoints: [50, 50, 51, 52, 53, 60, 70, 73],
      chartLabel: "73% 가능성",
      chartDeltaText: "▲ 23%",
    },
    {
      eventId: "event",
      slideNo: 5,
      layout: "source",
      brandLine: "세상 모든 예측 시장 | 폴리마켓나우",
      badgeLabel: "세상 모든 베팅 / 예측 뉴스",
      headline: "놓치고 싶지 않다면?",
      subheadline: "@polymarketnow에서 매일 빠르게 정리한 폴리마켓 카드뉴스를 확인하세요.",
      ctaItems: [
        "폴리마켓나우 공식 계정 팔로우",
        "관심 시장 카드 저장하고 비교하기",
        "업로드 전 원문 링크로 수치 다시 확인하기",
      ],
      sourceLabel: "원문",
      sourceUrl: "https://polymarket.com/event/event",
    },
  ];

  try {
    const result = await renderSlides(browser, "event", slides, tempDir);

    assert.equal(result.imagePaths.length, 5);
    assert.equal(result.qa.length, 5);

    const stat = await fs.stat(result.imagePaths[0]!);
    assert.ok(stat.size > 0);
  } finally {
    await browser.close();
  }
});
