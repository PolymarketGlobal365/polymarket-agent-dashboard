import test from "node:test";
import assert from "node:assert/strict";

import { buildCryptoTelegramPhotoPosts } from "./photo-format.js";

test("buildCryptoTelegramPhotoPosts creates short channel-style captions", () => {
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
  assert.match(posts[0]?.caption ?? "", /^🟢데일리 폴리마켓 이벤트🟢/);
  assert.match(posts[0]?.caption ?? "", /이더리움 가격은 3월에 어디까지 갈까\?/);
  assert.match(posts[0]?.caption ?? "", /원문 보기: https:\/\/polymarket.com\/event\/what-price-will-ethereum-hit-in-march-2026/);
});

test("buildCryptoTelegramPhotoPosts omits source description lines", () => {
  const posts = buildCryptoTelegramPhotoPosts([
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

  assert.doesNotMatch(posts[0]?.caption ?? "", /현재 폴리마켓/);
  assert.match(posts[0]?.caption ?? "", /원문 보기: https:\/\/polymarket.com\/event\/what-price-will-bitcoin-hit-in-march-2026/);
});

test("buildCryptoTelegramPhotoPosts translates simple price questions into Korean", () => {
  const posts = buildCryptoTelegramPhotoPosts([
    {
      eventTitle: "Bitcoin price on March 22?",
      eventUrl: "https://polymarket.com/event/bitcoin-price-on-march-22",
      sourcePage: "https://polymarket.com/crypto",
      scrapedAt: "2026-03-21T00:00:00.000Z",
      category: "Crypto",
      markets: [],
    },
  ]);

  assert.match(posts[0]?.caption ?? "", /비트코인 가격은 3월 22일에 얼마일까\?/);
});

test("buildCryptoTelegramPhotoPosts translates major political headline formats into Korean", () => {
  const posts = buildCryptoTelegramPhotoPosts([
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

  assert.match(posts[0]?.caption ?? "", /2028년 민주당 대선 후보는 누가 될까\?/);
  assert.match(posts[1]?.caption ?? "", /2028년 미국 대선 승자는 누가 될까\?/);
});
