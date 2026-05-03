const DEFAULT_DATA_API_BASE_URL = "https://data-api.polymarket.com";

export type TraderLeaderboardEntry = {
  rank?: string;
  proxyWallet: string;
  userName?: string;
  vol?: number;
  pnl?: number;
  profileImage?: string;
  xUsername?: string;
  verifiedBadge?: boolean;
};

export type UserActivity = {
  proxyWallet: string;
  timestamp: number;
  type: string;
  size?: number;
  usdcSize?: number;
  transactionHash?: string;
  price?: number;
  asset?: string;
  side?: string;
  outcomeIndex?: number;
  title?: string;
  slug?: string;
  icon?: string;
  eventSlug?: string;
  outcome?: string;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
};

export type WhaleAlert = {
  alertId: string;
  proxyWallet: string;
  traderName: string;
  verified: boolean;
  xUsername?: string;
  side: "BUY" | "SELL" | "UNKNOWN";
  usdcSize?: number;
  size?: number;
  price?: number;
  marketTitle: string;
  outcome?: string;
  timestamp: number;
  transactionHash?: string;
  leaderboardRank?: string;
  leaderboardVolume?: number;
  leaderboardPnl?: number;
  iconUrl?: string;
};

export type BuildWhaleFeedOptions = {
  dataApiBaseUrl?: string;
  leaderboardLimit?: number;
  trackedWallets?: string[];
  activityLimitPerTrader?: number;
  minUsdcSize?: number;
  maxAlerts?: number;
  startTimestamp?: number;
  fetchImpl?: typeof fetch;
};

export type BuildWhaleFeedResult = {
  trackedTraders: TraderLeaderboardEntry[];
  alerts: WhaleAlert[];
};

export async function buildWhaleFeed(options: BuildWhaleFeedOptions = {}): Promise<BuildWhaleFeedResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const dataApiBaseUrl = options.dataApiBaseUrl ?? DEFAULT_DATA_API_BASE_URL;
  const leaderboardLimit = options.leaderboardLimit ?? 25;
  const activityLimitPerTrader = options.activityLimitPerTrader ?? 10;
  const minUsdcSize = options.minUsdcSize ?? 25_000;
  const maxAlerts = options.maxAlerts ?? 10;
  const startTimestamp = options.startTimestamp ?? Date.now() - 24 * 60 * 60 * 1_000;

  const leaderboard = await fetchLeaderboard({
    dataApiBaseUrl,
    limit: Math.min(leaderboardLimit, 500),
    fetchImpl,
  });

  const trackedWallets = normalizeTrackedWallets(options.trackedWallets);
  if (trackedWallets.length === 0) {
    const alerts = await buildGlobalAlerts({
      dataApiBaseUrl,
      fetchImpl,
      leaderboard,
      minUsdcSize,
      maxAlerts,
      startTimestamp,
      activityLimit: Math.min(Math.max(activityLimitPerTrader, maxAlerts * 20, 100), 500),
    });

    if (alerts.length > 0) {
      return {
        trackedTraders: leaderboard,
        alerts,
      };
    }

    const traders = leaderboard;
    const traderMap = new Map(traders.map((trader) => [trader.proxyWallet.toLowerCase(), trader]));
    const activityLists = await Promise.all(
      traders.map((trader) =>
        fetchUserActivity({
          dataApiBaseUrl,
          user: trader.proxyWallet,
          limit: activityLimitPerTrader,
          startTimestamp,
          fetchImpl,
        }),
      ),
    );

    const fallbackAlerts = activityLists
      .flatMap((activities) =>
        activities
          .filter((activity) => isWhaleTrade(activity, minUsdcSize))
          .map((activity) => toWhaleAlert(activity, traderMap.get(activity.proxyWallet.toLowerCase()))),
      )
      .sort((left, right) => right.timestamp - left.timestamp);

    return {
      trackedTraders: leaderboard,
      alerts: selectMixedAlerts(fallbackAlerts, maxAlerts),
    };
  }

  const traders = selectTrackedTraders(leaderboard, trackedWallets);
  const traderMap = new Map(traders.map((trader) => [trader.proxyWallet.toLowerCase(), trader]));

  const activityLists = await Promise.all(
    traders.map((trader) =>
      fetchUserActivity({
        dataApiBaseUrl,
        user: trader.proxyWallet,
        limit: activityLimitPerTrader,
        startTimestamp,
        fetchImpl,
      }),
    ),
  );

  const alerts = activityLists
    .flatMap((activities) =>
      activities
        .filter((activity) => isWhaleTrade(activity, minUsdcSize))
        .map((activity) => toWhaleAlert(activity, traderMap.get(activity.proxyWallet.toLowerCase()))),
    )
    .sort((left, right) => right.timestamp - left.timestamp);

  return {
    trackedTraders: traders,
    alerts: selectMixedAlerts(alerts, maxAlerts),
  };
}

