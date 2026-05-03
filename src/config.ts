import path from "node:path";

export const INSTAGRAM_WIDTH = 1080;
export const INSTAGRAM_HEIGHT = 1350;
export const SAFE_PADDING_X = 80;
export const SAFE_PADDING_TOP = 120;
export const SAFE_PADDING_BOTTOM = 120;
export const MAX_EVENTS_PER_RUN = 4;
export const MAX_MARKETS_PER_CARD = 4;
export const DEFAULT_SOURCE_URL = "https://polymarket.com/";
export const DEFAULT_CRYPTO_SOURCE_URL = "https://polymarket.com/crypto";
export const DEFAULT_X_PROFILE_URL = "https://x.com/Polymarket";
export const DEFAULT_API_URL = "https://gamma-api.polymarket.com/events";
export const DEFAULT_OUTPUT_ROOT = path.resolve("output");
export const DEFAULT_TELEGRAM_X_STATE_PATH = path.resolve("output", "telegram-polymarket-x-state.json");
export const DEFAULT_TELEGRAM_WHALE_STATE_PATH = path.resolve("output", "telegram-polymarket-whales-state.json");
export const SNAPSHOT_DIRNAME = "snapshots";
export const RUNS_DIRNAME = "runs";
export const TIMEZONE = "Asia/Seoul";
export const BRAND_LINE = "세상 모든 예측 시장 | 폴리마켓나우";
export const CTA_HANDLE = "@polymarket.now";
export const DEFAULT_BROWSER_CHANNEL = "msedge";
export const SYSTEM_BROWSER_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];
