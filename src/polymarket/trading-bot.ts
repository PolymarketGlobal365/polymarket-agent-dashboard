import { cleanText } from "../lib/strings.js";

const DEFAULT_GAMMA_API_URL = "https://gamma-api.polymarket.com/events";
const DEFAULT_CLOB_API_URL = "https://clob.polymarket.com";
const DEFAULT_REWARDS_PATH = "/rewards/markets/current";

export type RewardTradingBotOptions = {
  gammaApiUrl?: string;
  clobApiUrl?: string;
  rewardsPath?: string;
  maxRewardPages?: number;
  eventsLimit?: number;
  maxMarkets?: number;
  minDailyRewardRate?: number;
  minLiquidity?: number;
  allowedCategories?: string[];
  allowedTags?: string[];
  fetchImpl?: typeof fetch;
};

export type RewardQuoteDecision = {
  action: "quote" | "avoid";
  regime: "coarse" | "fine" | "fallback";
  targetPrice?: number;
  candidateCount: number;
  bandLower: number;
  bandUpper: number;
  note: string;
};

export type RewardTradingSignal = {
  signalId: string;
  eventTitle: string;
  eventUrl: string;
  marketQuestion: string;
  marketSlug: string;
  category?: string;
  tags: string[];
  conditionId: string;
  outcomeLabel: string;
  tokenId: string;
  score: number;
  bias: "bullish" | "bearish" | "neutral";
  action: "passive-entry" | "watch-only";
  rewardDailyRate: number;
  rewardMinSize: number;
  rewardMaxSpreadCents: number;
  bestBid: number;
  bestAsk: number;
  midpoint: number;
  displayedSpreadCents: number;
  lastTradePrice: number;
  dayChangePct: number;
  weekChangePct: number;
  bookImbalance: number;
  quote: RewardQuoteDecision;
  headlineReason: string;
};

export type RewardTradingSnapshot = {
  generatedAt: string;
  signals: RewardTradingSignal[];
  scannedMarkets: number;
  shortlistedMarkets: number;
};

type ApiTag = {
  label?: string;
  slug?: string;
};

type ApiRewardPage = {
  data?: ApiRewardMarket[];
  next_cursor?: string;
};

type ApiRewardMarket = {
  condition_id?: string;
  rewards_max_spread?: number;
  rewards_min_size?: number;
  total_daily_rate?: number;
  native_daily_rate?: number;
  sponsored_daily_rate?: number;
};

type ApiEvent = {
  title?: string;
  slug?: string;
  category?: string;
  tags?: ApiTag[];
  markets?: ApiMarket[];
};

type ApiMarket = {
  question?: string;
  slug?: string;
  conditionId?: string;
  outcomes?: string | string[];
  clobTokenIds?: string | string[];
  active?: boolean;
  closed?: boolean;
  acceptingOrders?: boolean;
  bestBid?: number | string;
  bestAsk?: number | string;
  lastTradePrice?: number | string;
  spread?: number | string;
  orderPriceMinTickSize?: number | string;
  volume24hr?: number | string;
  volumeNum?: number | string;
  liquidityClob?: number | string;
  oneDayPriceChange?: number | string;
  oneWeekPriceChange?: number | string;
  rewardsMinSize?: number | string;
  rewardsMaxSpread?: number | string;
};

type OrderBookLevel = {
  price: number;
  size: number;
};

type OrderBook = {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  tickSize: number;
  lastTradePrice: number;
};

type CandidateMarket = {
  eventTitle: string;
  eventUrl: string;
  category?: string;
  tags: string[];
  marketQuestion: string;
  marketSlug: string;
  conditionId: string;
  outcomes: string[];
  tokenIds: string[];
  bestBid: number;
  bestAsk: number;
  spread: number;
  tickSize: number;
  lastTradePrice: number;
  dayChange: number;
  weekChange: number;
  volume24hr: number;
  liquidityClob: number;
  rewardDailyRate: number;
  rewardMinSize: number;
  rewardMaxSpreadCents: number;
  prelimScore: number;
};

type RewardConfig = {
  conditionId: string;
  rewardDailyRate: number;
  rewardMinSize: number;
  rewardMaxSpreadCents: number;
};

