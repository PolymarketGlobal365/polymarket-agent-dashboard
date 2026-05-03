import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const { SAMPLE_POLYMARKET_EVENTS } = await import("../dist/fixtures/sample-events.js");
const { crawlPolymarketFromApiPayload } = await import("../dist/polymarket/crawl.js");
const { extractEventPageMeta } = await import("../dist/polymarket/event-meta.js");
const { buildCryptoTelegramPhotoPosts } = await import("../dist/telegram/photo-format.js");
const { normalizeCryptoEventAnchors } = await import("../dist/polymarket/crypto-page.js");
const { normalizeCards } = await import("../dist/pipeline/normalize.js");
const { selectTopEvents } = await import("../dist/pipeline/rank.js");
const { buildSlidesForEvent } = await import("../dist/pipeline/slides.js");
const { launchRenderingBrowser } = await import("../dist/render/browser.js");
const { renderSlides } = await import("../dist/render/render.js");
const { runPipeline } = await import("../dist/pipeline/run.js");
const { TelegramClient } = await import("../dist/telegram/client.js");
const { buildCryptoTelegramMessages } = await import("../dist/telegram/format.js");
const { renderTelegramPhotoCard } = await import("../dist/telegram/photo-card.js");
const { buildTranslationCaption } = await import("../dist/telegram/translation-caption.js");
const { buildPolymarketTweetCaption } = await import("../dist/telegram/x-format.js");
const { renderPolymarketTweetPhotoCard } = await import("../dist/telegram/x-photo-card.js");
const { parseGoogleTranslatePayload } = await import("../dist/translate/google.js");
const { extractTweetIdFromUrl, selectTimelineTweets } = await import("../dist/x/profile.js");

await verifyCrawl();
await verifyCryptoPageNormalization();
await verifyEventMetaExtraction();
await verifyNormalize();
await verifySelection();
await verifySlides();
await verifyTelegramFormatting();
await verifyTelegramPhotoFormatting();
await verifyPolymarketTweetFormatting();
await verifyTelegramClient();
await verifyTelegramPhotoCardRender();
await verifyPolymarketTweetPhotoCardRender();
await verifyTranslatePayload();
await verifyTimelineSelection();
await verifyRender();
await verifyPipeline();

console.log("All verification checks passed.");

async function verifyCrawl() {
  const result = await crawlPolymarketFromApiPayload(SAMPLE_POLYMARKET_EVENTS, "https://polymarket.com/");
  assert.equal(result.cards.length, 4, "expected 4 API cards from sample fixture");
  assert.equal(result.cards[0]?.sectionName, "정치");
  assert.equal(result.cards[0]?.markets[0]?.yesProb, 100);
}

async function verifyNormalize() {
  const result = normalizeCards([
    {
      sectionName: "정치",
      cardIndex: 0,
      eventTitle: "Will X happen?",
      eventDescription: "First",
      eventUrl: "https://polymarket.com/event/will-x-happen",
      volumeText: "$4M Vol.",
      volumeNum: 4_000_000,
      markets: [{ label: "Yes", yesProb: 55, noProb: 45 }],
      scrapedAt: "2026-03-20T00:00:00.000Z",
      sourcePage: "https://polymarket.com/",
    },
    {
      sectionName: "경제",
      cardIndex: 5,
      eventTitle: "Will X happen?",
      eventDescription: "Second",
      eventUrl: "https://polymarket.com/event/will-x-happen",
      volumeText: "$8M Vol.",
      volumeNum: 8_000_000,
      markets: [{ label: "No", yesProb: 20, noProb: 80 }],
      scrapedAt: "2026-03-20T00:05:00.000Z",
      sourcePage: "https://polymarket.com/",
    },
  ]);

  assert.equal(result.events.length, 1, "expected deduped event count");
  assert.equal(result.events[0]?.volumeText, "$8M Vol.");
  assert.equal(result.events[0]?.eventDescription, "First");
}

