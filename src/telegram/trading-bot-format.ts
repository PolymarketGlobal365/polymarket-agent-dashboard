import { truncate } from "../lib/strings.js";
import type { RewardTradingSignal } from "../polymarket/trading-bot.js";

const REFERRAL_SIGNUP_URL = "https://polymarket.com/ko?r=Musk7";

export type BuildTradingTelegramMessagesOptions = {
  generatedAt: string;
  maxSignals?: number;
  maxMessageLength?: number;
};

export function buildTradingTelegramMessages(
  signals: RewardTradingSignal[],
  options: BuildTradingTelegramMessagesOptions,
): string[] {
  const maxMessageLength = options.maxMessageLength ?? 3_500;
  const selectedSignals = signals.slice(0, Math.max(1, options.maxSignals ?? 6));
  const header = [
    "Polymarket reward-trading bot",
    `Generated: ${formatTimestamp(options.generatedAt)}`,
    "",
    "Signals are reward-aware passive entry ideas, not guaranteed fills.",
    `New users: sign up here first -> ${REFERRAL_SIGNUP_URL}`,
  ].join("\n");

  const blocks = selectedSignals.map((signal, index) => formatSignalBlock(signal, index + 1));
  const messages: string[] = [];
  let current = header;

  for (const block of blocks) {
    const candidate = `${current}\n\n${block}`;
    if (candidate.length <= maxMessageLength) {
      current = candidate;
      continue;
    }

    messages.push(current);
    current = `Polymarket reward-trading bot (continued)\nGenerated: ${formatTimestamp(options.generatedAt)}\n\n${block}`;
  }

  messages.push(current);
  return messages.map((message, index, all) => {
    const withFooter = index === all.length - 1
      ? `${message}\n\nStart here: ${REFERRAL_SIGNUP_URL}`
      : message;

    return truncate(withFooter, maxMessageLength);
  });
}

function formatSignalBlock(signal: RewardTradingSignal, index: number): string {
  const targetText = signal.quote.targetPrice !== undefined
    ? `${formatCents(signal.quote.targetPrice)} target`
    : "watch only";

  return [
    `${index}. ${signal.eventTitle}`,
    `${signal.outcomeLabel} | score ${signal.score.toFixed(2)} | ${signal.action === "passive-entry" ? "passive entry" : "watch only"}`,
    `${signal.bias} bias | book ${formatSignedPercent(signal.bookImbalance * 100)} | 1d ${formatSignedPercent(signal.dayChangePct)} | 1w ${formatSignedPercent(signal.weekChangePct)}`,
    `quote ${targetText} | book ${formatCents(signal.bestBid)}/${formatCents(signal.bestAsk)} | reward ${trimZeros(signal.rewardDailyRate.toFixed(2))}/day`,
    `spread ${trimZeros(signal.displayedSpreadCents.toFixed(1))}c / reward max ${trimZeros(signal.rewardMaxSpreadCents.toFixed(1))}c | min size ${trimZeros(signal.rewardMinSize.toFixed(0))}`,
    `${signal.headlineReason}`,
    `Trade market: ${signal.eventUrl}?tid=${encodeURIComponent(signal.tokenId)}`,
  ].join("\n");
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().replace("T", " ").slice(0, 16);
}

function formatCents(value: number): string {
  return `${trimZeros((value * 100).toFixed(1))}c`;
}

function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${trimZeros(value.toFixed(1))}%`;
}

function trimZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
