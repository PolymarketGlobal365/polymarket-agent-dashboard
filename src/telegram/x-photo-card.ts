import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ensureDir } from "../lib/fs.js";
import { launchRenderingBrowser } from "../render/browser.js";
import type { XTimelineTweet } from "../x/profile.js";

const CARD_WIDTH = 1080;
const VIEWPORT_HEIGHT = 900;

export type RenderPolymarketTweetCardOptions = {
  translatedText?: string;
  hashtag?: string;
};

export async function renderPolymarketTweetPhotoCard(
  tweet: XTimelineTweet,
  _options: RenderPolymarketTweetCardOptions = {},
): Promise<string | undefined> {
  const browser = await launchRenderingBrowser();
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-x-card-"));
  const outputPath = path.join(outputDir, `${tweet.tweetId}.png`);

  try {
    await ensureDir(outputDir);
    const page = await browser.newPage({
      viewport: {
        width: CARD_WIDTH,
        height: VIEWPORT_HEIGHT,
      },
      deviceScaleFactor: 1,
    });

    try {
      await page.setContent(renderCardHtml(tweet), { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => undefined);
      await page.waitForTimeout(200);
      await page.locator(".frame").screenshot({ path: outputPath, type: "png" });
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

function renderCardHtml(tweet: XTimelineTweet): string {
  const originalText = escapeHtml(normalizeTweetText(tweet.text) || "Post update").replace(/\n/g, "<br />");
  const avatarUrl = tweet.avatarUrl ? escapeHtml(tweet.avatarUrl) : undefined;
  const authorName = escapeHtml(tweet.authorName || fallbackName(tweet));
  const authorHandle = escapeHtml(tweet.authorHandle || "@unknown");

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
      html, body {
        margin: 0;
        background:
          radial-gradient(circle at top left, rgba(88, 96, 255, 0.18), transparent 26%),
          linear-gradient(180deg, #050507 0%, #101017 100%);
        color: #f4f4fa;
      }
      body {
        width: ${CARD_WIDTH}px;
      }
      .frame {
        width: ${CARD_WIDTH}px;
        padding: 28px;
      }
      .card {
        width: 100%;
        background: #0a0a0d;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 24px;
        overflow: hidden;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 26px 28px 20px;
      }
      .back {
        font-size: 34px;
        color: rgba(255,255,255,0.92);
        font-weight: 800;
      }
      .compose {
        color: rgba(255,255,255,0.95);
        font-size: 36px;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .placeholder {
        width: 34px;
      }
      .account {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 0 28px 22px;
      }
      .account-left {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0;
      }
      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 999px;
        overflow: hidden;
        background: linear-gradient(135deg, #1288ff, #5d2dff);
        flex: none;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .identity {
        min-width: 0;
      }
      .name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 25px;
        font-weight: 800;
      }
      .verified {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 999px;
        background: #1d9bf0;
        color: #fff;
        font-size: 13px;
        font-weight: 800;
      }
      .handle {
        margin-top: 4px;
        color: rgba(255,255,255,0.56);
        font-size: 21px;
        font-weight: 600;
      }
      .follow {
        padding: 13px 24px;
        border-radius: 999px;
        background: #fff;
        color: #0a0a0d;
        font-size: 22px;
        font-weight: 800;
      }
      .content {
        padding: 0 28px 30px;
      }
      .headline {
        color: #f5f5f7;
        font-size: 26px;
        line-height: 1.18;
        font-weight: 800;
        letter-spacing: -0.02em;
        text-transform: uppercase;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <div class="frame">
      <div class="card">
        <div class="topbar">
          <div class="back">←</div>
          <div class="compose">게시하기</div>
          <div class="placeholder"></div>
        </div>
        <div class="account">
          <div class="account-left">
            <div class="avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="" />` : ""}</div>
            <div class="identity">
              <div class="name">
                <span>${authorName}</span>
                <span class="verified">✓</span>
              </div>
              <div class="handle">${authorHandle}</div>
            </div>
          </div>
          <div class="follow">구독하기</div>
        </div>
        <div class="content">
          <div class="headline">${originalText}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function fallbackName(tweet: XTimelineTweet): string {
  return (tweet.authorHandle || "@unknown").replace(/^@/, "");
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTweetText(input: string): string {
  return (input || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
