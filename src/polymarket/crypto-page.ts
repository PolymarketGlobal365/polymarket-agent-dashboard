import type { Page } from "playwright";

import { DEFAULT_CRYPTO_SOURCE_URL } from "../config.js";
import { cleanText, toAbsoluteUrl, truncate } from "../lib/strings.js";
import { launchRenderingBrowser } from "../render/browser.js";

const DEFAULT_SHOW_MORE_CLICKS = 24;
const DEFAULT_LOAD_WAIT_MS = 2_500;
const DEFAULT_EXPAND_WAIT_MS = 1_200;
const DEFAULT_NAVIGATION_TIMEOUT_MS = 60_000;

export type RawCryptoEventAnchor = {
  href: string;
  text: string;
  imageSrc?: string;
  order: number;
};

export type CryptoPageEvent = {
  eventTitle: string;
  eventUrl: string;
  thumbnailUrl?: string;
  sourcePage: string;
  scrapedAt: string;
};

export type CrawlCryptoPageOptions = {
  sourceUrl?: string;
  maxEvents?: number;
  maxShowMoreClicks?: number;
  loadWaitMs?: number;
  expandWaitMs?: number;
};

export type CrawlCryptoPageResult = {
  events: CryptoPageEvent[];
  warnings: string[];
};

export async function crawlCryptoPageEvents(
  options: CrawlCryptoPageOptions = {},
): Promise<CrawlCryptoPageResult> {
  const sourceUrl = options.sourceUrl ?? DEFAULT_CRYPTO_SOURCE_URL;
  const browser = await launchRenderingBrowser();
  const warnings: string[] = [];

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 1400,
      },
    });

    await page.goto(sourceUrl, {
      waitUntil: "domcontentloaded",
      timeout: DEFAULT_NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForTimeout(options.loadWaitMs ?? DEFAULT_LOAD_WAIT_MS);

    const showMoreClicks = await expandCryptoPage(page, {
      maxClicks: options.maxShowMoreClicks ?? DEFAULT_SHOW_MORE_CLICKS,
      waitMs: options.expandWaitMs ?? DEFAULT_EXPAND_WAIT_MS,
    });

    if (showMoreClicks > 0) {
      warnings.push(`Expanded the crypto page ${showMoreClicks} times before collecting events.`);
    }

    const rawAnchors = await page.evaluate<RawCryptoEventAnchor[]>(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/event/"]')).map(
        (anchor, order) => ({
          href: anchor.getAttribute("href") ?? "",
          text: anchor.textContent ?? "",
          imageSrc: anchor.querySelector("img")?.getAttribute("src") ?? "",
          order,
        }),
      ),
    );

    const events = normalizeCryptoEventAnchors(rawAnchors, sourceUrl);
    const limitedEvents = options.maxEvents ? events.slice(0, options.maxEvents) : events;

    if (limitedEvents.length === 0) {
      warnings.push("No crypto event links were found on the page.");
    }

    return {
      events: limitedEvents,
      warnings,
    };
  } finally {
    await browser.close();
  }
}

export function normalizeCryptoEventAnchors(
  rawAnchors: RawCryptoEventAnchor[],
  sourceUrl = DEFAULT_CRYPTO_SOURCE_URL,
  scrapedAt = new Date().toISOString(),
): CryptoPageEvent[] {
  const bestByUrl = new Map<
    string,
    {
      title: string;
      imageSrc?: string;
      order: number;
      score: number;
    }
  >();

  for (const anchor of rawAnchors) {
    const href = cleanText(anchor.href);
    const title = cleanText(anchor.text);
    const imageSrc = cleanText(anchor.imageSrc);
    if (!href || !href.includes("/event/")) {
      continue;
    }

    const eventUrl = toRootEventUrl(href, sourceUrl);
    if (!eventUrl) {
      continue;
    }

    const existing = bestByUrl.get(eventUrl);
    if (!title) {
      if (imageSrc && existing && !existing.imageSrc) {
        existing.imageSrc = imageSrc;
      } else if (imageSrc && !existing) {
        bestByUrl.set(eventUrl, {
          title: "",
          imageSrc,
          order: anchor.order,
          score: Number.NEGATIVE_INFINITY,
        });
      }
      continue;
    }

    const score = scoreAnchorTitle(title);

    if (!existing || score > existing.score || (score === existing.score && title.length > existing.title.length)) {
      const candidate: {
        title: string;
        imageSrc?: string;
        order: number;
        score: number;
      } = {
        title,
        order: anchor.order,
        score,
      };

      const mergedImageSrc = imageSrc || existing?.imageSrc;
      if (mergedImageSrc) {
        candidate.imageSrc = mergedImageSrc;
      }

      bestByUrl.set(eventUrl, candidate);
      continue;
    }

    if (imageSrc && !existing.imageSrc) {
      existing.imageSrc = imageSrc;
    }
  }

  return [...bestByUrl.entries()]
    .map(([eventUrl, candidate]) => ({
      eventTitle: truncate(candidate.title, 180),
      eventUrl,
      ...(candidate.imageSrc ? { thumbnailUrl: toAbsoluteUrl(candidate.imageSrc, sourceUrl) } : {}),
      sourcePage: sourceUrl,
      scrapedAt,
      order: candidate.order,
    }))
    .filter((event) => isLikelyEventTitle(event.eventTitle))
    .sort((left, right) => left.order - right.order)
    .map(({ order: _order, ...event }) => event);
}

async function expandCryptoPage(
  page: Page,
  options: { maxClicks: number; waitMs: number },
): Promise<number> {
  let clicks = 0;

  for (; clicks < options.maxClicks; clicks += 1) {
    const button = page.getByText("Show more markets", { exact: true }).first();
    const visible = await button.isVisible().catch(() => false);
    if (!visible) {
      break;
    }

    await button.scrollIntoViewIfNeeded().catch(() => {});

    const clicked = await button.click({ timeout: 5_000 }).then(
      () => true,
      () => false,
    );
    if (!clicked) {
      break;
    }

    await page.waitForTimeout(options.waitMs);
  }

  return clicks;
}

function scoreAnchorTitle(title: string): number {
  let score = title.length;

  if (/[?]/.test(title)) {
    score += 25;
  }

  if (/\s/.test(title)) {
    score += 12;
  }

  if (looksLikeOutcomeLabel(title)) {
    score -= 1_000;
  }

  if (looksLikeNumericOnlyLabel(title)) {
    score -= 750;
  }

  return score;
}

function isLikelyEventTitle(title: string): boolean {
  const normalized = cleanText(title);
  if (normalized.length < 6) {
    return false;
  }

  if (!/[\p{L}]/u.test(normalized)) {
    return false;
  }

  if (looksLikeOutcomeLabel(normalized) || looksLikeNumericOnlyLabel(normalized)) {
    return false;
  }

  return true;
}

function looksLikeOutcomeLabel(title: string): boolean {
  return /^(yes|no|up|down|live)\b/i.test(title);
}

function looksLikeNumericOnlyLabel(title: string): boolean {
  return /^[\d\s.,$%<>+\-_/]+$/.test(title);
}

function toRootEventUrl(href: string, sourceUrl: string): string | undefined {
  try {
    const url = new URL(toAbsoluteUrl(href, sourceUrl));
    const parts = url.pathname.split("/").filter(Boolean);
    const eventIndex = parts.findIndex((part) => part === "event");
    const slug = eventIndex === -1 ? undefined : parts[eventIndex + 1];
    if (!slug) {
      return undefined;
    }

    url.pathname = `/event/${slug}`;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}