export async function buildRewardTradingSnapshot(
  options: RewardTradingBotOptions = {},
): Promise<RewardTradingSnapshot> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const rewards = await fetchRewardConfigs({
    clobApiUrl: options.clobApiUrl ?? DEFAULT_CLOB_API_URL,
    rewardsPath: options.rewardsPath ?? DEFAULT_REWARDS_PATH,
    maxPages: options.maxRewardPages ?? 6,
    fetchImpl,
  });
  const events = await fetchActiveEvents({
    gammaApiUrl: options.gammaApiUrl ?? DEFAULT_GAMMA_API_URL,
    limit: options.eventsLimit ?? 400,
    fetchImpl,
  });

  const candidates = collectCandidateMarkets(events, rewards, {
    minDailyRewardRate: options.minDailyRewardRate ?? 1,
    minLiquidity: options.minLiquidity ?? 1_000,
    allowedCategories: normalizeFilters(options.allowedCategories),
    allowedTags: normalizeFilters(options.allowedTags),
  });

  const shortlisted = candidates
    .sort((left, right) => right.prelimScore - left.prelimScore)
    .slice(0, Math.max(1, options.maxMarkets ?? 8));

  const signals = (
    await Promise.all(
      shortlisted.flatMap((candidate) =>
        candidate.outcomes.map((outcomeLabel, index) =>
          buildSignal(candidate, {
            outcomeLabel,
            tokenId: candidate.tokenIds[index] ?? "",
            fetchImpl,
            clobApiUrl: options.clobApiUrl ?? DEFAULT_CLOB_API_URL,
          }),
        ),
      ),
    )
  )
    .filter((signal): signal is RewardTradingSignal => Boolean(signal))
    .sort((left, right) => right.score - left.score);

  return {
    generatedAt: new Date().toISOString(),
    signals,
    scannedMarkets: candidates.length,
    shortlistedMarkets: shortlisted.length,
  };
}

export function decidePassiveRewardQuote(input: {
  bids: OrderBookLevel[];
  midpoint: number;
  rewardMaxSpreadCents: number;
  tickSize: number;
}): RewardQuoteDecision {
  const rewardHalfWidth = input.rewardMaxSpreadCents / 200;
  const bandLower = clamp01(input.midpoint - rewardHalfWidth);
  const bandUpper = clamp01(input.midpoint);
  const eligibleBids = input.bids
    .filter((level) => level.price >= bandLower && level.price <= bandUpper)
    .sort((left, right) => right.price - left.price);

  if (approxEqual(input.tickSize, 0.01)) {
    if (eligibleBids.length <= 2) {
      return {
        action: "avoid",
        regime: "coarse",
        candidateCount: eligibleBids.length,
        bandLower,
        bandUpper,
        note: "Coarse-tick market has too few rewarded bid levels inside the band.",
      };
    }

    const targetIndex = eligibleBids.length === 3 ? 1 : Math.max(1, eligibleBids.length - 2);
    const target = eligibleBids[targetIndex]?.price;
    if (target === undefined) {
      return {
        action: "avoid",
        regime: "coarse",
        candidateCount: eligibleBids.length,
        bandLower,
        bandUpper,
        note: "Could not derive a stable coarse-tick quote from the current book.",
      };
    }

    return {
      action: "quote",
      regime: "coarse",
      targetPrice: target,
      candidateCount: eligibleBids.length,
      bandLower,
      bandUpper,
      note: "Selected the mid-band bid lane used for coarse-tick rewarded markets.",
    };
  }

  if (approxEqual(input.tickSize, 0.001)) {
    const target = roundToTick(input.midpoint - rewardHalfWidth * 0.5, input.tickSize);
    return {
      action: "quote",
      regime: "fine",
      targetPrice: clamp01(target),
      candidateCount: eligibleBids.length,
      bandLower,
      bandUpper,
      note: "Targeted the 50% reward-band distance used for fine-tick rewarded markets.",
    };
  }

  const fallbackTarget = eligibleBids[0]?.price;
  return {
    action: fallbackTarget !== undefined ? "quote" : "avoid",
    regime: "fallback",
    ...(fallbackTarget !== undefined ? { targetPrice: fallbackTarget } : {}),
    candidateCount: eligibleBids.length,
    bandLower,
    bandUpper,
    note: "Used the best rewarded bid inside the band because the tick regime is non-standard.",
  };
}

