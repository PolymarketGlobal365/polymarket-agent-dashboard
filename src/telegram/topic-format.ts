import { TIMEZONE } from "../config.js";
import { truncate } from "../lib/strings.js";

const DEFAULT_MAX_MESSAGE_LENGTH = 3_500;

export type TelegramTopicKind =
  | "wallet-leaderboard"
  | "copytrade"
  | "trading-bot-program"
  | "strategies";

export type WalletLeaderboardEntry = {
  rank: number;
  traderName: string;
  accountId?: string;
  walletUrl?: string;
  pnlUsd?: number;
  volumeUsd?: number;
  winRatePct?: number;
  primaryFocus?: string;
  styleTags?: string[];
  summary: string;
};

export type WalletLeaderboardDigest = {
  generatedAt: string;
  title?: string;
  entries: WalletLeaderboardEntry[];
};

export type CopytradeAlertEntry = {
  traderName: string;
  accountId?: string;
  walletUrl?: string;
  side: "BUY" | "SELL";
  marketTitle: string;
  outcome: string;
  price?: number;
  sizeUsd?: number;
  interpretation: string;
  marketUrl: string;
  observedAt: string;
};

export type CopytradeDigest = {
  generatedAt: string;
  alerts: CopytradeAlertEntry[];
};

export type ProgramStatusEntry = {
  userLabel: string;
  mode: "ACTIVE" | "PAUSED" | "STOPPED";
  strategyLabel: string;
  budgetUsd: number;
  deployedUsd?: number;
  openOrders?: number;
  filledOrders?: number;
  realizedPnlUsd?: number;
  pendingActions?: string[];
  note?: string;
};

export type ProgramStatusDigest = {
  generatedAt: string;
  botStatus: "RUNNING" | "DEGRADED" | "PAUSED";
  entries: ProgramStatusEntry[];
  alerts?: string[];
};

export type StrategyBriefSection = {
  heading: string;
  bullets: string[];
};

export type StrategyBrief = {
  generatedAt: string;
  headline: string;
  thesis: string;
  watchlist: string[];
  sections: StrategyBriefSection[];
  closingNote?: string;
};

export function buildWalletLeaderboardMessages(
  digest: WalletLeaderboardDigest,
  options: { maxMessageLength?: number } = {},
): string[] {
  const maxMessageLength = options.maxMessageLength ?? DEFAULT_MAX_MESSAGE_LENGTH;
  const heading = digest.title ?? "Wallet Leaderboard";
  const blocks = digest.entries.map((entry) => formatWalletEntry(entry));

  return chunkBlocks({
    heading,
    generatedAt: digest.generatedAt,
    summaryLine: `Tracked traders: ${digest.entries.length}`,
    emptyLine: "No leaderboard entries were available.",
    blocks,
    maxMessageLength,
  });
}

export function buildCopytradeMessages(
  digest: CopytradeDigest,
  options: { maxMessageLength?: number } = {},
): string[] {
  const maxMessageLength = options.maxMessageLength ?? DEFAULT_MAX_MESSAGE_LENGTH;
  const blocks = digest.alerts.map((alert, index) => formatCopytradeEntry(alert, index + 1));

  return chunkBlocks({
    heading: "Copytrade Feed",
    generatedAt: digest.generatedAt,
    summaryLine: `Observed moves: ${digest.alerts.length}`,
    emptyLine: "No copytrade alerts were detected.",
    blocks,
    maxMessageLength,
  });
}

export function buildTradingBotProgramMessages(
  digest: ProgramStatusDigest,
  options: { maxMessageLength?: number } = {},
): string[] {
  const maxMessageLength = options.maxMessageLength ?? DEFAULT_MAX_MESSAGE_LENGTH;
  const blocks = digest.entries.map((entry, index) => formatProgramEntry(entry, index + 1));
  const alertLines = (digest.alerts ?? []).map((alert) => `- ${alert}`);
  const preamble = [
    `Bot status: ${digest.botStatus}`,
    ...(alertLines.length > 0 ? ["Alerts:", ...alertLines] : []),
  ].join("\n");

  return chunkBlocks({
    heading: "Trading Bot (Program)",
    generatedAt: digest.generatedAt,
    summaryLine: preamble,
    emptyLine: "No user programs are configured yet.",
    blocks,
    maxMessageLength,
  });
}

export function buildStrategyMessages(
  brief: StrategyBrief,
  options: { maxMessageLength?: number } = {},
): string[] {
  const maxMessageLength = options.maxMessageLength ?? DEFAULT_MAX_MESSAGE_LENGTH;
  const blocks = [
    [
      `Headline: ${brief.headline}`,
      `Thesis: ${brief.thesis}`,
      `Watchlist: ${brief.watchlist.join(", ") || "None"}`,
    ].join("\n"),
    ...brief.sections.map((section) => [
      section.heading,
      ...section.bullets.map((bullet) => `- ${bullet}`),
    ].join("\n")),
    ...(brief.closingNote ? [brief.closingNote] : []),
  ];

  return chunkBlocks({
    heading: "Strategies",
    generatedAt: brief.generatedAt,
    summaryLine: "Daily operator brief",
    emptyLine: "No strategy brief is available.",
    blocks,
    maxMessageLength,
  });
}

