import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { cleanText } from "../lib/strings.js";
import { ensureDir } from "../lib/fs.js";
import { launchRenderingBrowser } from "../render/browser.js";
import type { CryptoFeedEvent } from "../polymarket/crypto-feed.js";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 675;
const IMAGE_WIDTH = 560;
const IMAGE_HEIGHT = 595;

export async function renderTelegramPhotoCard(event: CryptoFeedEvent): Promise<string | undefined> {
  const browser = await launchRenderingBrowser();
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-telegram-card-"));
  const outputPath = path.join(outputDir, `${slugifyEventTitle(event.eventTitle)}.png`);

  try {
    await ensureDir(outputDir);
    const page = await browser.newPage({
      viewport: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      },
      deviceScaleFactor: 1,
    });

    try {
      await page.setContent(renderPhotoCardHtml(event), { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => undefined);
      await page.waitForTimeout(200);
      await page.screenshot({ path: outputPath, type: "png" });
    } finally {
      await page.close();
    }

    return outputPath;
  } catch {
    return undefined;
  } finally {
    await browser.close();
  }
}

function renderPhotoCardHtml(event: CryptoFeedEvent): string {
  const title = escapeHtml(cleanText(event.eventTitle) || "Polymarket Event");
  const imageUrl = escapeHtml(resolveDisplayImage(event));
  const leftTop = topRow(event.markets, 0);
  const leftBottom = topRow(event.markets, 1);
  const category = escapeHtml(toCategoryLabel(event.category));
  const volume = escapeHtml(event.volumeText || "LIVE");

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        color-scheme: dark;
        font-family: "Segoe UI", "Apple SD Gothic Neo", sans-serif;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background:
          radial-gradient(circle at top left, rgba(131, 255, 66, 0.18), transparent 32%),
          linear-gradient(135deg, #100d18 0%, #171321 48%, #1f182e 100%);
        color: #fff;
      }
      .frame {
        width: ${CARD_WIDTH}px;
        height: ${CARD_HEIGHT}px;
        padding: 40px;
      }
      .card {
        width: 100%;
        height: 100%;
        border-radius: 34px;
        background: rgba(19, 15, 29, 0.96);
        border: 1px solid rgba(255,255,255,0.08);
        display: grid;
        grid-template-columns: ${IMAGE_WIDTH}px 1fr;
        overflow: hidden;
        box-shadow: 0 18px 50px rgba(0,0,0,0.32);
      }
      .media {
        position: relative;
        background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0));
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }
      .media::after {
        content: "";
        position: absolute;
        inset: 18px;
        border-radius: 28px;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        pointer-events: none;
      }
      .media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 28px;
        background: #0f0f16;
      }
      .panel {
        padding: 42px 38px 34px 34px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        background:
          linear-gradient(180deg, rgba(177, 255, 98, 0.06), rgba(255,255,255,0) 28%),
          rgba(255,255,255,0.02);
      }
      .eyebrow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        letter-spacing: 0.02em;
        font-size: 20px;
      }
      .eyebrow .brand { color: #ffb24d; }
      .eyebrow .meta { color: #8df7a0; }
      .title {
        font-size: 54px;
        line-height: 1.04;
        font-weight: 800;
        letter-spacing: -0.03em;
        max-height: 170px;
        overflow: hidden;
      }
      .subtitle {
        color: rgba(255,255,255,0.68);
        font-size: 20px;
        font-weight: 600;
      }
      .market-box {
        margin-top: auto;
        border-radius: 26px;
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.08);
        padding: 24px 22px 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .market-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(255,255,255,0.78);
        font-size: 17px;
        font-weight: 700;
      }
      .market-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 78px;
        gap: 16px;
        align-items: center;
      }
      .label {
        font-size: 24px;
        line-height: 1.18;
        font-weight: 700;
        color: #fff;
      }
      .chance {
        text-align: right;
        font-size: 30px;
        font-weight: 800;
      }
      .bars {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .bar-wrap {
        display: grid;
        grid-template-columns: 58px 1fr 58px;
        align-items: center;
        gap: 10px;
      }
      .bar-label {
        font-size: 14px;
        font-weight: 700;
        color: rgba(255,255,255,0.76);
      }
      .track {
        height: 12px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255,255,255,0.08);
      }
      .fill-yes, .fill-no {
        height: 100%;
        border-radius: 999px;
      }
      .fill-yes { background: linear-gradient(90deg, #6df88d, #2bd878); }
      .fill-no { background: linear-gradient(90deg, #ff948b, #ff6666); }
      .small-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .mini {
        border-radius: 18px;
        background: rgba(255,255,255,0.04);
        padding: 14px 14px 12px;
      }
      .mini .mini-title {
        font-size: 15px;
        font-weight: 700;
        color: rgba(255,255,255,0.72);
        margin-bottom: 8px;
      }
      .mini .mini-value {
        font-size: 28px;
        font-weight: 800;
      }
    </style>
  </head>
  <body>
    <div class="frame">
      <div class="card">
        <div class="media">
          <img src="${imageUrl}" alt="" />
        </div>
        <div class="panel">
          <div class="eyebrow">
            <span class="brand">폴리마켓나우</span>
            <span class="meta">${category} · ${volume}</span>
          </div>
          <div class="title">${title}</div>
          <div class="subtitle">현재 베팅 확률</div>
          <div class="market-box">
            <div class="market-head">
              <span>Top outcome</span>
              <span>${leftTop.yesProb}% YES</span>
            </div>
            <div class="market-row">
              <div class="label">${escapeHtml(leftTop.label)}</div>
              <div class="chance">${leftTop.yesProb}%</div>
            </div>
            <div class="bars">
              ${renderBar("YES", leftTop.yesProb, "yes")}
              ${renderBar("NO", leftTop.noProb, "no")}
            </div>
            <div class="small-grid">
              <div class="mini">
                <div class="mini-title">두 번째 시나리오</div>
                <div class="mini-value">${escapeHtml(leftBottom.label)}</div>
              </div>
              <div class="mini">
                <div class="mini-title">확률</div>
                <div class="mini-value">${leftBottom.yesProb}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function renderBar(label: string, value: number, tone: "yes" | "no"): string {
  return `<div class="bar-wrap">
    <div class="bar-label">${label}</div>
    <div class="track"><div class="fill-${tone}" style="width:${Math.max(0, Math.min(100, value))}%"></div></div>
    <div class="bar-label" style="text-align:right">${value}%</div>
  </div>`;
}

function topRow(markets: CryptoFeedEvent["markets"], index: number) {
  const market = markets[index];
  if (market) {
    return market;
  }

  return {
    label: index === 0 ? "데이터 준비 중" : "추가 시나리오 없음",
    yesProb: index === 0 ? 50 : 0,
    noProb: index === 0 ? 50 : 100,
  };
}

function resolveDisplayImage(event: CryptoFeedEvent): string {
  return event.thumbnailUrl || event.iconUrl || "https://polymarket.com/favicon.ico";
}

function toCategoryLabel(category: string | undefined): string {
  const normalized = cleanText(category).toLowerCase();

  switch (normalized) {
    case "crypto":
      return "가상자산";
    case "politics":
    case "정치":
      return "정치";
    case "sports":
      return "스포츠";
    case "business":
    case "economy":
    case "경제":
      return "경제";
    default:
      return cleanText(category) || "실시간";
  }
}

function slugifyEventTitle(input: string): string {
  return cleanText(input)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "telegram-card";
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
