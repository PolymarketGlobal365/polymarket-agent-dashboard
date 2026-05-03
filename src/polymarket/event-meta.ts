import { cleanText } from "../lib/strings.js";

export type EventPageMeta = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export async function fetchEventPageMeta(
  eventUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<EventPageMeta> {
  const response = await fetchImpl(eventUrl, {
    headers: {
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Event page request failed with ${response.status}`);
  }

  const html = await response.text();
  return extractEventPageMeta(html);
}

export function extractEventPageMeta(html: string): EventPageMeta {
  return {
    ...(readMetaContent(html, "og:title") ? { title: cleanText(readMetaContent(html, "og:title") as string) } : {}),
    ...(readMetaContent(html, "description")
      ? { description: cleanText(readMetaContent(html, "description") as string) }
      : {}),
    ...(readMetaContent(html, "og:image") ? { imageUrl: cleanText(readMetaContent(html, "og:image") as string) } : {}),
  };
}

function readMetaContent(html: string, name: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escapeRegExp(name)}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escapeRegExp(name)}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const value = match?.[1];
    if (value) {
      return value;
    }
  }

  return undefined;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