export function buildTopicWelcomeMessage(topic: TelegramTopicKind): string {
  switch (topic) {
    case "wallet-leaderboard":
      return [
        "Wallet Leaderboard",
        "",
        "What users get here:",
        "- Ranked trader snapshots",
        "- Style tags and account summaries",
        "- High-signal wallets worth tracking",
      ].join("\n");
    case "copytrade":
      return [
        "Copytrade Feed",
        "",
        "What users get here:",
        "- New wallet actions",
        "- Buy or sell direction",
        "- Market links and position context",
      ].join("\n");
    case "trading-bot-program":
      return [
        "Trading Bot (Program)",
        "",
        "What users get here:",
        "- Bot status and user program status",
        "- Orders placed, repriced, and filled",
        "- Risk, budget, and execution alerts",
      ].join("\n");
    case "strategies":
      return [
        "Strategies",
        "",
        "What users get here:",
        "- Daily thesis",
        "- Watchlist priorities",
        "- Execution and risk notes",
      ].join("\n");
  }
}

function chunkBlocks(input: {
  heading: string;
  generatedAt: string;
  summaryLine: string;
  emptyLine: string;
  blocks: string[];
  maxMessageLength: number;
}): string[] {
  const prefix = [
    input.heading,
    `Generated: ${formatEnglishTimestamp(input.generatedAt)}`,
    input.summaryLine,
  ].join("\n");

  if (input.blocks.length === 0) {
    return [[prefix, "", input.emptyLine].join("\n")];
  }

  const messages: string[] = [];
  let current = prefix;

  for (const block of input.blocks) {
    const candidate = `${current}\n\n${block}`;
    if (candidate.length <= input.maxMessageLength) {
      current = candidate;
      continue;
    }

    messages.push(truncate(current, input.maxMessageLength));
    current = [
      `${input.heading} (continued)`,
      `Generated: ${formatEnglishTimestamp(input.generatedAt)}`,
      input.summaryLine,
      "",
      block,
    ].join("\n");
  }

  messages.push(truncate(current, input.maxMessageLength));
  return messages;
}

function formatWalletEntry(entry: WalletLeaderboardEntry): string {
  return [
    `#${entry.rank} ${entry.traderName}`,
    ...(entry.accountId ? [`Account ID: ${entry.accountId}`] : []),
    ...(entry.walletUrl ? [`Profile: ${entry.walletUrl}`] : []),
    ...buildInlineFields([
      entry.pnlUsd !== undefined ? `PnL ${formatUsd(entry.pnlUsd)}` : undefined,
      entry.volumeUsd !== undefined ? `Volume ${formatUsd(entry.volumeUsd)}` : undefined,
      entry.winRatePct !== undefined ? `Win rate ${trimZeros(entry.winRatePct.toFixed(1))}%` : undefined,
    ]),
    ...(entry.primaryFocus ? [`Focus: ${entry.primaryFocus}`] : []),
    ...(entry.styleTags && entry.styleTags.length > 0 ? [`Style: ${entry.styleTags.join(", ")}`] : []),
    `Overview: ${entry.summary}`,
  ].join("\n");
}

function formatCopytradeEntry(entry: CopytradeAlertEntry, index: number): string {
  return [
    `${index}. ${entry.traderName} ${entry.side}`,
    ...(entry.accountId ? [`Account ID: ${entry.accountId}`] : []),
    ...(entry.walletUrl ? [`Profile: ${entry.walletUrl}`] : []),
    `${entry.marketTitle} -> ${entry.outcome}`,
    ...buildInlineFields([
      entry.price !== undefined ? `Price ${trimZeros((entry.price * 100).toFixed(1))}c` : undefined,
      entry.sizeUsd !== undefined ? `Size ${formatUsd(entry.sizeUsd)}` : undefined,
      `Observed ${formatEnglishTimestamp(entry.observedAt)}`,
    ]),
    `Interpretation: ${entry.interpretation}`,
    `Market: ${entry.marketUrl}`,
  ].join("\n");
}

function formatProgramEntry(entry: ProgramStatusEntry, index: number): string {
  return [
    `${index}. ${entry.userLabel} -> ${entry.mode}`,
    `Strategy: ${entry.strategyLabel}`,
    ...buildInlineFields([
      `Budget ${formatUsd(entry.budgetUsd)}`,
      entry.deployedUsd !== undefined ? `Deployed ${formatUsd(entry.deployedUsd)}` : undefined,
      entry.realizedPnlUsd !== undefined ? `Realized PnL ${formatUsd(entry.realizedPnlUsd)}` : undefined,
    ]),
    ...buildInlineFields([
      entry.openOrders !== undefined ? `Open orders ${entry.openOrders}` : undefined,
      entry.filledOrders !== undefined ? `Filled ${entry.filledOrders}` : undefined,
    ]),
    ...(entry.pendingActions && entry.pendingActions.length > 0
      ? [`Pending actions: ${entry.pendingActions.join(", ")}`]
      : []),
    ...(entry.note ? [`Note: ${entry.note}`] : []),
  ].join("\n");
}

function buildInlineFields(values: Array<string | undefined>): string[] {
  const filtered = values.filter((value): value is string => Boolean(value));
  return filtered.length > 0 ? [filtered.join(" | ")] : [];
}

function formatEnglishTimestamp(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatUsd(value: number): string {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absolute >= 1_000_000_000) {
    return `${sign}$${trimZeros((absolute / 1_000_000_000).toFixed(2))}B`;
  }
  if (absolute >= 1_000_000) {
    return `${sign}$${trimZeros((absolute / 1_000_000).toFixed(2))}M`;
  }
  if (absolute >= 1_000) {
    return `${sign}$${trimZeros((absolute / 1_000).toFixed(1))}K`;
  }

  return `${sign}$${trimZeros(absolute.toFixed(0))}`;
}

function trimZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