async function buildSignal(
  candidate: CandidateMarket,
  options: {
    outcomeLabel: string;
    tokenId: string;
    clobApiUrl: string;
    fetchImpl: typeof fetch;
  },
): Promise<RewardTradingSignal | undefined> {
  if (!options.tokenId) {
    return undefined;
  }

  const book = await fetchOrderBook({
    clobApiUrl: options.clobApiUrl,
    tokenId: options.tokenId,
    fetchImpl: options.fetchImpl,
  });

  const bestBid = book.bids[0]?.price ?? 0;
  const bestAsk = book.asks[0]?.price ?? 1;
  const midpoint = computeDisplayedMidpoint(bestBid, bestAsk, book.lastTradePrice);
  const quote = decidePassiveRewardQuote({
    bids: book.bids,
    midpoint,
    rewardMaxSpreadCents: candidate.rewardMaxSpreadCents,
    tickSize: book.tickSize,
  });

  const direction = /^no$/i.test(options.outcomeLabel) ? -1 : 1;
  const dayChangePct = candidate.dayChange * direction * 100;
  const weekChangePct = candidate.weekChange * direction * 100;
  const bookImbalance = computeBookImbalance(book);
  const biasScore = dayChangePct * 0.12 + weekChangePct * 0.06 + bookImbalance * 2.2;
  const bias = biasScore >= 0.5 ? "bullish" : biasScore <= -0.5 ? "bearish" : "neutral";
  const quoteBonus = quote.action === "quote" ? 1.2 : -0.8;
  const score = roundScore(candidate.prelimScore + quoteBonus + biasScore);

  return {
    signalId: `${candidate.conditionId}:${options.outcomeLabel.toLowerCase()}`,
    eventTitle: candidate.eventTitle,
    eventUrl: candidate.eventUrl,
    marketQuestion: candidate.marketQuestion,
    marketSlug: candidate.marketSlug,
    ...(candidate.category ? { category: candidate.category } : {}),
    tags: candidate.tags,
    conditionId: candidate.conditionId,
    outcomeLabel: options.outcomeLabel,
    tokenId: options.tokenId,
    score,
    bias,
    action: quote.action === "quote" ? "passive-entry" : "watch-only",
    rewardDailyRate: candidate.rewardDailyRate,
    rewardMinSize: candidate.rewardMinSize,
    rewardMaxSpreadCents: candidate.rewardMaxSpreadCents,
    bestBid,
    bestAsk,
    midpoint,
    displayedSpreadCents: Math.max(0, bestAsk - bestBid) * 100,
    lastTradePrice: book.lastTradePrice,
    dayChangePct,
    weekChangePct,
    bookImbalance,
    quote,
    headlineReason: buildHeadlineReason({
      rewardDailyRate: candidate.rewardDailyRate,
      rewardMinSize: candidate.rewardMinSize,
      dayChangePct,
      weekChangePct,
      bookImbalance,
      quoteAction: quote.action,
    }),
  };
}

