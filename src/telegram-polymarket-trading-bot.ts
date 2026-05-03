import path from "node:path";

import { buildRewardTradingSnapshot } from "./polymarket/trading-bot.js";
import { TelegramClient } from "./telegram/client.js";
import { buildTradingTelegramMessages } from "./telegram/trading-bot-format.js";

const REFERRAL_SIGNUP_URL = "https://polymarket.com/ko?r=Musk7";
const DEFAULT_COVER_IMAGE_PATH = path.resolve("assets", "trading-bot-cover.png");

type ParsedArgs = {
  botToken?: string;
  chatId?: string;
  topicId?: number;
  coverImagePath?: string;
  categories: string[];
  tags: string[];
  maxMarkets?: number;
  maxSignals?: number;
  minDailyRewardRate?: number;
  minLiquidity?: number;
  dryRun: boolean;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const snapshot = await buildRewardTradingSnapshot({
    ...(args.categories.length > 0 ? { allowedCategories: args.categories } : {}),
    ...(args.tags.length > 0 ? { allowedTags: args.tags } : {}),
    ...(args.maxMarkets !== undefined ? { maxMarkets: args.maxMarkets } : {}),
    ...(args.minDailyRewardRate !== undefined ? { minDailyRewardRate: args.minDailyRewardRate } : {}),
    ...(args.minLiquidity !== undefined ? { minLiquidity: args.minLiquidity } : {}),
  });

  const selectedSignals = snapshot.signals.slice(0, Math.max(1, args.maxSignals ?? 6));
  const messages = buildTradingTelegramMessages(selectedSignals, {
    generatedAt: snapshot.generatedAt,
    ...(args.maxSignals !== undefined ? { maxSignals: args.maxSignals } : {}),
  });

  if (args.dryRun) {
    process.stdout.write(
      `${JSON.stringify(
        {
          dryRun: true,
          scannedMarkets: snapshot.scannedMarkets,
          shortlistedMarkets: snapshot.shortlistedMarkets,
          coverImagePath: args.coverImagePath ?? process.env.TRADING_BOT_COVER_IMAGE_PATH ?? DEFAULT_COVER_IMAGE_PATH,
          signals: selectedSignals,
          messages,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  const botToken = args.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = args.chatId ?? process.env.TELEGRAM_CHAT_ID;
  const topicId = args.topicId ?? parseOptionalInteger(process.env.TELEGRAM_TOPIC_ID, "TELEGRAM_TOPIC_ID");
  const coverImagePath = args.coverImagePath ?? process.env.TRADING_BOT_COVER_IMAGE_PATH ?? DEFAULT_COVER_IMAGE_PATH;

  if (!botToken) {
    throw new Error("Missing Telegram bot token. Pass --bot-token or set TELEGRAM_BOT_TOKEN.");
  }

  if (!chatId) {
    throw new Error("Missing Telegram chat id. Pass --chat-id or set TELEGRAM_CHAT_ID.");
  }

  const client = new TelegramClient({ botToken });
  const messageIds: Array<number | undefined> = [];

  const coverMessageId = await client.sendPhoto({
    chatId,
    photo: coverImagePath,
    caption: "Daily Polymarket trading report",
    ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
  }).catch(() => undefined);
  if (coverMessageId !== undefined) {
    messageIds.push(coverMessageId);
  }

  for (const text of messages) {
    const messageId = await client.sendMessage({
      chatId,
      text,
      ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
    });
    messageIds.push(messageId);
  }

  const ctaMessageId = await client.sendMessage({
    chatId,
    text: [
      "New here?",
      "Start with the referral signup link below, then come back to this topic for the daily trading report.",
    ].join("\n"),
    replyMarkup: {
      inline_keyboard: [[
        {
          text: "Start Here",
          url: REFERRAL_SIGNUP_URL,
        },
      ]],
    },
    ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
  });
  messageIds.push(ctaMessageId);

  process.stdout.write(
    `${JSON.stringify(
      {
        dryRun: false,
        scannedMarkets: snapshot.scannedMarkets,
        shortlistedMarkets: snapshot.shortlistedMarkets,
        deliveredMessages: messageIds.length,
        messageIds,
      },
      null,
      2,
    )}\n`,
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    categories: [],
    tags: [],
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    switch (current) {
      case "--bot-token":
        parsed.botToken = requireValue(current, next);
        index += 1;
        break;
      case "--chat-id":
        parsed.chatId = requireValue(current, next);
        index += 1;
        break;
      case "--topic-id":
        parsed.topicId = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--cover-image":
        parsed.coverImagePath = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--category":
        parsed.categories.push(...splitCsv(requireValue(current, next)));
        index += 1;
        break;
      case "--tag":
        parsed.tags.push(...splitCsv(requireValue(current, next)));
        index += 1;
        break;
      case "--max-markets":
        parsed.maxMarkets = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--max-signals":
        parsed.maxSignals = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--min-reward-rate":
        parsed.minDailyRewardRate = parseNumberFlag(current, next);
        index += 1;
        break;
      case "--min-liquidity":
        parsed.minLiquidity = parseNumberFlag(current, next);
        index += 1;
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
      default:
        throw new Error(`Unknown argument: ${current}`);
    }
  }

  return parsed;
}

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${flag} requires a value`);
  }

  return value;
}

function parseIntegerFlag(flag: string, value: string | undefined): number {
  return parseRequiredInteger(requireValue(flag, value), flag);
}

function parseNumberFlag(flag: string, value: string | undefined): number {
  return parseRequiredNumber(requireValue(flag, value), flag);
}

function parseOptionalInteger(value: string | undefined, label: string): number | undefined {
  if (!value) {
    return undefined;
  }

  return parseRequiredInteger(value, label);
}

function parseRequiredInteger(value: string, label: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} must be an integer`);
  }

  return parsed;
}

function parseRequiredNumber(value: string, label: string): number {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
