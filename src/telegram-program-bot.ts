import path from "node:path";

import { DEFAULT_OUTPUT_ROOT } from "./config.js";
import { readJsonIfExists, writeJson } from "./lib/fs.js";
import { TelegramClient, type TelegramUpdate } from "./telegram/client.js";
import { handleProgramCommand, isTradingBotProgramCommand } from "./telegram/program-commands.js";

const DEFAULT_STATE_FILE = path.join(DEFAULT_OUTPUT_ROOT, "telegram-program-bot-state.json");

type ParsedArgs = {
  botToken?: string;
  allowedTopicId?: number;
  stateFile: string;
  configFile?: string;
  once: boolean;
  loop: boolean;
  intervalSeconds: number;
  dryRun: boolean;
  limit?: number;
};

type ProgramBotState = {
  lastUpdateId: number;
  updatedAt: string;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const botToken = args.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error("Missing Telegram bot token. Pass --bot-token or set TELEGRAM_BOT_TOKEN.");
  }

  const client = new TelegramClient({ botToken });
  if (args.loop) {
    for (;;) {
      const result = await processUpdates(client, args);
      process.stdout.write(`${JSON.stringify(result)}\n`);
      await delay(args.intervalSeconds * 1_000);
    }
  }

  const result = await processUpdates(client, args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

function isRelevantUpdate(update: TelegramUpdate, allowedTopicId: number | undefined): boolean {
  const text = update.message?.text;
  if (!text || !isTradingBotProgramCommand(text)) {
    return false;
  }

  if (allowedTopicId !== undefined && update.message?.message_thread_id !== allowedTopicId) {
    return false;
  }

  return true;
}

function buildDisplayName(firstName: string | undefined, lastName: string | undefined): string | undefined {
  const parts = [firstName?.trim(), lastName?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    stateFile: DEFAULT_STATE_FILE,
    once: true,
    loop: false,
    intervalSeconds: 10,
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
      case "--allowed-topic-id":
        parsed.allowedTopicId = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--state-file":
        parsed.stateFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--config-file":
        parsed.configFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--limit":
        parsed.limit = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--interval-seconds":
        parsed.intervalSeconds = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
      case "--once":
        parsed.once = true;
        break;
      case "--loop":
        parsed.loop = true;
        parsed.once = false;
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
  const parsed = Number.parseInt(requireValue(flag, value), 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${flag} must be an integer`);
  }

  return parsed;
}

async function processUpdates(
  client: TelegramClient,
  args: ParsedArgs,
): Promise<{
  dryRun: boolean;
  once: boolean;
  loop: boolean;
  fetchedUpdateCount: number;
  relevantUpdateCount: number;
  processedCount: number;
  stateFile: string;
  processed: Array<{ updateId: number; command: string; ok: boolean; preview?: string }>;
}> {
  const state = (await readJsonIfExists<ProgramBotState>(args.stateFile)) ?? {
    lastUpdateId: 0,
    updatedAt: new Date(0).toISOString(),
  };

  const updates = await client.getUpdates({
    ...(state.lastUpdateId > 0 ? { offset: state.lastUpdateId + 1 } : {}),
    limit: args.limit ?? 50,
    allowedUpdates: ["message"],
  });

  const relevantUpdates = updates.filter((update) => isRelevantUpdate(update, args.allowedTopicId));
  const processed: Array<{ updateId: number; command: string; ok: boolean; preview?: string }> = [];

  for (const update of relevantUpdates) {
    const message = update.message;
    const text = message?.text;
    const from = message?.from;
    if (!text || !from) {
      continue;
    }

    try {
      const displayName = buildDisplayName(from.first_name, from.last_name);
      const result = await handleProgramCommand(text, {
        telegramUserId: String(from.id ?? ""),
        ...(from.username ? { username: from.username } : {}),
        ...(displayName ? { displayName } : {}),
        ...(message?.message_thread_id !== undefined ? { topicId: message.message_thread_id } : {}),
        ...(args.configFile ? { configFile: args.configFile } : {}),
      });

      processed.push({
        updateId: update.update_id,
        command: text,
        ok: result.ok,
        ...(args.dryRun ? { preview: result.message } : {}),
      });

      if (!args.dryRun) {
        await client.sendMessage({
          chatId: String(message.chat?.id ?? ""),
          text: result.message,
          ...(message?.message_thread_id !== undefined ? { messageThreadId: message.message_thread_id } : {}),
        });
      }
    } catch (error) {
      const messageText = error instanceof Error ? error.message : String(error);
      processed.push({
        updateId: update.update_id,
        command: text,
        ok: false,
        ...(args.dryRun ? { preview: messageText } : {}),
      });

      if (!args.dryRun) {
        await client.sendMessage({
          chatId: String(message.chat?.id ?? ""),
          text: messageText,
          ...(message?.message_thread_id !== undefined ? { messageThreadId: message.message_thread_id } : {}),
        });
      }
    }
  }

  const maxUpdateId = updates.reduce((max, update) => Math.max(max, update.update_id), state.lastUpdateId);
  if (!args.dryRun) {
    await writeJson(args.stateFile, {
      lastUpdateId: maxUpdateId,
      updatedAt: new Date().toISOString(),
    } satisfies ProgramBotState);
  }

  return {
    dryRun: args.dryRun,
    once: args.once,
    loop: args.loop,
    fetchedUpdateCount: updates.length,
    relevantUpdateCount: relevantUpdates.length,
    processedCount: processed.length,
    stateFile: args.stateFile,
    processed,
  };
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
