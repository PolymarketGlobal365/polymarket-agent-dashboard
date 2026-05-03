import { DEFAULT_SOURCE_URL, TIMEZONE } from "../config.js";
import { truncate } from "../lib/strings.js";
import type { CryptoPageEvent } from "../polymarket/crypto-page.js";

const DEFAULT_MAX_MESSAGE_LENGTH = 3_500;

export function buildCryptoTelegramMessages(
  events: CryptoPageEvent[],
  options: {
    sourceUrl?: string;
    generatedAt?: string;
    maxMessageLength?: number;
  } = {},
): string[] {
  const sourceUrl = options.sourceUrl ?? DEFAULT_SOURCE_URL;
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const maxMessageLength = options.maxMessageLength ?? DEFAULT_MAX_MESSAGE_LENGTH;
  const heading = buildHeading(sourceUrl);
  const eventBlocks = events.map(
    (event, index) => `${index + 1}. ${truncate(event.eventTitle, 160)}\n${event.eventUrl}`,
  );

  if (eventBlocks.length === 0) {
    return [
      [
        heading,
        `Collected: ${formatKoreanTimestamp(generatedAt)}`,
        `Source: ${sourceUrl}`,
        "",
        "No events were found.",
      ].join("\n"),
    ];
  }

  const pages = chunkEventBlocks(eventBlocks, maxMessageLength - 180);

  return pages.map((blocks, index) =>
    [
      index === 0 ? heading : `${heading} (continued ${index + 1})`,
      `Collected: ${formatKoreanTimestamp(generatedAt)}`,
      `Events: ${events.length}`,
      `Source: ${sourceUrl}`,
      "",
      ...blocks,
    ].join("\n\n"),
  );
}

function buildHeading(sourceUrl: string): string {
  return sourceUrl === "https://polymarket.com/crypto" ? "Polymarket Crypto update" : "Polymarket market update";
}

function chunkEventBlocks(blocks: string[], maxBodyLength: number): string[][] {
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentLength = 0;

  for (const block of blocks) {
    const nextLength = currentLength === 0 ? block.length : currentLength + 2 + block.length;
    if (currentPage.length > 0 && nextLength > maxBodyLength) {
      pages.push(currentPage);
      currentPage = [block];
      currentLength = block.length;
      continue;
    }

    currentPage.push(block);
    currentLength = nextLength;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

function formatKoreanTimestamp(input: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(input));
}
