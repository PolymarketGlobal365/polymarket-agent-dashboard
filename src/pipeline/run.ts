import path from "node:path";

import {
  DEFAULT_API_URL,
  DEFAULT_OUTPUT_ROOT,
  DEFAULT_SOURCE_URL,
  MAX_EVENTS_PER_RUN,
} from "../config.js";
import { readJsonIfExists } from "../lib/fs.js";
import { writeRunArtifacts } from "../artifacts/write.js";
import { crawlPolymarketApi, crawlPolymarketFromApiPayload } from "../polymarket/crawl.js";
import { launchRenderingBrowser } from "../render/browser.js";
import { renderSlides } from "../render/render.js";
import type { EventArtifacts, RunManifest, ScrapedCard } from "../types.js";
import { normalizeCards } from "./normalize.js";
import { selectTopEvents } from "./rank.js";
import { buildSlidesForEvent } from "./slides.js";

export type RunOptions = {
  sourceUrl?: string;
  apiUrl?: string;
  outputRoot?: string;
  fixturePayload?: unknown;
  runId?: string;
  skipSnapshotFallback?: boolean;
  bullImagePath?: string;
  bearImagePath?: string;
};

export async function runPipeline(options: RunOptions = {}): Promise<RunManifest> {
  const outputRoot = options.outputRoot ?? DEFAULT_OUTPUT_ROOT;
  const sourceUrl = options.sourceUrl ?? DEFAULT_SOURCE_URL;
  const apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  const runId = options.runId ?? createRunId();
  const warnings: string[] = [];

  let rawCards: ScrapedCard[];
  let usedFallbackSnapshot = false;

  try {
    const crawlResult = options.fixturePayload
      ? await crawlPolymarketFromApiPayload(options.fixturePayload, sourceUrl)
      : await crawlPolymarketApi({ apiUrl, sourceUrl });
    rawCards = crawlResult.cards;
    warnings.push(...crawlResult.warnings);
  } catch (error) {
    if (options.skipSnapshotFallback) {
      throw error;
    }

    const snapshotPath = path.join(outputRoot, "snapshots", "latest-raw-cards.json");
    const fallback = await readJsonIfExists<ScrapedCard[]>(snapshotPath);
    if (!fallback || fallback.length === 0) {
      throw error;
    }

    rawCards = fallback;
    usedFallbackSnapshot = true;
    warnings.push("Live API fetch failed; used the last successful snapshot.");
  }

  const normalized = normalizeCards(rawCards);
  warnings.push(...normalized.warnings);

  const selectedEvents = selectTopEvents(normalized.events, MAX_EVENTS_PER_RUN);
  if (selectedEvents.length < MAX_EVENTS_PER_RUN) {
    warnings.push(`Only ${selectedEvents.length} valid events were generated.`);
  }

  const browser = await launchRenderingBrowser();
  const eventArtifacts: EventArtifacts[] = [];

  try {
    for (const event of selectedEvents) {
      const slides = buildSlidesForEvent(event, {
        ...(options.bullImagePath ? { bullImagePath: options.bullImagePath } : {}),
        ...(options.bearImagePath ? { bearImagePath: options.bearImagePath } : {}),
      });
      const outputDir = path.join(outputRoot, "runs", runId, "events", event.eventId);
      const rendered = await renderSlides(browser, event.eventId, slides, outputDir);
      eventArtifacts.push({
        event,
        slides,
        qa: rendered.qa,
        imagePaths: rendered.imagePaths,
      });
    }
  } finally {
    await browser.close();
  }

  const manifest: RunManifest = {
    runId,
    generatedAt: new Date().toISOString(),
    source: apiUrl,
    selectedEvents,
    warnings,
    outputDir: path.join(outputRoot, "runs", runId),
    usedFallbackSnapshot,
  };

  await writeRunArtifacts({
    outputRoot,
    runId,
    rawCards,
    normalizedEvents: normalized.events,
    eventArtifacts,
    manifest,
  });

  return manifest;
}

function createRunId(): string {
  const iso = new Date().toISOString().replace(/[:.]/g, "-");
  return `run-${iso}`;
}