async function fetchRewardConfigs(options: {
  clobApiUrl: string;
  rewardsPath: string;
  maxPages: number;
  fetchImpl: typeof fetch;
}): Promise<Map<string, RewardConfig>> {
  const rewards = new Map<string, RewardConfig>();
  let cursor: string | undefined;

  for (let page = 0; page < options.maxPages; page += 1) {
    const url = new URL(options.rewardsPath, options.clobApiUrl);
    if (cursor) {
      url.searchParams.set("next_cursor", cursor);
    }

    const response = await options.fetchImpl(url, {
      headers: {
        accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch reward markets: ${response.status}`);
    }

    const payload = (await response.json()) as ApiRewardPage;
    for (const market of payload.data ?? []) {
      const conditionId = cleanText(market.condition_id).toLowerCase();
      if (!conditionId) {
        continue;
      }

      rewards.set(conditionId, {
        conditionId,
        rewardDailyRate: pickNumber(
          market.total_daily_rate,
          market.native_daily_rate,
          market.sponsored_daily_rate,
        ),
        rewardMinSize: pickNumber(market.rewards_min_size),
        rewardMaxSpreadCents: pickNumber(market.rewards_max_spread),
      });
    }

    const nextCursor = cleanText(payload.next_cursor);
    if (!nextCursor || nextCursor === cursor) {
      break;
    }
    cursor = nextCursor;
  }

  return rewards;
}

async function fetchActiveEvents(options: {
  gammaApiUrl: string;
  limit: number;
  fetchImpl: typeof fetch;
}): Promise<ApiEvent[]> {
  const url = new URL(options.gammaApiUrl);
  url.searchParams.set("limit", String(options.limit));
  url.searchParams.set("active", "true");
  url.searchParams.set("closed", "false");
  url.searchParams.set("archived", "false");

  const response = await options.fetchImpl(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch active Polymarket events: ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload) ? (payload as ApiEvent[]) : [];
}

function collectCandidateMarkets(
  events: ApiEvent[],
  rewards: Map<string, RewardConfig>,
  options: {
    minDailyRewardRate: number;
    minLiquidity: number;
    allowedCategories: string[];
    allowedTags: string[];
  },
): CandidateMarket[] {
  const collected: CandidateMarket[] = [];

  for (const event of events) {
    const eventTitle = cleanText(event.title);
    const eventSlug = cleanText(event.slug);
    if (!eventTitle || !eventSlug) {
      continue;
    }

    const eventUrl = `https://polymarket.com/event/${eventSlug}`;
    const category = cleanText(event.category);
    const tags = (event.tags ?? [])
      .flatMap((tag) => [cleanText(tag.label), cleanText(tag.slug)])
      .filter(Boolean);

    if (!passesFilters({ category, tags }, options.allowedCategories, options.allowedTags)) {
      continue;
    }

    for (const market of event.markets ?? []) {
      if (market.active === false || market.closed || market.acceptingOrders === false) {
        continue;
      }

      const conditionId = cleanText(market.conditionId).toLowerCase();
      const marketQuestion = cleanText(market.question);
      const marketSlug = cleanText(market.slug);
      if (!conditionId || !marketQuestion || !marketSlug) {
        continue;
      }

      const reward = rewards.get(conditionId);
      const rewardDailyRate = reward?.rewardDailyRate ?? pickNumber(0);
      const rewardMinSize = reward?.rewardMinSize ?? pickNumber(market.rewardsMinSize);
      const rewardMaxSpreadCents = reward?.rewardMaxSpreadCents ?? pickNumber(market.rewardsMaxSpread);
      if (rewardDailyRate < options.minDailyRewardRate || rewardMaxSpreadCents <= 0) {
        continue;
      }

      const outcomes = parseStringArray(market.outcomes);
      const tokenIds = parseStringArray(market.clobTokenIds);
      if (outcomes.length !== 2 || tokenIds.length !== 2) {
        continue;
      }

      const liquidityClob = pickNumber(market.liquidityClob);
      if (liquidityClob < options.minLiquidity) {
        continue;
      }

      const bestBid = pickNumber(market.bestBid);
      const bestAsk = pickNumber(market.bestAsk, 1);
      const spread = pickNumber(market.spread, Math.max(bestAsk - bestBid, 0));
      const tickSize = pickNumber(market.orderPriceMinTickSize, 0.01);
      const lastTradePrice = pickNumber(market.lastTradePrice, computeDisplayedMidpoint(bestBid, bestAsk, 0.5));
      const volume24hr = pickNumber(market.volume24hr, market.volumeNum);
      const dayChange = pickSignedNumber(market.oneDayPriceChange);
      const weekChange = pickSignedNumber(market.oneWeekPriceChange);

      const prelimScore = roundScore(
        Math.log10(rewardDailyRate + 1) * 3
        + Math.log10(liquidityClob + 10)
        + Math.log10(volume24hr + 10)
        - Math.max(0, spread * 100 - rewardMaxSpreadCents) * 0.15,
      );

      collected.push({
        eventTitle,
        eventUrl,
        ...(category ? { category } : {}),
        tags,
        marketQuestion,
        marketSlug,
        conditionId,
        outcomes,
        tokenIds,
        bestBid,
        bestAsk,
        spread,
        tickSize,
        lastTradePrice,
        dayChange,
        weekChange,
        volume24hr,
        liquidityClob,
        rewardDailyRate,
        rewardMinSize,
        rewardMaxSpreadCents,
        prelimScore,
      });
    }
  }

  return collected;
}

async function fetchOrderBook(options: {
  clobApiUrl: string;
  tokenId: string;
  fetchImpl: typeof fetch;
}): Promise<OrderBook> {
  const url = new URL("/book", options.clobApiUrl);
  url.searchParams.set("token_id", options.tokenId);

  const response = await options.fetchImpl(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch order book for token ${options.tokenId}: ${response.status}`);
  }

  const payload = (await response.json()) as {
    bids?: Array<{ price?: string; size?: string }>;
    asks?: Array<{ price?: string; size?: string }>;
    tick_size?: string;
    last_trade_price?: string;
  };

  return {
    bids: normalizeBookLevels(payload.bids),
    asks: normalizeBookLevels(payload.asks).sort((left, right) => left.price - right.price),
    tickSize: pickNumber(payload.tick_size, 0.01),
    lastTradePrice: pickNumber(payload.last_trade_price, 0.5),
  };
}

function normalizeBookLevels(levels: Array<{ price?: string; size?: string }> | undefined): OrderBookLevel[] {
  return (levels ?? [])
    .map((level) => ({
      price: pickNumber(level.price),
      size: pickNumber(level.size),
    }))
    .filter((level) => level.price > 0 && level.size > 0);
}

function computeDisplayedMidpoint(bestBid: number, bestAsk: number, lastTradePrice: number): number {
  if (bestBid > 0 && bestAsk > 0 && bestAsk >= bestBid) {
    return clamp01((bestBid + bestAsk) / 2);
  }

  return clamp01(lastTradePrice);
}

function computeBookImbalance(book: OrderBook): number {
  const bidSize = book.bids.slice(0, 5).reduce((total, level) => total + level.size, 0);
  const askSize = book.asks.slice(0, 5).reduce((total, level) => total + level.size, 0);
  const denominator = bidSize + askSize;

  if (denominator <= 0) {
    return 0;
  }

  return (bidSize - askSize) / denominator;
}

function buildHeadlineReason(input: {
  rewardDailyRate: number;
  rewardMinSize: number;
  dayChangePct: number;
  weekChangePct: number;
  bookImbalance: number;
  quoteAction: "quote" | "avoid";
}): string {
  const parts = [
    `rewards ${trimZeros(input.rewardDailyRate.toFixed(2))}/day`,
    `min size ${trimZeros(input.rewardMinSize.toFixed(0))}`,
    `1d ${formatSignedPercent(input.dayChangePct)}`,
    `1w ${formatSignedPercent(input.weekChangePct)}`,
    `book ${formatSignedPercent(input.bookImbalance * 100)}`,
    input.quoteAction === "quote" ? "entry lane available" : "band too thin",
  ];

  return parts.join(" | ");
}

function parseStringArray(input: string | string[] | undefined): string[] {
  if (Array.isArray(input)) {
    return input.map((value) => cleanText(String(value))).filter(Boolean);
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((value) => cleanText(String(value))).filter(Boolean);
      }
    } catch {
      return input.split(",").map((value) => cleanText(value)).filter(Boolean);
    }
  }

  return [];
}

function passesFilters(
  subject: { category?: string; tags: string[] },
  allowedCategories: string[],
  allowedTags: string[],
): boolean {
  const normalizedCategory = cleanText(subject.category).toLowerCase();
  const normalizedTags = subject.tags.map((tag) => tag.toLowerCase());

  if (allowedCategories.length > 0 && !allowedCategories.includes(normalizedCategory)) {
    return false;
  }

  if (allowedTags.length > 0 && !normalizedTags.some((tag) => allowedTags.includes(tag))) {
    return false;
  }

  return true;
}

function normalizeFilters(values: string[] | undefined): string[] {
  return (values ?? []).map((value) => cleanText(value).toLowerCase()).filter(Boolean);
}

function pickNumber(...values: Array<number | string | undefined>): number {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function pickSignedNumber(value: number | string | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function approxEqual(left: number, right: number): boolean {
  return Math.abs(left - right) < 0.0001;
}

function roundToTick(value: number, tickSize: number): number {
  if (tickSize <= 0) {
    return value;
  }

  return Math.round(value / tickSize) * tickSize;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}

function trimZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${trimZeros(value.toFixed(1))}%`;
}
