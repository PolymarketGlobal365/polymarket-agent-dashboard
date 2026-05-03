import { DEFAULT_SOURCE_URL } from "./config.js";
import { buildCryptoFeed } from "./polymarket/crypto-feed.js";
import { TelegramClient } from "./telegram/client.js";
import { buildCryptoTelegramMessages } from "./telegram/format.js";
import { renderTelegramPhotoCard } from "./telegram/photo-card.js";
import { buildCryptoTelegramPhotoPosts } from "./telegram/photo-format.js";

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const botToken = args.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = args.chatId ?? process.env.TELEGRAM_CHAT_ID;
  const topicId = args.topicId ?? parseOptionalInteger(process.env.TELEGRAM_TOPIC_ID, "TELEGRAM_TOPIC_ID");
  const sourceUrl = args.sourceUrl ?? DEFAULT_SOURCE_URL;

  const feedResult = await buildCryptoFeed({
    sourceUrl,
    ...(args.maxEvents !== undefined ? { maxEvents: args.maxEvents } : {}),
    ...(args.maxShowMoreClicks !== undefined ? { maxShowMoreClicks: args.maxShowMoreClicks } : {}),
  });

  const selectedEvents = args.skipEvents ? feedResult.events.slice(args.skipEvents) : feedResult.events;
  const messages = buildCryptoTelegramMessages(selectedEvents, {
    sourceUrl,
  });
  const photoPosts = await buildPhotoPosts(selectedEvents);

  if (args.dryRun) {
    process.stdout.write(
      `${JSON.stringify(
        {
          dryRun: true,
          delivery: args.delivery,
          sourceUrl,
          eventCount: selectedEvents.length,
          messageCount: messages.length,
          photoPostCount: photoPosts.length,
          warnings: feedResult.warnings,
        },
        null,
        2,
      )}\n`,
    );

    if (args.delivery === "digest") {
      messages.forEach((message, index) => {
        process.stdout.write(`\n=== MESSAGE ${index + 1} ===\n${message}\n`);
      });
    } else {
      photoPosts.forEach((post, index) => {
        process.stdout.write(`\n=== PHOTO POST ${index + 1} ===\n${post.photo ?? "(no photo)"}\n${post.caption}\n`);
      });
    }
    return;
  }

  if (!botToken) {
    throw new Error("Missing Telegram bot token. Pass --bot-token or set TELEGRAM_BOT_TOKEN.");
  }

  if (!chatId) {
    throw new Error("Missing Telegram chat id. Pass --chat-id or set TELEGRAM_CHAT_ID.");
  }

  const client = new TelegramClient({ botToken });
  if (args.delivery === "digest") {
    for (const message of messages) {
      await client.sendMessage({
        chatId,
        text: message,
        ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
      });
    }
  } else {
    for (const post of photoPosts) {
      if (post.photo) {
        await client.sendPhoto({
          chatId,
          photo: post.photo,
          caption: post.caption,
          ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
        });
        continue;
      }

      await client.sendMessage({
        chatId,
        text: post.caption,
        ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
      });
    }
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        dryRun: false,
        delivery: args.delivery,
        sourceUrl,
        eventCount: selectedEvents.length,
        messageCount: args.delivery === "digest" ? messages.length : photoPosts.length,
        warnings: feedResult.warnings,
      },
      null,
      2,
    )}\n`,
  );
}

async function buildPhotoPosts(events: Awaited<ReturnType<typeof buildCryptoFeed>>["events"]) {
  const basePosts = buildCryptoTelegramPhotoPosts(events);
  const renderedPosts = [];

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const post = basePosts[index];
    if (!event || !post) {
      continue;
    }

    const renderedPhoto = await renderTelegramPhotoCard(event);
    renderedPosts.push({
      ...post,
      ...(renderedPhoto ? { photo: renderedPhoto } : {}),
    });
  }

  return renderedPosts;
}

type ParsedArgs = {
  botToken?: string;
  chatId?: string;
  sourceUrl?: string;
  topicId?: number;
  skipEvents?: number;
  maxEvents?: number;
  maxShowMoreClicks?: number;
  delivery: "digest" | "photo";
  dryRun: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    delivery: "photo",
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
      case "--source-url":
        parsed.sourceUrl = requireValue(current, next);
        index += 1;
        break;
      case "--topic-id":
        parsed.topicId = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--skip-events":
        parsed.skipEvents = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--max-events":
        parsed.maxEvents = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--max-show-more-clicks":
        parsed.maxShowMoreClicks = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--delivery":
        parsed.delivery = parseDelivery(requireValue(current, next));
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

function parseDelivery(value: string): "digest" | "photo" {
  if (value === "digest" || value === "photo") {
    return value;
  }

  throw new Error(`Unknown delivery mode: ${value}`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
