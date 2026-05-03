import {
  INSTAGRAM_HEIGHT,
  INSTAGRAM_WIDTH,
  SAFE_PADDING_BOTTOM,
  SAFE_PADDING_X,
} from "../config.js";
import type { SlideSpec } from "../types.js";

export function renderSlideHtml(slide: SlideSpec): string {
  const frameClassName = getFrameClassName(slide);
  const backgroundClassName = getBackgroundClassName(slide);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root {
        --width: ${INSTAGRAM_WIDTH}px;
        --height: ${INSTAGRAM_HEIGHT}px;
        --safe-x: ${SAFE_PADDING_X}px;
        --safe-bottom: ${SAFE_PADDING_BOTTOM}px;
        --text: #ffffff;
        --muted: rgba(255,255,255,0.8);
        --panel: rgba(36, 38, 44, 0.95);
        --panel-soft: rgba(38, 41, 47, 0.93);
        --green: #38ff12;
        --green-deep: #1f6d1f;
        --red: #ff2323;
        --red-deep: #5f1d1d;
        --blue: #2ea0ff;
        --track: #1c2127;
        --track-line: #0d1014;
        --purple-a: #cb00e7;
        --purple-b: #b2b5ff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        width: var(--width);
        height: var(--height);
        overflow: hidden;
        color: var(--text);
        background: #000;
        font-family: "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", sans-serif;
      }
      .frame {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
      }
      .frame.hook-page .bg.image {
        background-image:
          linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.08)),
          url("${escapeHtml(slide.imageUrl ?? "")}");
        background-position: center top;
        transform: scale(1.1);
        filter: brightness(1) contrast(1.02);
      }
      .frame.hook-page .vignette {
        background:
          radial-gradient(circle at 50% 52%, transparent 0%, transparent 66%, rgba(0,0,0,0.14) 84%, rgba(0,0,0,0.28) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.1));
      }
      .frame.story-page .vignette {
        background:
          radial-gradient(circle at 50% 48%, transparent 0%, transparent 56%, rgba(0,0,0,0.36) 82%, rgba(0,0,0,0.58) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.32));
      }
      .bg {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 18%, rgba(255,255,255,0.14), transparent 36%),
          linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.8)),
          linear-gradient(135deg, #1b2229 0%, #2d3843 40%, #101317 100%);
        background-size: cover;
        background-position: center;
        transform: scale(1.04);
      }
      .bg.image {
        background-image:
          linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.82)),
          url("${escapeHtml(slide.imageUrl ?? "")}");
      }
      .bg.story-image {
        filter: grayscale(0.02) brightness(0.6);
        opacity: 1;
        transform: scale(1.08);
      }
      .vignette {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 50%, transparent 0%, transparent 48%, rgba(0,0,0,0.82) 74%, rgba(0,0,0,0.96) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.92));
      }
      .content {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
        padding: 30px var(--safe-x) var(--safe-bottom);
      }
      .brand {
        text-align: center;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      .hook-shell,
      .story-shell,
      .context-shell,
      .cta-shell {
        position: absolute;
        inset: 98px var(--safe-x) 70px;
      }
      .status-card {
        width: 860px;
        margin: 0 auto;
        padding: 24px 28px 22px;
        border-radius: 26px;
        background: var(--panel);
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow: 0 18px 38px rgba(0,0,0,0.24);
        backdrop-filter: blur(10px);
      }
      .status-card.compact {
        width: 900px;
        padding: 20px 28px;
        border-radius: 0;
      }
      .status-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }
      .status-left {
        min-width: 0;
      }
      .status-title {
        margin: 0;
        font-size: 32px;
        font-weight: 900;
        line-height: 1.15;
        letter-spacing: -0.05em;
      }
      .status-meta {
        margin-top: 10px;
        color: #8a94a3;
        font-size: 18px;
        font-weight: 700;
      }
      .status-right {
        text-align: right;
        white-space: nowrap;
      }
      .status-probability {
        font-size: 46px;
        font-weight: 900;
        letter-spacing: -0.05em;
      }
      .status-delta {
        margin-top: 4px;
        font-size: 18px;
        font-weight: 900;
      }
      .delta-green { color: #3fe47e; }
      .delta-red { color: #ff6161; }
      .progress-track {
        width: 860px;
        height: 22px;
        margin: 14px auto 0;
        background: var(--track);
        overflow: hidden;
      }
      .progress-track.compact {
        width: 900px;
        height: 14px;
        margin-top: 14px;
        background: var(--track-line);
      }
      .progress-fill {
        height: 100%;
      }
      .fill-left { margin-right: auto; }
      .fill-right { margin-left: auto; }
      .fill-green { background: var(--green); }
      .fill-red { background: var(--red); }
      .fill-blue { background: var(--blue); }
      .category-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 190px;
        padding: 18px 42px;
        border-radius: 999px;
        background: rgba(255,255,255,0.96);
        color: #000;
        font-size: 48px;
        font-weight: 900;
        letter-spacing: -0.05em;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25);
      }
      .hook-shell .category-pill {
        position: absolute;
        left: 50%;
        top: 636px;
        transform: translateX(-50%);
      }
      .hook-event-card {
        width: 940px;
        margin: 116px auto 0;
        padding: 22px 22px 20px;
        background:
          radial-gradient(circle at 50% 0%, rgba(255,255,255,0.14), transparent 34%),
          linear-gradient(180deg, #2758eb 0%, #2350de 100%);
        box-shadow: 0 24px 46px rgba(0,0,0,0.28);
        position: relative;
        overflow: hidden;
        border-radius: 0;
      }
      .hook-event-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px);
        background-size: 14px 14px;
        background-position: 7px 7px;
        opacity: 0.35;
      }
      .hook-panel-surface {
        position: relative;
        z-index: 1;
        padding: 24px 26px 18px;
        border-radius: 30px 30px 0 0;
        background:
          linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),
          rgba(36, 38, 46, 0.98);
        border: 1px solid rgba(255,255,255,0.03);
      }
      .hook-panel-surface::after,
      .story-text-card::after,
      .summary-card::after {
        content: "";
        position: absolute;
        right: 22px;
        top: -10px;
        width: 26px;
        height: 84px;
        border: 3px solid rgba(255,255,255,0.7);
        border-radius: 18px;
        box-shadow:
          inset 0 0 0 2px rgba(0,0,0,0.18),
          0 6px 12px rgba(0,0,0,0.2);
        opacity: 0.86;
        transform: rotate(-10deg);
      }
      .hook-event-title {
        margin: 0 0 18px;
        font-size: 24px;
        font-weight: 900;
        line-height: 1.16;
        letter-spacing: -0.04em;
        text-align: center;
      }
      .hook-event-row {
        display: grid;
        grid-template-columns: 1fr auto auto auto;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
        font-size: 21px;
      }
      .hook-event-label {
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      .hook-event-probability {
        font-size: 26px;
        font-weight: 900;
      }
      .hook-split-track {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 30px;
        margin: 0;
        background: rgba(15,18,24,0.98);
        display: flex;
        overflow: hidden;
        border-radius: 0 0 24px 24px;
      }
      .hook-split-fill-green { background: var(--green); }
      .hook-split-fill-red { background: var(--red); }
      .hook-wordmark {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 16px;
        color: rgba(255,255,255,0.96);
        font-size: 23px;
        font-weight: 800;
        letter-spacing: -0.03em;
      }
      .hook-wordmark-mark {
        width: 26px;
        height: 22px;
        display: inline-block;
      }
      .hook-wordmark-mark svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .story-guide {
        width: 900px;
        margin: 54px auto 0;
        padding: 0;
        border-radius: 0;
        background: transparent;
      }
      .story-guide .status-card.compact,
      .summary-section .status-card.compact {
        width: 100%;
        border-radius: 0;
        box-shadow: none;
      }
      .story-guide .progress-track.compact,
      .summary-section .progress-track.compact {
        width: 100%;
        height: 14px;
        margin-top: 14px;
      }
      .story-text-card {
        margin-top: 18px;
        background: var(--panel-soft);
        border-radius: 28px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.05);
        box-shadow: 0 18px 36px rgba(0,0,0,0.18);
        position: relative;
      }
      .story-chart-card {
        margin-top: 18px;
        background: var(--panel-soft);
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.04);
        box-shadow: 0 16px 30px rgba(0,0,0,0.16);
      }
      .story-chart-divider {
        height: 8px;
        margin-top: 12px;
        background: rgba(255,255,255,0.95);
      }
      .summary-page {
        width: 900px;
        margin: 52px auto 0;
      }
      .summary-section {
        margin-bottom: 16px;
      }
      .summary-fill {
        height: 74px;
        margin-top: 14px;
        background: var(--track);
        overflow: hidden;
      }
      .summary-fill-bar {
        height: 100%;
      }
      .summary-card {
        margin-top: 14px;
        background: var(--panel-soft);
        border-radius: 26px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.05);
        box-shadow: 0 18px 34px rgba(0,0,0,0.18);
        position: relative;
      }
      .summary-card .panel-pill.left {
        top: 16px;
        left: 18px;
      }
      .summary-card .panel-pill.right {
        top: 16px;
        right: 18px;
      }
      .summary-section .status-card.compact {
        padding: 16px 22px;
      }
      .summary-section .status-title {
        font-size: 24px;
      }
      .summary-section .status-meta {
        font-size: 15px;
      }
      .summary-section .status-probability {
        font-size: 40px;
      }
      .summary-section .status-delta {
        font-size: 16px;
      }
      .summary-section .panel-strip {
        height: 82px;
      }
      .summary-section .panel-body {
        padding: 28px 38px 30px;
      }
      .summary-section .panel-paragraph {
        margin: 0 0 16px;
        font-size: 25px;
        line-height: 1.56;
      }
      .hook-copy {
        position: absolute;
        left: 50%;
        bottom: 36px;
        width: 980px;
        transform: translateX(-50%);
        text-align: center;
      }
      .hook-title {
        margin: 0;
        font-size: 140px;
        line-height: 0.95;
        font-weight: 900;
        letter-spacing: -0.075em;
        white-space: pre-line;
        word-break: keep-all;
        text-shadow:
          0 6px 18px rgba(0,0,0,0.45),
          0 2px 6px rgba(0,0,0,0.35);
      }
      .hook-title.ko-long {
        font-size: 120px;
      }
      .hook-title.ko-xlong {
        font-size: 106px;
      }
      .hook-subtitle {
        margin: 26px auto 0;
        width: 930px;
        color: rgba(255,255,255,0.88);
        font-size: 32px;
        line-height: 1.45;
        text-shadow: 0 3px 10px rgba(0,0,0,0.32);
      }
      .story-shell .category-pill,
      .context-shell .category-pill {
        position: absolute;
        left: 50%;
        top: 384px;
        transform: translateX(-50%);
      }
      .analysis-panel,
      .context-panel {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 920px;
        background: var(--panel-soft);
        border-radius: 0;
        overflow: hidden;
        box-shadow: 0 18px 36px rgba(0,0,0,0.28);
      }
      .analysis-panel {
        top: 438px;
        min-height: 342px;
      }
      .context-panel {
        top: 332px;
        min-height: 292px;
      }
      .context-panel.bottom {
        top: 798px;
        min-height: 292px;
      }
      .panel-strip {
        position: relative;
        height: 96px;
      }
      .strip-green { background: var(--green-deep); }
      .strip-red { background: var(--red-deep); }
      .strip-blue { background: #143558; }
      .panel-pill {
        position: absolute;
        top: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 240px;
        max-width: 720px;
        padding: 14px 30px;
        border-radius: 999px;
        background: rgba(255,255,255,0.96);
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -0.04em;
        box-shadow: 0 12px 26px rgba(0,0,0,0.18);
      }
      .panel-pill.left { left: 26px; }
      .panel-pill.right { right: 26px; }
      .panel-pill.center {
        left: 50%;
        transform: translateX(-50%);
      }
      .pill-green { color: var(--green); }
      .pill-red { color: var(--red); }
      .pill-blue { color: var(--blue); }
      .panel-body {
        padding: 44px 52px 54px;
      }
      .panel-content {
        display: block;
      }
      .panel-content.with-illustration {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 34px;
        align-items: end;
      }
      .panel-illustration {
        display: flex;
        align-items: end;
        justify-content: center;
        min-height: 260px;
      }
      .panel-illustration img {
        width: 100%;
        max-width: 280px;
        max-height: 250px;
        object-fit: contain;
        filter: drop-shadow(0 16px 26px rgba(0,0,0,0.42));
      }
      .panel-copy {
        min-width: 0;
      }
      .panel-paragraph {
        margin: 0 0 28px;
        font-size: 30px;
        line-height: 1.68;
        font-weight: 700;
        letter-spacing: -0.04em;
        word-break: keep-all;
      }
      .context-chart {
        position: absolute;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
        width: 920px;
        height: 284px;
        background: var(--panel-soft);
        box-shadow: 0 18px 36px rgba(0,0,0,0.28);
        overflow: hidden;
      }
      .analysis-chart {
        position: absolute;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
        width: 920px;
        height: 264px;
        background: var(--panel-soft);
        box-shadow: 0 18px 36px rgba(0,0,0,0.28);
        overflow: hidden;
      }
      .chart-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 24px 28px 0;
      }
      .chart-label {
        color: var(--blue);
        font-size: 24px;
        font-weight: 900;
      }
      .chart-delta {
        color: #67df87;
        font-size: 14px;
        font-weight: 900;
        margin-left: 8px;
      }
      .chart-brand {
        color: rgba(255,255,255,0.18);
        font-size: 14px;
        font-weight: 900;
      }
      .chart-svg {
        width: 100%;
        height: 220px;
        display: block;
      }
      .chart-axis {
        display: flex;
        justify-content: space-between;
        padding: 0 28px 16px;
        color: rgba(255,255,255,0.35);
        font-size: 12px;
        font-weight: 700;
      }
      .cta-shell {
        text-align: center;
      }
      .cta-badge {
        display: inline-flex;
        padding: 26px 44px;
        margin-top: 132px;
        background: linear-gradient(90deg, var(--purple-a), var(--purple-b));
        font-size: 66px;
        font-weight: 900;
        letter-spacing: -0.06em;
      }
      .cta-title {
        margin: 38px 0 24px;
        font-size: 76px;
        line-height: 1.05;
        font-weight: 900;
        letter-spacing: -0.06em;
      }
      .cta-subtitle {
        margin: 0 auto 42px;
        width: 780px;
        color: var(--muted);
        font-size: 30px;
        line-height: 1.5;
      }
      .follow-card {
        display: grid;
        grid-template-columns: 132px 1fr 220px;
        align-items: center;
        gap: 24px;
        width: 940px;
        margin: 0 auto 68px;
        padding: 28px 32px;
        background: #11161c;
        text-align: left;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,0.04);
        box-shadow: 0 20px 40px rgba(0,0,0,0.18);
      }
      .logo-box {
        width: 96px;
        height: 96px;
        background: #000;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: 900;
        line-height: 0.88;
        letter-spacing: -0.08em;
      }
      .follow-meta-title {
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -0.03em;
      }
      .follow-meta-sub {
        color: #8f96a3;
        font-size: 22px;
        font-weight: 700;
        margin-top: 6px;
      }
      .follow-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 24px 0;
        border-radius: 18px;
        background: linear-gradient(180deg, #5862ff, #4850d7);
        font-size: 30px;
        font-weight: 900;
      }
      .cta-list {
        width: 900px;
        margin: 0 auto;
        text-align: left;
      }
      .cta-item {
        display: grid;
        grid-template-columns: 86px 1fr;
        gap: 26px;
        align-items: center;
        margin-bottom: 44px;
        font-size: 36px;
        font-weight: 900;
        letter-spacing: -0.05em;
      }
      .check {
        width: 72px;
        height: 72px;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 30%, #c57cff, #7418ff);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
      }
      [data-qa-text] {
        overflow-wrap: anywhere;
      }
    </style>
  </head>
  <body>
    <main class="${frameClassName}">
      <div class="${backgroundClassName}"></div>
      <div class="vignette"></div>
      <div class="content">
        <div class="brand">${escapeHtml(slide.brandLine ?? "")}</div>
        ${renderLayout(slide)}
      </div>
    </main>
  </body>