async function verifyCryptoPageNormalization() {
  const events = normalizeCryptoEventAnchors(
    [
      {
        href: "/event/bitcoin-above",
        text: "",
        imageSrc: "https://images.polymarket.com/btc-card.png",
        order: 0,
      },
      {
        href: "/event/bitcoin-above",
        text: "Bitcoin above ___ on March 21?",
        imageSrc: "https://images.polymarket.com/btc.png",
        order: 1,
      },
      {
        href: "/event/bitcoin-above/bitcoin-above-60000",
        text: "Yes 100%",
        imageSrc: "https://images.polymarket.com/btc-small.png",
        order: 2,
      },
      {
        href: "/event/ethereum-above",
        text: "Ethereum above ___ on March 21?",
        imageSrc: "https://images.polymarket.com/eth.png",
        order: 3,
      },
      {
        href: "/event/ethereum-above?marketSlug=ethereum-above-1700&outcomeIndex=1",
        text: "No <1%",
        imageSrc: "https://images.polymarket.com/eth-small.png",
        order: 4,
      },
    ],
    "https://polymarket.com/crypto",
    "2026-03-21T00:00:00.000Z",
  );

  assert.equal(events.length, 2, "expected deduped crypto event links");
  assert.equal(events[0]?.eventTitle, "Bitcoin above ___ on March 21?");
  assert.equal(events[0]?.eventUrl, "https://polymarket.com/event/bitcoin-above");
  assert.equal(events[0]?.thumbnailUrl, "https://images.polymarket.com/btc.png");
}

async function verifyEventMetaExtraction() {
  const meta = extractEventPageMeta(`
    <html>
      <head>
        <meta property="og:title" content="Bitcoin price on March 22?" />
        <meta name="description" content="Predict the bitcoin price range." />
        <meta property="og:image" content="https://images.polymarket.com/btc.png" />
      </head>
    </html>
  `);

  assert.equal(meta.title, "Bitcoin price on March 22?");
  assert.equal(meta.description, "Predict the bitcoin price range.");
  assert.equal(meta.imageUrl, "https://images.polymarket.com/btc.png");
}

async function verifySelection() {
  const events = [
    createEvent(0, "Will Bitcoin hit 120k?", "$90M Vol.", 90_000_000),
    createEvent(1, "Will Ethereum hit 8k?", "$30M Vol.", 30_000_000),
    createEvent(2, "Will Biden drop out?", "$8M Vol.", 8_000_000),
    createEvent(3, "Will Solana hit 300?", "$25M Vol.", 25_000_000),
    createEvent(4, "Will crude oil hit 100?", "$44M Vol.", 44_000_000),
  ];

  const selected = selectTopEvents(events);
  assert.equal(selected.length, 4, "selection should return four events");
  assert.equal(new Set(selected.map((event) => event.eventId)).size, 4);
}

async function verifySlides() {
  const slides = buildSlidesForEvent({
    ...createEvent(0, "Will Crude Oil hit $100?", "$44M Vol.", 44_000_000),
    thumbnailUrl: "https://example.com/oil.png",
    selectionScore: 4.2,
    scoreBreakdown: {
      sectionWeight: 1,
      volumeScore: 1,
      diversityBoost: 1,
      probabilitySignal: 0.7,
      freshnessScore: 0.5,
    },
  });

  assert.equal(slides.length, 5, "expected five slide specs");
  assert.equal(slides[3]?.layout, "context");
  assert.equal(slides[4]?.layout, "source");
  assert.equal(slides[1]?.marketSnapshot?.title, "Yes");
  assert.ok(slides[4]?.ctaItems?.some((item) => item.includes("팔로우")));
}

async function verifyTelegramFormatting() {
  const messages = buildCryptoTelegramMessages(
    [
      {
        eventTitle: "Bitcoin above ___ on March 21?",
        eventUrl: "https://polymarket.com/event/bitcoin-above",
        sourcePage: "https://polymarket.com/crypto",
        scrapedAt: "2026-03-21T00:00:00.000Z",
      },
      {
        eventTitle: "Ethereum above ___ on March 21?",
        eventUrl: "https://polymarket.com/event/ethereum-above",
        sourcePage: "https://polymarket.com/crypto",
        scrapedAt: "2026-03-21T00:00:00.000Z",
      },
      {
        eventTitle: "What price will Solana hit in March?",
        eventUrl: "https://polymarket.com/event/solana-price-in-march",
        sourcePage: "https://polymarket.com/crypto",
        scrapedAt: "2026-03-21T00:00:00.000Z",
      },
    ],
    {
      generatedAt: "2026-03-21T00:00:00.000Z",
      maxMessageLength: 320,
    },
  );

  assert.ok(messages.length >= 2, "expected digest to chunk across multiple Telegram messages");
  assert.ok(messages[0]?.includes("Bitcoin above ___ on March 21?"));
  assert.ok(messages[messages.length - 1]?.includes("continued"));
}

