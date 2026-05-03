import path from "node:path";

import { DEFAULT_TELEGRAM_X_STATE_PATH, DEFAULT_X_PROFILE_URL } from "./config.js";
import { readJsonIfExists, writeJson } from "./lib/fs.js";
import { truncate } from "./lib/strings.js";
import { translateText } from "./translate/google.js";
import { TelegramClient } from "./telegram/client.js";
import { buildTranslationCaption } from "./telegram/translation-caption.js";
import { buildPolymarketTweetCaption } from "./telegram/x-format.js";
import { renderPolymarketTweetPhotoCard } from "./telegram/x-photo-card.js";
import { fetchRecentTweets, type XTimelineTweet } from "./x/profile.js";

type ParsedArgs = {
  botToken?: string;
  chatId?: string;
  profileUrl: string;
  topicId?: number;
  maxTweets?: number;
  stateFile: string;
  translateTo: string;
  includePinned: boolean;
  dryRun: boolean;
};

type TelegramXState = {
  postedTweetIds: string[];
  updatedAt: string;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const botToken = args.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = args.chatId ?? process.env.TELEGRAM_CHAT_ID;
  const topicId = args.topicId ?? parseOptionalInteger(process.env.TELEGRAM_TOPIC_ID, "TELEGRAM_TOPIC_ID");
  const state = (await readJsonIfExists<TelegramXState>(args.stateFile)) ?? {
    postedTweetIds: [],
    updatedAt: new Date(0).toISOString(),
  };

  const tweets = await fetchRecentTweets({
    profileUrl: args.profileUrl,
    includePinned: args.includePinned,
    ...(args.maxTweets !== undefined ? { maxTweets: args.maxTweets } : {}),
  });
  const postedIds = new Set(state.postedTweetIds);
  const pendingTweets = tweets.filter((tweet) => !postedIds.has(tweet.tweetId)).reverse();

  if (args.dryRun) {
    const preview = await Promise.all(
      pendingTweets.map(async (tweet) => {
        const translatedText = await safeTranslateText(tweet, args.translateTo);

        return {
          tweetId: tweet.tweetId,
          url: tweet.url,
          originalText: tweet.text,
          translatedText,
          caption: buildPolymarketTweetCaption(tweet, translatedText),
        };
      }),
    );

    process.stdout.write(
      `${JSON.stringify(
        {
          dryRun: true,
          profileUrl: args.profileUrl,
          fetchedTweetCount: tweets.length,
          pendingTweetCount: pendingTweets.length,
          stateFile: args.stateFile,
          pendingTweets: preview,
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
  const delivered: Array<{ tweetId: string; messageId?: number; url: string }> = [];

  for (const tweet of pendingTweets) {
    const translatedText = await safeTranslateText(tweet, args.translateTo);
    const fallbackText = buildPolymarketTweetCaption(tweet, translatedText);
    const caption = buildTranslationCaption(translatedText, "#Polymarket");
    const photoPath = tweet.mediaUrls?.length
      ? undefined
      : await renderPolymarketTweetPhotoCard(tweet, {
          translatedText,
          hashtag: "#Polymarket",
        });
    const messageId = await sendTweetPost({
      client,
      chatId,
      tweet,
      caption,
      fallbackText,
      ...(topicId !== undefined ? { topicId } : {}),
      ...(photoPath ? { photoPath } : {}),
    });

    delivered.push({
      tweetId: tweet.tweetId,
      url: tweet.url,
      ...(messageId !== undefined ? { messageId } : {}),
    });

    state.postedTweetIds = rememberPostedTweet(state.postedTweetIds, tweet.tweetId);
    state.updatedAt = new Date().toISOString();
    await writeJson(args.stateFile, state);
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        dryRun: false,
        profileUrl: args.profileUrl,
        fetchedTweetCount: tweets.length,
        deliveredTweetCount: delivered.length,
        stateFile: args.stateFile,
        delivered,
      },
      null,
      2,
    )}\n`,
  );
}

async function safeTranslateText(tweet: XTimelineTweet, translateTo: string): Promise<string> {
  try {
    return await translateText(tweet.text, { to: translateTo });
  } catch {
    return tweet.text;
  }
}

async function sendTweetPost(options: {
  client: TelegramClient;
  chatId: string;
  topicId?: number;
  tweet: XTimelineTweet;
  caption: string;
  fallbackText: string;
  photoPath?: string;
}): Promise<number | undefined> {
  if (options.tweet.mediaUrls && options.tweet.mediaUrls.length > 1) {
    return options.client.sendMediaGroup({
      chatId: options.chatId,
      photos: options.tweet.mediaUrls,
      caption: options.caption,
      ...(options.topicId !== undefined ? { messageThreadId: options.topicId } : {}),
    });
  }

  if (options.tweet.mediaUrls && options.tweet.mediaUrls.length === 1) {
    const [photo] = options.tweet.mediaUrls;
    if (!photo) {
      throw new Error("Tweet media URL was missing.");
    }
    return options.client.sendPhoto({
      chatId: options.chatId,
      photo,
      caption: options.caption,
      ...(options.topicId !== undefined ? { messageThreadId: options.topicId } : {}),
    });
  }

  if (options.photoPath) {
    return options.client.sendPhoto({
      chatId: options.chatId,
      photo: options.photoPath,
      caption: options.caption,
      ...(options.topicId !== undefined ? { messageThreadId: options.topicId } : {}),
    });
  }

  return options.client.sendMessage({
    chatId: options.chatId,
    text: truncate(
      [options.fallbackText, "", options.tweet.text].join("\n"),
      3_500,
    ),
    ...(options.topicId !== undefined ? { messageThreadId: options.topicId } : {}),
  });
}

function rememberPostedTweet(existing: string[], tweetId: string): string[] {
  const next = [...existing.filter((value) => value !== tweetId), tweetId];
  return next.slice(-200);
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    profileUrl: DEFAULT_X_PROFILE_URL,
    stateFile: DEFAULT_TELEGRAM_X_STATE_PATH,
    translateTo: "ko",
    includePinned: false,
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
      case "--profile-url":
        parsed.profileUrl = requireValue(current, next);
        index += 1;
        break;
      case "--topic-id":
        parsed.topicId = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--max-tweets":
        parsed.maxTweets = parseIntegerFlag(current, next);
        index += 1;
        break;
      case "--state-file":
        parsed.stateFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--translate-to":
        parsed.translateTo = requireValue(current, next);
        index += 1;
        break;
      case "--include-pinned":
        parsed.includePinned = true;
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