export async function fetchLeaderboard(options: {
  dataApiBaseUrl?: string;
  limit?: number;
  fetchImpl?: typeof fetch;
} = {}): Promise<TraderLeaderboardEntry[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const dataApiBaseUrl = options.dataApiBaseUrl ?? DEFAULT_DATA_API_BASE_URL;
  const limit = options.limit ?? 25;
  const url = new URL("/v1/leaderboard", dataApiBaseUrl);
  url.searchParams.set("limit", String(limit));

  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.status}`);
  }

  const payload = (await response.json()) as TraderLeaderboardEntry[];
  return payload.filter((entry) => Boolean(entry.proxyWallet));
}

export async function fetchUserActivity(options: {
  dataApiBaseUrl?: string;
  user?: string;
  limit?: number;
  startTimestamp?: number;
  fetchImpl?: typeof fetch;
}): Promise<UserActivity[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const dataApiBaseUrl = options.dataApiBaseUrl ?? DEFAULT_DATA_API_BASE_URL;
  const limit = options.limit ?? 10;
  const url = new URL("/activity", dataApiBaseUrl);
  if (options.user) {
    url.searchParams.set("user", options.user);
  }
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("type", "TRADE");
  url.searchParams.set("sortBy", "TIMESTAMP");
  url.searchParams.set("sortDirection", "DESC");
  if (options.startTimestamp !== undefined) {
    url.searchParams.set("start", String(Math.max(Math.floor(options.startTimestamp / 1_000), 0)));
  }

  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch activity${options.user ? ` for ${options.user}` : ""}: ${response.status}`);
  }

  return (await response.json()) as UserActivity[];
}

export function formatTraderLabel(alert: Pick<WhaleAlert, "traderName" | "xUsername" | "verified">): string {
  const suffix = alert.xUsername ? ` (@${alert.xUsername})` : "";
  return `${alert.traderName}${suffix}${alert.verified ? " ✓" : ""}`;
}

export function formatUsdCompact(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return "n/a";
  }

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `$${trimTrailingZeros((value / 1_000_000_000).toFixed(2))}B`;
  }
  if (abs >= 1_000_000) {
    return `$${trimTrailingZeros((value / 1_000_000).toFixed(2))}M`;
  }
  if (abs >= 1_000) {
    return `$${trimTrailingZeros((value / 1_000).toFixed(1))}K`;
  }

  return `$${value.toFixed(0)}`;
}

export function formatProbability(value: number | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }

  return `${trimTrailingZeros((value * 100).toFixed(1))}%`;
}

function normalizeTrackedWallets(input: string[] | undefined): string[] {
  if (!input) {
    return [];
  }

  return [...new Set(input.map((wallet) => wallet.trim().toLowerCase()).filter(Boolean))];
}

async function buildGlobalAlerts(options: {
  dataApiBaseUrl: string;
  fetchImpl: typeof fetch;
  leaderboard: TraderLeaderboardEntry[];
  minUsdcSize: number;
  maxAlerts: number;
  startTimestamp: number;
  activityLimit: number;
}): Promise<WhaleAlert[]> {
  const traderMap = new Map(options.leaderboard.map((trader) => [trader.proxyWallet.toLowerCase(), trader]));

  try {
    const activities = await fetchUserActivity({
      dataApiBaseUrl: options.dataApiBaseUrl,
      limit: options.activityLimit,
      startTimestamp: options.startTimestamp,
      fetchImpl: options.fetchImpl,
    });

    return activities
      .filter((activity) => isWhaleTrade(activity, options.minUsdcSize))
      .map((activity) => toWhaleAlert(activity, traderMap.get(activity.proxyWallet.toLowerCase())))
      .sort((left, right) => right.timestamp - left.timestamp);
  } catch {
    return [];
  }
}