async function verifyTelegramPhotoFormatting() {
  const posts = buildCryptoTelegramPhotoPosts([
    {
      eventTitle: "What price will Ethereum hit in March?",
      eventUrl: "https://polymarket.com/event/what-price-will-ethereum-hit-in-march-2026",
      sourcePage: "https://polymarket.com/",
      scrapedAt: "2026-03-21T00:00:00.000Z",
      eventDescription: "Tracks whether ETH reaches specific price targets during March 2026.",
      thumbnailUrl: "https://images.polymarket.com/eth.png",
      category: "Crypto",
      volumeText: "$14.7M Vol.",
      volumeNum: 14_700_000,
      markets: [{ label: "Hit $2,400", yesProb: 35, noProb: 65 }],
    },
  ]);

  assert.equal(posts.length, 1);
  assert.equal(posts[0]?.photo, "https://images.polymarket.com/eth.png");
  assert.ok(posts[0]?.caption.includes("🟢데일리 폴리마켓 이벤트🟢"));
  assert.ok(posts[0]?.caption.includes("이더리움 가격은 3월에 어디까지 갈까?"));
  assert.ok(posts[0]?.caption.includes("원문 보기: https://polymarket.com/event/what-price-will-ethereum-hit-in-march-2026"));

  const cryptoPosts = buildCryptoTelegramPhotoPosts([
    {
      eventTitle: "What price will Bitcoin hit in March?",
      eventUrl: "https://polymarket.com/event/what-price-will-bitcoin-hit-in-march-2026",
      sourcePage: "https://polymarket.com/crypto",
      scrapedAt: "2026-03-21T00:00:00.000Z",
      thumbnailUrl: "https://images.polymarket.com/btc.png",
      category: "Crypto",
      markets: [],
    },
  ]);

  assert.ok(!cryptoPosts[0]?.caption.includes("현재 폴리마켓"));
  assert.ok(cryptoPosts[0]?.caption.includes("원문 보기: https://polymarket.com/event/what-price-will-bitcoin-hit-in-march-2026"));

  const localizedPosts = buildCryptoTelegramPhotoPosts([
    {
      eventTitle: "Bitcoin price on March 22?",
      eventUrl: "https://polymarket.com/event/bitcoin-price-on-march-22",
      sourcePage: "https://polymarket.com/crypto",
      scrapedAt: "2026-03-21T00:00:00.000Z",
      category: "Crypto",
      markets: [],
    },
  ]);

  assert.ok(localizedPosts[0]?.caption.includes("비트코인 가격은 3월 22일에 얼마일까?"));

  const politicsPosts = buildCryptoTelegramPhotoPosts([
    {
      eventTitle: "Democratic Presidential Nominee 2028",
      eventUrl: "https://polymarket.com/event/democratic-presidential-nominee-2028",
      sourcePage: "https://polymarket.com/",
      scrapedAt: "2026-03-21T00:00:00.000Z",
      category: "Politics",
      markets: [],
    },
    {
      eventTitle: "Presidential Election Winner 2028",
      eventUrl: "https://polymarket.com/event/presidential-election-winner-2028",
      sourcePage: "https://polymarket.com/",
      scrapedAt: "2026-03-21T00:00:00.000Z",
      category: "Politics",
      markets: [],
    },
  ]);

  assert.ok(politicsPosts[0]?.caption.includes("2028년 민주당 대선 후보는 누가 될까?"));
  assert.ok(politicsPosts[1]?.caption.includes("2028년 미국 대선 승자는 누가 될까?"));
}

async function verifyPolymarketTweetFormatting() {
  const caption = buildPolymarketTweetCaption(
    {
      tweetId: "12345",
      url: "https://x.com/Polymarket/status/12345",
      text: "The market moved fast.",
      postedAt: "2026-04-03T03:15:00.000Z",
      isPinned: false,
    },
    "시장이 빠르게 움직였습니다.",
  );

  assert.ok(caption.includes("폴리마켓 X 번역"));
  assert.ok(caption.includes("시장이 빠르게 움직였습니다."));
  assert.ok(caption.includes("https://x.com/Polymarket/status/12345"));
  assert.ok(caption.includes("#Polymarket #트윗번역"));

  const translationCaption = buildTranslationCaption("시장이 빠르게 움직였습니다.", "#국제");
  assert.ok(translationCaption.includes("시장이 빠르게 움직였습니다."));
  assert.ok(translationCaption.includes("#국제"));
}

