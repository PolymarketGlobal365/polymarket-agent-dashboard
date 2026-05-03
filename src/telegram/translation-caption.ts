import { truncate } from "../lib/strings.js";

export function buildTranslationCaption(translatedText: string, hashtag?: string): string {
  const lines = [translatedText.trim()];

  if (hashtag?.trim()) {
    lines.push("", hashtag.trim());
  }

  return truncate(lines.join("\n"), 1_000);
}