</html>`;
}

function renderLayout(slide: SlideSpec): string {
  switch (slide.layout) {
    case "hook":
      return renderHook(slide);
    case "breakdown":
      return renderAnalysis(slide, slide.highlightTone ?? "green", "left");
    case "insight":
      return renderAnalysis(slide, slide.highlightTone ?? "red", "right");
    case "context":
      return renderContext(slide);
    case "source":
      return renderCta(slide);
  }
}

function renderHook(slide: SlideSpec): string {
  return `
    <section class="hook-shell">
      ${renderHookEventCard(slide.marketSnapshot)}
      ${slide.categoryLabel ? `<div class="category-pill">${escapeHtml(slide.categoryLabel)}</div>` : ""}
      <div class="hook-copy">
        <h1 class="${getHookTitleClassName(slide.headline)}" data-qa-text="headline">${escapeHtml(slide.headline)}</h1>
        ${slide.subheadline ? `<p class="hook-subtitle" data-qa-text="subheadline">${escapeHtml(slide.subheadline)}</p>` : ""}
      </div>
    </section>
  `;
}

function renderAnalysis(
  slide: SlideSpec,
  tone: NonNullable<SlideSpec["highlightTone"]>,
  pillAlign: "left" | "right",
): string {
  return `
    <section class="story-shell">
      <div class="story-guide">
        ${renderStatusCard(slide.marketSnapshot, {
          compact: true,
          tone,
          progressValue: slide.progressValue ?? parseProgressValue(slide.marketSnapshot),
          progressDirection: slide.progressDirection ?? (tone === "red" ? "right" : "left"),
        })}
        <div class="story-text-card">
          <div class="panel-strip ${tone === "red" ? "strip-red" : "strip-green"}">
            <div class="panel-pill center ${tone === "red" ? "pill-red" : "pill-green"}" data-qa-text="headline">${escapeHtml(slide.headline)}</div>
          </div>
          <div class="panel-body">
            <div class="panel-content ${slide.illustrationImageUrl ? "with-illustration" : ""}">
              ${slide.illustrationImageUrl ? `
                <div class="panel-illustration">
                  <img src="${escapeHtml(slide.illustrationImageUrl)}" alt="" />
                </div>
              ` : ""}
              <div class="panel-copy">
                ${(slide.body ?? []).map((paragraph) => `<p class="panel-paragraph" data-qa-text="body">${escapeHtml(paragraph)}</p>`).join("")}
              </div>
            </div>
          </div>
        </div>
        <div class="story-chart-divider"></div>
        <div class="story-chart-card">
          <div class="chart-head">
            <div class="chart-label">
              ${escapeHtml(slide.chartLabel ?? `${slide.progressValue ?? parseProgressValue(slide.marketSnapshot)}% 가능성`)}
              ${slide.chartDeltaText ? `<span class="chart-delta">${escapeHtml(slide.chartDeltaText)}</span>` : ""}
            </div>
            <div class="chart-brand">Polymarket</div>
          </div>
          ${renderChartSvg(slide.chartPoints ?? defaultChartPoints(slide))}
        </div>
      </div>
    </section>
  `;
}

function renderContext(slide: SlideSpec): string {
  return `
    <section class="context-shell">
      <div class="summary-page">
        <div class="summary-section">
          ${renderStatusCard(slide.marketSnapshot, {
            compact: true,
            tone: "green",
            progressValue: slide.progressValue ?? parseProgressValue(slide.marketSnapshot),
            progressDirection: "left",
          })}
          <div class="summary-fill">
            <div class="summary-fill-bar fill-green" style="width:${slide.progressValue ?? parseProgressValue(slide.marketSnapshot)}%"></div>
          </div>
          <div class="summary-card">
            <div class="panel-strip strip-green">
              <div class="panel-pill left pill-green" data-qa-text="headline">${escapeHtml(slide.headline)}</div>
            </div>
            <div class="panel-body">
              ${(slide.body ?? []).map((paragraph) => `<p class="panel-paragraph" data-qa-text="body">${escapeHtml(paragraph)}</p>`).join("")}
            </div>
          </div>
        </div>
        <div class="summary-section">
          ${slide.secondaryMarketSnapshot ? renderStatusCard(slide.secondaryMarketSnapshot, {
            compact: true,
            tone: "red",
            progressValue: slide.secondaryProgressValue ?? parseProgressValue(slide.secondaryMarketSnapshot),
            progressDirection: "right",
          }) : ""}
          <div class="summary-fill">
            <div class="summary-fill-bar fill-red fill-right" style="width:${slide.secondaryProgressValue ?? parseProgressValue(slide.secondaryMarketSnapshot)}%"></div>
          </div>
          <div class="summary-card">
            <div class="panel-strip strip-red">
              <div class="panel-pill right pill-green" data-qa-text="headline">${escapeHtml(slide.secondaryHeadline ?? "반대 시나리오")}</div>
            </div>
            <div class="panel-body">
              ${(slide.secondaryBody ?? []).map((paragraph) => `<p class="panel-paragraph" data-qa-text="body">${escapeHtml(paragraph)}</p>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCta(slide: SlideSpec): string {
  return `
    <section class="cta-shell">
      ${slide.badgeLabel ? `<div class="cta-badge" data-qa-text="badge">${escapeHtml(slide.badgeLabel)}</div>` : ""}
      <h1 class="cta-title" data-qa-text="headline">${escapeHtml(slide.headline)}</h1>
      ${slide.subheadline ? `<p class="cta-subtitle" data-qa-text="subheadline">${escapeHtml(slide.subheadline)}</p>` : ""}
      <div class="follow-card">
        <div class="logo-box">
          <div>POLY</div>
          <div>NOW</div>
        </div>
        <div>
          <div class="follow-meta-title">@polymarket.now</div>
          <div class="follow-meta-sub">폴리마켓나우 | 매일 보는 예측시장 카드뉴스</div>
        </div>
        <div class="follow-button">팔로우</div>
      </div>
      <div class="cta-list">
        ${(slide.ctaItems ?? []).map((item) => `
          <div class="cta-item" data-qa-text="cta-item">
            <div class="check">✓</div>
            <div>${escapeHtml(item)}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderStatusCard(
  snapshot: SlideSpec["marketSnapshot"],
  options: {
    compact: boolean;
    tone: NonNullable<SlideSpec["highlightTone"]>;
    progressValue: number;
    progressDirection: NonNullable<SlideSpec["progressDirection"]>;
  },
): string {
  if (!snapshot) {
    return "";
  }

  const deltaClassName = options.tone === "red" ? "delta-red" : "delta-green";

  return `
    <div class="status-card ${options.compact ? "compact" : ""}">
      <div class="status-row">
        <div class="status-left">
          <div class="status-title">${escapeHtml(snapshot.title)}</div>
          ${snapshot.volumeText ? `<div class="status-meta">${escapeHtml(snapshot.volumeText)}</div>` : ""}
        </div>
        <div class="status-right">
          ${snapshot.probabilityText ? `<div class="status-probability">${escapeHtml(snapshot.probabilityText)}</div>` : ""}
          ${snapshot.deltaText ? `<div class="status-delta ${deltaClassName}">${escapeHtml(snapshot.deltaText)}</div>` : ""}
        </div>
      </div>
    </div>
    <div class="progress-track ${options.compact ? "compact" : ""}">
      <div class="progress-fill ${options.progressDirection === "right" ? "fill-right" : "fill-left"} ${getFillClassName(options.tone)}" style="width:${Math.max(0, Math.min(100, options.progressValue))}%"></div>
    </div>
  `;
}

function renderHookEventCard(snapshot: SlideSpec["marketSnapshot"]): string {
  if (!snapshot) {
    return "";
  }

  const first = snapshot.rows?.[0];
  const firstWidth = Math.max(0, Math.min(100, first?.yesProb ?? parseProgressValue(snapshot)));
  const secondWidth = Math.max(0, 100 - firstWidth);

  return `
    <div class="hook-event-card">
      <div class="hook-panel-surface">
        <h2 class="hook-event-title">${escapeHtml(snapshot.title)}</h2>
        ${(snapshot.rows ?? []).slice(0, 2).map((row) => `
          <div class="hook-event-row">
            <div class="hook-event-label">${escapeHtml(row.label)}</div>
            <div class="hook-event-probability">${row.yesProb}%</div>
            <div class="chip yes">예</div>
            <div class="chip no">아니오</div>
          </div>
        `).join("")}
        <div class="floating-footer">
          <span>${escapeHtml(snapshot.volumeText ?? "")}</span>
          <span>${escapeHtml(snapshot.deltaText ?? "")}</span>
        </div>
      </div>
      <div class="hook-split-track">
        <div class="hook-split-fill-green" style="width:${firstWidth}%"></div>
        <div class="hook-split-fill-red" style="width:${secondWidth}%"></div>
      </div>
      <div class="hook-wordmark">
        <span class="hook-wordmark-mark" aria-hidden="true">
          <svg viewBox="0 0 28 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2 12 9 4h8l7 8-7 8H9Z" fill="none" stroke="white" stroke-width="2.2" stroke-linejoin="round"/>
            <path d="M9 4v16M17 4v16M2 12h22" fill="none" stroke="white" stroke-width="2.2" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>Polymarket</span>
      </div>
    </div>
  `;
}

function renderAnalysisChart(slide: SlideSpec): string {
  return `
    <div class="analysis-chart">
      <div class="chart-head">
        <div class="chart-label">
          ${escapeHtml(slide.chartLabel ?? `${slide.progressValue ?? parseProgressValue(slide.marketSnapshot)}% 가능성`)}
          ${slide.chartDeltaText ? `<span class="chart-delta">${escapeHtml(slide.chartDeltaText)}</span>` : ""}
        </div>
        <div class="chart-brand">Polymarket</div>
        </div>
        ${renderChartSvg(slide.chartPoints ?? defaultChartPoints(slide))}
        <div class="chart-axis">
          <span>3월</span>
          <span>4월</span>
          <span>5월</span>
          <span>6월</span>
        </div>
      </div>
  `;
}

function renderChartSvg(points: number[]): string {
  const width = 920;
  const height = 220;
  const paddingX = 34;
  const paddingY = 22;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const safePoints = points.length > 1 ? points : [50, 54, 52, 58, 61, 64, 66, 68];
  const maxValue = Math.max(...safePoints, 100);
  const minValue = Math.min(...safePoints, 0);
  const range = Math.max(1, maxValue - minValue);

  const coordinates = safePoints.map((point, index) => {
    const x = paddingX + (innerWidth / (safePoints.length - 1)) * index;
    const y = height - paddingY - ((point - minValue) / range) * innerHeight;
    return { x, y };
  });
  const polyline = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");
  const lastPoint = coordinates.at(-1) ?? { x: width - paddingX, y: height / 2 };

  const gridLines = [0.2, 0.4, 0.6, 0.8].map((ratio) => {
    const y = paddingY + innerHeight * ratio;
    return `<line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;
  }).join("");

  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${gridLines}
      <polyline fill="none" stroke="#248dff" stroke-width="4" points="${polyline}" />
      <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="7" fill="#248dff" />
    </svg>
  `;
}

function getFrameClassName(slide: SlideSpec): string {
  if (slide.layout === "hook") {
    return "frame hook-page";
  }

  if (slide.layout === "breakdown" || slide.layout === "insight" || slide.layout === "context") {
    return "frame story-page";
  }

  return "frame";
}

function getBackgroundClassName(slide: SlideSpec): string {
  const classes = ["bg"];

  if (slide.imageUrl) {
    classes.push("image");
  }

  if (slide.layout === "breakdown" || slide.layout === "insight" || slide.layout === "context") {
    classes.push("story-image");
  }

  return classes.join(" ");
}

function getHookTitleClassName(headline: string): string {
  const classNames = ["hook-title"];
  const normalizedLength = headline.replaceAll("\n", "").length;

  if (normalizedLength >= 22) {
    classNames.push("ko-xlong");
  } else if (normalizedLength >= 16) {
    classNames.push("ko-long");
  }

  return classNames.join(" ");
}

function getStripClassName(tone: NonNullable<SlideSpec["highlightTone"]>): string {
  if (tone === "red") {
    return "strip-red";
  }
  if (tone === "blue") {
    return "strip-blue";
  }
  return "strip-green";
}

function getPillClassName(tone: NonNullable<SlideSpec["highlightTone"]>): string {
  if (tone === "red") {
    return "pill-red";
  }
  if (tone === "blue") {
    return "pill-blue";
  }
  return "pill-green";
}

function getFillClassName(tone: NonNullable<SlideSpec["highlightTone"]>): string {
  if (tone === "red") {
    return "fill-red";
  }
  if (tone === "blue") {
    return "fill-blue";
  }
  return "fill-green";
}

function parseProgressValue(snapshot: SlideSpec["marketSnapshot"]): number {
  if (!snapshot?.probabilityText) {
    return 50;
  }

  const match = snapshot.probabilityText.match(/(\d+(?:\.\d+)?)%/);
  return match ? Number.parseFloat(match[1] ?? "50") : 50;
}

function defaultChartPoints(slide: SlideSpec): number[] {
  const base = slide.progressValue ?? parseProgressValue(slide.marketSnapshot);
  const second = slide.marketSnapshot?.rows?.[1]?.yesProb ?? Math.max(0, base - 8);

  return [
    Math.max(0, base - 18),
    Math.max(0, base - 18),
    Math.max(0, base - 17),
    Math.max(0, base - 16),
    Math.max(0, base - 15),
    Math.max(0, base - 14),
    Math.max(0, base - 12),
    Math.max(0, second),
    Math.max(0, second + 1),
    Math.max(0, second + 3),
    Math.max(0, second + 2),
    Math.max(0, base - 3),
    Math.max(0, base - 2),
    Math.max(0, base - 1),
    Math.max(0, base),
    Math.max(0, base + 1),
  ];
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
