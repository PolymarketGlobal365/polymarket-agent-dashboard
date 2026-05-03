import path from "node:path";

import { DEFAULT_TELEGRAM_WHALE_STATE_PATH } from "./config.js";
import { readJsonIfExists, writeJson } from "./lib/fs.js";
import { buildWhaleFeed } from "./polymarket/whales.js";
import { TelegramClient } from "./telegram/client.js";
import { buildWhaleAlertMessages } from "./telegram/whale-format.js";

type ParsedArgs = {
  botToken?: string;
  chatId?: string;
  topicId?: number;
  stateFile: string;
  trackedWallets?: string[];
  leaderboardLimit?: number;
  activityLimitPerTrader?: number;
  minUsdcSize?: number;
  maxAlerts?: number;
  lookbackHours?: number;
  dryRun: boolean;
};

type TelegramWhaleState = {
  seenAlertIds: string[];
  updatedAt: string;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const botToken = args.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = args.chatId ?? process.env.TELEGRAM_CHAT_ID;
  const topicId = args.topicId ?? parseOptionalInteger(process.env.TELEGRAM_TOPIC_ID, "TELEGRAM_TOPIC_ID");
  const state = (await readJsonIfExists<TelegramWhaleState>(args.stateFile)) ?? {
    seenAlertIds: [],
    updatedAt: new Date(0).toISOString(),
  };
  const sinceTimestamp = Date.now() - (args.lookbackHours ?? 24) * 60 * 60 * 1_000;

  const feed = await buildWhaleFeed({
    ...(args.trackedWallets?.length ? { trackedWallets: args.trackedWallets } : {}),
    ...(args.leaderboardLimit !== undefined ? { leaderboardLimit: args.leaderboardLimit } : {}),
    ...(args.activityLimitPerTrader !== undefined ? { activityLimitPerTrader: args.activityLimitPerTrader } : {}),
    ...(args.minUsdcSize !== undefined ? { minUsdcSize: args.minUsdcSize } : {}),
    ...(args.maxAlerts !== undefined ? { maxAlerts: args.maxAlerts } : {}),
    startTimestamp: sinceTimestamp,
  });

  const seen = new Set(state.seenAlertIds);
  const pendingAlerts = feed.alerts.filter((alert) => !seen.has(alert.alertId));
  const messages = buildWhaleAlertMessages(pendingAlerts);

  if (args.dryRun) {
    process.stdout.write(
      `${JSON.stringify(
        {
          dryRun: true,
          trackedTraderCount: feed.trackedTraders.length,
          alertCount: feed.alerts.length,
          pendingAlertCount: pendingAlerts.length,
          stateFile: args.stateFile,
          trackedWallets: feed.trackedTraders.map((trader) => trader.proxyWallet),
          preview: pendingAlerts,
          messages,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  if (!botToken) {
    throw new Error("Missing Telegram bot token. Pass --bot-token or set TELEGRAM_BOT_TOKEN.");
  }

  if (!chatId) {
    throw new Error("Missing Telegram chat id. Pass --chat-id or set TELEGRAM_CHAT_ID.");
  }

  const client = new TelegramClient({ botToken });
  for (let index = 0; index < pendingAlerts.length; index += 1) {
    const alert = pendingAlerts[index];
    const text = messages[index];
    if (!alert || !text) {
      continue;
    }

    await client.sendMessage({
      chatId,
      text,
      parseMode: "HTML",
      ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
    });

    state.seenAlertIds = rememberSeenAlert(state.seenAlertIds, alert.alertId);
    state.updatedAt = new Date().toISOString();
    await writeJson(args.stateFile, state);
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        dryRun: false,
        trackedTraderCount: feed.trackedTraders.length,
        alertCount: feed.alerts.length,
        deliveredAlertCount: pendingAlerts.length,
        stateFile: args.stateFile,
      },
      null,
      2,
    )}\n`,
  );
}

function rememberSeenAlert(existing: string[], alertId: string): string[] {
  const next = [...existing.filter((value) => value !== alertId), alertId];
  return next.slice(-500);
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    stateFile: DEFAULT_TELEGRAM_WHALE_STATE_PATH,
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
      case "--state-file":
        parsed.stateFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--tracked-wallets":
        parsed.trackedWallets = requireValue(current, next)
          .split(",")
          .map((wallet) => wallet.trim())
          .filter(Boolean);
        index += 1;
        break;
      case "--leaderboard-limit":
        parsed.leaderboardLimit = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--activity-limit-per-trader":
        parsed.activityLimitPerTrader = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--min-usdc-size":
        parsed.minUsdcSize = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--max-alerts":
        parsed.maxAlerts = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--lookback-hours":
        parsed.lookbackHours = parseIntegerFlag(current, next);
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

function requireValue(flag: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${flag} requires a value`);
  }

  return value;
}

function parseIntegerFlag(flag: string, value: string | undefined): number {
  return parseRequiredInteger(requireValue(flag, value), flag);
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

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
