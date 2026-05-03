import path from "node:path";

import type { Browser } from "playwright";

import { ensureDir } from "../lib/fs.js";
import type { QaResult, SlideSpec } from "../types.js";
import { newRenderPage } from "./browser.js";
import { renderSlideHtml } from "./html.js";

export async function renderSlides(
  browser: Browser,
  eventId: string,
  slides: SlideSpec[],
  outputDir: string,
): Promise<{ imagePaths: string[]; qa: QaResult[] }> {
  await ensureDir(outputDir);
  const page = await newRenderPage(browser);
  const imagePaths: string[] = [];
  const qa: QaResult[] = [];

  try {
    for (const slide of slides) {
      await page.setContent(renderSlideHtml(slide), { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 2_500 }).catch(() => undefined);
      await page.waitForTimeout(150);

      const slideQa = await inspectSlide(page, eventId, slide.slideNo);
      qa.push(slideQa);

      const filePath = path.join(outputDir, `${String(slide.slideNo).padStart(2, "0")}-${slide.layout}.png`);
      await page.screenshot({ path: filePath, type: "png" });
      imagePaths.push(filePath);
    }
  } finally {
    await page.close();
  }

  return { imagePaths, qa };
}

async function inspectSlide(
  page: Awaited<ReturnType<typeof newRenderPage>>,
  eventId: string,
  slideNo: 1 | 2 | 3 | 4 | 5,
): Promise<QaResult> {
  const warnings = await page.evaluate(() => {
    const results: string[] = [];
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-qa-text]"));

    for (const node of nodes) {
      const overflowY = node.scrollHeight - node.clientHeight > 12;
      const overflowX = node.scrollWidth - node.clientWidth > 12;
      if (overflowY || overflowX) {
        results.push(`Text overflow detected: ${node.dataset.qaText ?? "unknown"}`);
      }
    }

    const headline = document.querySelector<HTMLElement>("[data-qa-text='headline']");
    if (!headline?.textContent?.trim()) {
      results.push("headline is empty");
    }

    return results;
  });

  return {
    eventId,
    slideNo,
    ok: warnings.length === 0,
    warnings,
  };
}
