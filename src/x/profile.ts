import { launchRenderingBrowser } from "../render/browser.js";

const DEFAULT_VIEWPORT = { width: 1440, height: 2400 };

export type XTimelineTweet = {
  tweetId: string;
  url: string;
  text: string;
  postedAt?: string;
  avatarUrl?: string;
  mediaUrls?: string[];
  authorName?: string;
  authorHandle?: string;
  isPinned: boolean;
};

type RawTimelineTweet = XTimelineTweet & {
  isReply: boolean;
  isRepost: boolean;
};

export type FetchRecentTweetsOptions = {
  profileUrl: string;
  maxTweets?: number;
  includePinned?: boolean;
};

export async function fetchRecentTweets(options: FetchRecentTweetsOptions): Promise<XTimelineTweet[]> {
  const browser = await launchRenderingBrowser();

  try {
    const context = await browser.newContext({
      colorScheme: "dark",
      locale: "en-US",
      viewport: DEFAULT_VIEWPORT,
    });

    try {
      const page = await context.newPage();
      await page.goto(options.profileUrl, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.waitForSelector("article", { timeout: 45_000 });
      await page.waitForTimeout(3_000);

      const maxTweets = Math.max(options.maxTweets ?? 3, 1);
      const collected = new Map<string, RawTimelineTweet>();

      for (let attempt = 0; attempt < 6 && collected.size < maxTweets + 3; attempt += 1) {
        const tweets = (await page.locator("article").evaluateAll((articles) =>
          articles
            .map((articleNode) => parseArticle(articleNode as HTMLElement))
            .filter((tweet) => Boolean(tweet.tweetId) && Boolean(tweet.text.replace(/\s+/g, " ").trim())),
        )) as RawTimelineTweet[];

        for (const tweet of tweets) {
          if (!collected.has(tweet.tweetId)) {
            collected.set(tweet.tweetId, tweet);
          }
        }

        if (collected.size >= maxTweets + 3) {
          break;
        }

        await page.mouse.wheel(0, DEFAULT_VIEWPORT.height * 0.9);
        await page.waitForTimeout(1_500);
      }

      return selectTimelineTweets(Array.from(collected.values()), {
        maxTweets,
        includePinned: options.includePinned ?? false,
      });
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

export async function fetchTweetByUrl(tweetUrl: string): Promise<XTimelineTweet> {
  const targetTweetId = extractTweetIdFromUrl(tweetUrl);
  if (!targetTweetId) {
    throw new Error(`Could not parse tweet id from ${tweetUrl}.`);
  }

  const browser = await launchRenderingBrowser();

  try {
    const context = await browser.newContext({
      colorScheme: "dark",
      locale: "en-US",
      viewport: DEFAULT_VIEWPORT,
    });

    try {
      const page = await context.newPage();
      await page.goto(tweetUrl, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.waitForSelector("article", { timeout: 45_000 });
      await page.waitForTimeout(3_000);

      const tweet = (await page.locator("article").evaluateAll((articles, expectedTweetId) => {
        const matches = articles
          .map((articleNode) => parseArticle(articleNode as HTMLElement))
          .filter((candidate) => candidate.tweetId === expectedTweetId);

        return matches[0] ?? null;
      }, targetTweetId)) as RawTimelineTweet | null;

      if (!tweet) {
        throw new Error(`Could not find tweet ${targetTweetId} on the page.`);
      }

      const { isReply: _isReply, isRepost: _isRepost, ...result } = tweet;
      return result;
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

export function selectTimelineTweets(
  tweets: RawTimelineTweet[],
  options: {
    maxTweets: number;
    includePinned: boolean;
  },
): XTimelineTweet[] {
  return tweets
    .filter((tweet) => !tweet.isReply && !tweet.isRepost)
    .filter((tweet) => options.includePinned || !tweet.isPinned)
    .slice(0, options.maxTweets)
    .map(({ isReply: _isReply, isRepost: _isRepost, ...tweet }) => tweet);
}

export function extractTweetIdFromUrl(input: string): string | undefined {
  return input.match(/\/status\/(\d+)/)?.[1];
}

function parseArticle(article: HTMLElement): RawTimelineTweet {
  const text = article.querySelector("[data-testid='tweetText']")?.textContent ?? "";
  const timeValue = article.querySelector("time")?.getAttribute("datetime") ?? "";
  const timeLink = article.querySelector("time")?.closest("a[href*='/status/']") as HTMLAnchorElement | null;
  const fallbackLink = article.querySelector("a[href*='/status/']") as HTMLAnchorElement | null;
  const statusUrl = timeLink?.href ?? fallbackLink?.href ?? "";
  const tweetIdMatch = statusUrl.match(/\/status\/(\d+)/);
  const socialContext = article.querySelector("[data-testid='socialContext']")?.textContent ?? "";
  const fullText = article.innerText;
  const avatarUrl =
    Array.from(article.querySelectorAll("img"))
      .map((image) => image.getAttribute("src") ?? "")
      .find((src) => src.includes("profile_images")) ?? "";
  const mediaUrls = Array.from(article.querySelectorAll("img"))
    .map((image) => image.getAttribute("src") ?? "")
    .filter((src) => src.includes("pbs.twimg.com/media"))
    .map((src) => src.replace(/name=[^&]+/i, "name=large"))
    .filter((src, index, values) => values.indexOf(src) === index);
  const userNameContainer = article.querySelector("[data-testid='User-Name']");
  const userNameParts = Array.from(userNameContainer?.querySelectorAll("span") ?? [])
    .map((span) => span.textContent?.trim() ?? "")
    .filter(Boolean);
  const authorHandle = userNameParts.find((part) => part.startsWith("@")) ?? handleFromStatusUrl(statusUrl);
  const authorName =
    userNameParts.find((part) => !part.startsWith("@") && !isTimestampLabel(part)) ??
    (authorHandle ? authorHandle.replace(/^@/, "") : undefined);

  return {
    tweetId: tweetIdMatch?.[1] ?? "",
    url: statusUrl,
    text,
    ...(timeValue ? { postedAt: timeValue } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
    ...(mediaUrls.length > 0 ? { mediaUrls } : {}),
    ...(authorName ? { authorName } : {}),
    ...(authorHandle ? { authorHandle } : {}),
    isPinned: fullText.startsWith("Pinned") || socialContext.includes("Pinned"),
    isReply: fullText.includes("Replying to"),
    isRepost: socialContext.includes("Reposted") || /\bReposted\b/.test(fullText),
  };
}

function handleFromStatusUrl(statusUrl: string): string | undefined {
  try {
    const pathname = new URL(statusUrl).pathname;
    const handle = pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : undefined;
  } catch {
    return undefined;
  }
}

function isTimestampLabel(input: string): boolean {
  return /^\d+[smhdwy]$/i.test(input) || /^\w{3}\s+\d{1,2}$/i.test(input);
}