function selectMixedAlerts(alerts: WhaleAlert[], maxAlerts: number): WhaleAlert[] {
  if (maxAlerts <= 0) {
    return [];
  }

  const buys = alerts.filter((alert) => alert.side === "BUY");
  const sells = alerts.filter((alert) => alert.side === "SELL");

  if (buys.length === 0 || sells.length === 0) {
    return alerts.slice(0, maxAlerts);
  }

  const selected: WhaleAlert[] = [];
  let buyIndex = 0;
  let sellIndex = 0;
  let preferBuy = (buys[0]?.timestamp ?? 0) >= (sells[0]?.timestamp ?? 0);

  while (selected.length < maxAlerts && (buyIndex < buys.length || sellIndex < sells.length)) {
    if (preferBuy && buyIndex < buys.length) {
      const alert = buys[buyIndex];
      if (alert) {
        selected.push(alert);
      }
      buyIndex += 1;
    } else if (!preferBuy && sellIndex < sells.length) {
      const alert = sells[sellIndex];
      if (alert) {
        selected.push(alert);
      }
      sellIndex += 1;
    } else if (buyIndex < buys.length) {
      const alert = buys[buyIndex];
      if (alert) {
        selected.push(alert);
      }
      buyIndex += 1;
    } else if (sellIndex < sells.length) {
      const alert = sells[sellIndex];
      if (alert) {
        selected.push(alert);
      }
      sellIndex += 1;
    }

    preferBuy = !preferBuy;
  }

  for (const alert of alerts) {
    if (selected.length >= maxAlerts) {
      break;
    }
    if (!selected.includes(alert)) {
      selected.push(alert);
    }
  }

  return selected.slice(0, maxAlerts);
}

function selectTrackedTraders(leaderboard: TraderLeaderboardEntry[], trackedWallets: string[]): TraderLeaderboardEntry[] {
  const byWallet = new Map(leaderboard.map((entry) => [entry.proxyWallet.toLowerCase(), entry]));
  return trackedWallets.map((wallet) => byWallet.get(wallet) ?? ({ proxyWallet: wallet } satisfies TraderLeaderboardEntry));
}

function isWhaleTrade(activity: UserActivity, minUsdcSize: number): boolean {
  return activity.type === "TRADE"
    && typeof activity.usdcSize === "number"
    && activity.usdcSize >= minUsdcSize;
}

function toWhaleAlert(activity: UserActivity, trader: TraderLeaderboardEntry | undefined): WhaleAlert {
  const side = activity.side === "BUY" || activity.side === "SELL" ? activity.side : "UNKNOWN";
  const traderName = firstNonEmpty(
    activity.pseudonym,
    activity.name,
    trader?.userName,
    shortenWallet(activity.proxyWallet),
  ) ?? shortenWallet(activity.proxyWallet);

  return {
    alertId: buildAlertId(activity),
    proxyWallet: activity.proxyWallet,
    traderName,
    verified: Boolean(trader?.verifiedBadge),
    ...(trader?.xUsername ? { xUsername: trader.xUsername } : {}),
    side,
    ...(activity.usdcSize !== undefined ? { usdcSize: activity.usdcSize } : {}),
    ...(activity.size !== undefined ? { size: activity.size } : {}),
    ...(activity.price !== undefined ? { price: activity.price } : {}),
    marketTitle: firstNonEmpty(activity.title, activity.slug, "Untitled market") ?? "Untitled market",
    ...(activity.outcome ? { outcome: activity.outcome } : {}),
    timestamp: activity.timestamp,
    ...(activity.transactionHash ? { transactionHash: activity.transactionHash } : {}),
    ...(trader?.rank ? { leaderboardRank: trader.rank } : {}),
    ...(trader?.vol !== undefined ? { leaderboardVolume: trader.vol } : {}),
    ...(trader?.pnl !== undefined ? { leaderboardPnl: trader.pnl } : {}),
    ...(activity.profileImageOptimized ? { iconUrl: activity.profileImageOptimized } : activity.profileImage ? { iconUrl: activity.profileImage } : {}),
  };
}

function buildAlertId(activity: UserActivity): string {
  if (activity.transactionHash) {
    return `${activity.proxyWallet}:${activity.transactionHash}:${activity.outcome ?? "?"}`;
  }

  return [
    activity.proxyWallet,
    activity.timestamp,
    activity.side ?? "?",
    activity.outcome ?? "?",
    activity.title ?? activity.slug ?? "?",
    activity.usdcSize ?? "?",
  ].join(":");
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => Boolean(value && value.trim()));
}

function shortenWallet(wallet: string): string {
  if (wallet.length <= 12) {
    return wallet;
  }

  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