async function verifyTranslatePayload() {
  const translated = parseGoogleTranslatePayload([
    [
      ["폴리마켓", "Polymarket"],
      [" 업데이트", " update"],
    ],
  ]);

  assert.equal(translated, "폴리마켓 업데이트");
}

async function verifyTimelineSelection() {
  assert.equal(
    extractTweetIdFromUrl("https://x.com/Polymarket/status/1900000000000000000"),
    "1900000000000000000",
  );

  const tweets = selectTimelineTweets(
    [
      {
        tweetId: "1",
        url: "https://x.com/Polymarket/status/1",
        text: "Pinned tweet",
        postedAt: "2026-04-03T00:00:00.000Z",
        isPinned: true,
        isReply: false,
        isRepost: false,
      },
      {
        tweetId: "2",
        url: "https://x.com/Polymarket/status/2",
        text: "Reply tweet",
        postedAt: "2026-04-03T01:00:00.000Z",
        isPinned: false,
        isReply: true,
        isRepost: false,
      },
      {
        tweetId: "3",
        url: "https://x.com/Polymarket/status/3",
        text: "Fresh update",
        postedAt: "2026-04-03T02:00:00.000Z",
        isPinned: false,
        isReply: false,
        isRepost: false,
      },
    ],
    {
      maxTweets: 3,
      includePinned: false,
    },
  );

  assert.deepEqual(
    tweets.map((tweet) => tweet.tweetId),
    ["3"],
  );
}

