import { truncate } from "./lib/strings.js";
import { TelegramClient } from "./telegram/client.js";
import { buildTranslationCaption } from "./telegram/translation-caption.js";
import { renderPolymarketTweetPhotoCard } from "./telegram/x-photo-card.js";
import { translateText } from "./translate/google.js";
import { fetchTweetByUrl } from "./x/profile.js";

type ParsedArgs = {
  botToken?: string;
  chatId?: string;
  topicId?: number;
  tweetUrl: string;
  hashtag: string;
  translateTo: string;
  dryRun: boolean;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const botToken = args.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = args.chatId ?? process.env.TELEGRAM_CHAT_ID;
  const topicId = args.topicId ?? parseOptionalInteger(process.env.TELEGRAM_TOPIC_ID, "TELEGRAM_TOPIC_ID");

  const tweet = await fetchTweetByUrl(args.tweetUrl);
  const translatedText = await translateTweet(tweet.text, args.translateTo);
  const caption = buildTranslationCaption(translatedText, args.hashtag);
  const photoPath = tweet.mediaUrls?.length
    ? undefined
    : await renderPolymarketTweetPhotoCard(tweet, {
        translatedText,
        hashtag: args.hashtag,
      });

  if (args.dryRun) {
    process.stdout.write(
      `${JSON.stringify(
        {
          dryRun: true,
          tweetUrl: tweet.url,
          translatedText,
          hashtag: args.hashtag,
          mediaUrls: tweet.mediaUrls ?? [],
          caption,
          photoPath,
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
  const fallbackText = truncate(
    [translatedText, "", args.hashtag, "", tweet.url].join("\n"),
    3_500,
  );

  let messageId: number | undefined;
  if (tweet.mediaUrls && tweet.mediaUrls.length > 1) {
    messageId = await client.sendMediaGroup({
      chatId,
      photos: tweet.mediaUrls,
      caption,
      ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
    });
  } else if (tweet.mediaUrls && tweet.mediaUrls.length === 1) {
    const [photo] = tweet.mediaUrls;
    if (!photo) {
      throw new Error("Tweet media URL was missing.");
    }
    messageId = await client.sendPhoto({
      chatId,
      photo,
      caption,
      ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
    });
  } else if (photoPath) {
    messageId = await client.sendPhoto({
      chatId,
      photo: photoPath,
      caption,
      ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
    });
  } else {
    messageId = await client.sendMessage({
      chatId,
      text: fallbackText,
      ...(topicId !== undefined ? { messageThreadId: topicId } : {}),
    });
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        dryRun: false,
        tweetUrl: tweet.url,
        translatedText,
        hashtag: args.hashtag,
        messageId,
      },
      null,
      2,
    )}\n`,
  );
}

async function translateTweet(text: string, translateTo: string): Promise<string> {
  try {
    return await translateText(text, { to: translateTo });
  } catch {
    return text;
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    tweetUrl: "",
    hashtag: "#국제",
    translateTo: "ko",
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
      case "--tweet-url":
        parsed.tweetUrl = requireValue(current, next);
        index += 1;
        break;
      case "--hashtag":
        parsed.hashtag = requireValue(current, next);
        index += 1;
        break;
      case "--translate-to":
        parsed.translateTo = requireValue(current, next);
        index += 1;
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
      default:
        throw new Error(`Unknown argument: ${current}`);
    }
  }

  if (!parsed.tweetUrl) {
    throw new Error("Missing --tweet-url.");
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
