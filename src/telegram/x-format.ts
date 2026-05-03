import { TIMEZONE } from "../config.js";
import { truncate } from "../lib/strings.js";
import type { XTimelineTweet } from "../x/profile.js";

const MAX_CAPTION_LENGTH = 1_000;

export function buildPolymarketTweetCaption(tweet: XTimelineTweet, translatedText: string): string {
  const lines = [
    "폴리마켓 X 번역",
    "",
    translatedText.trim(),
    "",
    `원문: ${tweet.url}`,
    ...(tweet.postedAt ? [`게시 시각: ${formatKoreanTimestamp(tweet.postedAt)}`] : []),
    "#Polymarket #트윗번역",
  ];

  return truncate(lines.join("\n"), MAX_CAPTION_LENGTH);
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