async function verifyTelegramClient() {
  let capturedUrl = "";
  let capturedBody = "";

  const client = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (input, init) => {
      capturedUrl = String(input);
      capturedBody = String(init?.body ?? "");

      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 77,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const messageId = await client.sendMessage({
    chatId: "-10012345",
    text: "hello",
    messageThreadId: 77,
  });

  assert.equal(messageId, 77);
  assert.equal(capturedUrl, "https://api.telegram.org/bottest-token/sendMessage");
  assert.match(capturedBody, /"chat_id":"-10012345"/);
  assert.match(capturedBody, /"message_thread_id":77/);

  let photoUrl = "";
  let photoBody = "";
  const photoClient = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (input, init) => {
      photoUrl = String(input);
      photoBody = String(init?.body ?? "");

      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 88,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const photoMessageId = await photoClient.sendPhoto({
    chatId: "-10012345",
    photo: "https://images.polymarket.com/sol.png",
    caption: "솔라나 이벤트",
    messageThreadId: 88,
  });

  assert.equal(photoMessageId, 88);
  assert.equal(photoUrl, "https://api.telegram.org/bottest-token/sendPhoto");
  assert.match(photoBody, /"photo":"https:\/\/images\.polymarket\.com\/sol\.png"/);
  assert.match(photoBody, /"message_thread_id":88/);

  let mediaGroupUrl = "";
  let mediaGroupBody = "";
  const mediaGroupClient = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (input, init) => {
      mediaGroupUrl = String(input);
      mediaGroupBody = String(init?.body ?? "");

      return new Response(
        JSON.stringify({
          ok: true,
          result: [{ message_id: 91 }],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const mediaGroupMessageId = await mediaGroupClient.sendMediaGroup({
    chatId: "-10012345",
    photos: [
      "https://pbs.twimg.com/media/a.jpg?name=large",
      "https://pbs.twimg.com/media/b.jpg?name=large",
    ],
    caption: "번역문",
    messageThreadId: 10,
  });

  assert.equal(mediaGroupMessageId, 91);
  assert.equal(mediaGroupUrl, "https://api.telegram.org/bottest-token/sendMediaGroup");
  assert.match(mediaGroupBody, /"caption":"번역문"/);
  assert.match(mediaGroupBody, /"message_thread_id":10/);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-client-"));
  const tempFile = path.join(tempDir, "card.png");
  await fs.writeFile(tempFile, Buffer.from([0x89, 0x50, 0x4e, 0x47]));

  let multipartBody;
  const uploadClient = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (_input, init) => {
      multipartBody = init?.body;

      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 90,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const multipartMessageId = await uploadClient.sendPhoto({
    chatId: "-10012345",
    photo: tempFile,
    caption: "합성 카드",
    messageThreadId: 16,
  });

  assert.equal(multipartMessageId, 90);
  assert.ok(multipartBody instanceof FormData);
  assert.equal(multipartBody.get("chat_id"), "-10012345");
  assert.equal(multipartBody.get("caption"), "합성 카드");
  assert.equal(multipartBody.get("message_thread_id"), "16");
  assert.ok(multipartBody.get("photo") instanceof File);
}

async function verifyTelegramPhotoCardRender() {
  const filePath = await renderTelegramPhotoCard({
    eventTitle: "What price will Ethereum hit in March?",
    eventUrl: "https://polymarket.com/event/what-price-will-ethereum-hit-in-march-2026",
    sourcePage: "https://polymarket.com/",
    scrapedAt: "2026-03-21T00:00:00.000Z",
    thumbnailUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='800' height='800' fill='%23657cff'/></svg>",
    category: "Crypto",
    volumeText: "$14.7M Vol.",
    volumeNum: 14_700_000,
    markets: [{ label: "Hit $2,400", yesProb: 35, noProb: 65 }],
  });

  assert.ok(filePath);
  const stat = await fs.stat(filePath);
  assert.ok(stat.size > 0);
}

async function verifyPolymarketTweetPhotoCardRender() {
  const filePath = await renderPolymarketTweetPhotoCard({
    tweetId: "12345",
    url: "https://x.com/Polymarket/status/12345",
    text: "Markets are reacting to a new development in Washington.",
    postedAt: "2026-04-03T03:15:00.000Z",
    avatarUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%231d9bf0'/></svg>",
    isPinned: false,
  }, {
    translatedText: "워싱턴의 새로운 전개에 시장이 반응하고 있습니다.",
    hashtag: "#국제",
  });

  assert.ok(filePath);
  const stat = await fs.stat(filePath);
  assert.ok(stat.size > 0);
}

async function verifyRender() {
  const browser = await launchRenderingBrowser();
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-render-"));

  try {
    const slides = buildSlidesForEvent({
      ...createEvent(0, "Will Crude Oil hit $100?", "$44M Vol.", 44_000_000),
      thumbnailUrl: "https://example.com/oil.png",
      selectionScore: 4.2,
      scoreBreakdown: {
        sectionWeight: 1,
        volumeScore: 1,
        diversityBoost: 1,
        probabilitySignal: 0.7,
        freshnessScore: 0.5,
      },
    });

    const result = await renderSlides(browser, "oil", slides, tempDir);
    assert.equal(result.imagePaths.length, 5);
    assert.equal(result.qa.length, 5);

    const firstImage = await fs.stat(result.imagePaths[0]);
    assert.ok(firstImage.size > 0, "expected rendered image bytes");
  } finally {
    await browser.close();
  }
}

async function verifyPipeline() {
  const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pm-run-"));
  const manifest = await runPipeline({
    fixturePayload: SAMPLE_POLYMARKET_EVENTS,
    outputRoot,
    runId: "verify-run",
  });

  assert.equal(manifest.selectedEvents.length, 4);
  assert.equal(manifest.usedFallbackSnapshot, false);

  const eventDir = path.join(outputRoot, "runs", "verify-run", "events", manifest.selectedEvents[0].eventId);
  await fs.stat(path.join(eventDir, "01-hook.png"));
  await fs.stat(path.join(eventDir, "02-breakdown.png"));
  await fs.stat(path.join(eventDir, "03-insight.png"));
  await fs.stat(path.join(eventDir, "04-context.png"));
  await fs.stat(path.join(eventDir, "05-source.png"));
}

function createEvent(index, title, volumeText, volumeNum) {
  return {
    eventId: `event-${index}`,
    sectionName: index % 2 === 0 ? "정치" : "가상자산",
    cardIndex: index,
    eventTitle: title,
    eventDescription: "Sample description",
    eventUrl: `https://polymarket.com/event/${index}`,
    volumeText,
    volumeNum,
    markets: [{ label: "Yes", yesProb: 60 - index, noProb: 40 + index }],
    scrapedAt: "2026-03-20T00:00:00.000Z",
  };
}
